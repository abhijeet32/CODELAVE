# =============================================================================
# REMOTE STATE BACKEND RESOURCES
# Must be created first. All other environments depend on this S3 bucket
# and DynamoDB table for storing and locking their Terraform state.
# =============================================================================

# --- S3 Bucket for Terraform State ---
resource "aws_s3_bucket" "tf_state" {
  bucket = var.state_bucket_name

  # Prevent accidental deletion of this critical bucket
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name    = var.state_bucket_name
    Purpose = "terraform-remote-state"
  }
}

resource "aws_s3_bucket_versioning" "tf_state" {
  bucket = aws_s3_bucket.tf_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tf_state" {
  bucket = aws_s3_bucket.tf_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tf_state" {
  bucket                  = aws_s3_bucket.tf_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}



# =============================================================================
# IAM — ADMIN GROUP & USER (Non-Root)
# All human operators belong to this group. The MFA enforcement policy ensures
# that no meaningful action can be taken without MFA active.
# =============================================================================

# --- MFA Enforcement Policy ---
# This policy denies ALL API calls unless the caller has authenticated with MFA.
# The only exceptions are the actions needed to set up MFA itself.
resource "aws_iam_policy" "require_mfa" {
  name        = "RequireMFA"
  description = "Deny all actions unless the user has authenticated with MFA"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowViewAccountInfo"
        Effect = "Allow"
        Action = [
          "iam:GetAccountPasswordPolicy",
          "iam:GetAccountSummary",
          "iam:ListVirtualMFADevices"
        ]
        Resource = "*"
      },
      {
        Sid    = "AllowManageOwnMFA"
        Effect = "Allow"
        Action = [
          "iam:CreateVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:GetUser",
          "iam:ListMFADevices",
          "iam:ListUsers",
          "iam:ResyncMFADevice",
          "sts:GetSessionToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "DenyAllWithoutMFA"
        Effect = "Deny"
        NotAction = [
          "iam:CreateVirtualMFADevice",
          "iam:EnableMFADevice",
          "iam:GetUser",
          "iam:ListMFADevices",
          "iam:ListVirtualMFADevices",
          "iam:ResyncMFADevice",
          "sts:GetSessionToken"
        ]
        Resource = "*"
        Condition = {
          BoolIfExists = {
            "aws:MultiFactorAuthPresent" = "false"
          }
        }
      }
    ]
  })
}

# --- Admin IAM Group ---
resource "aws_iam_group" "admins" {
  name = "codelave-admins"
}

resource "aws_iam_group_policy_attachment" "admins_full_access" {
  group      = aws_iam_group.admins.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_iam_group_policy_attachment" "admins_require_mfa" {
  group      = aws_iam_group.admins.name
  policy_arn = aws_iam_policy.require_mfa.arn
}

# --- Non-Root Admin IAM User ---
resource "aws_iam_user" "admin" {
  name          = var.admin_username
  force_destroy = true # Allows Terraform to delete even if user has keys/certs

  tags = {
    Purpose = "human-operator-admin"
  }
}

resource "aws_iam_user_group_membership" "admin" {
  user   = aws_iam_user.admin.name
  groups = [aws_iam_group.admins.name]
}

# Login profile forces a password change on first login
resource "aws_iam_user_login_profile" "admin" {
  user                    = aws_iam_user.admin.name
  password_reset_required = true

  lifecycle {
    # Prevent Terraform from regenerating the password on every plan
    ignore_changes = [password_length, password_reset_required, pgp_key]
  }
}


# =============================================================================
# IAM — SERVICE ROLES
# These roles are assumed by AWS services (EC2, CI/CD) rather than humans.
# They follow the principle of least privilege.
# =============================================================================

# --- Role 1: API Server Role (assumed by EC2 instances running the API) ---
resource "aws_iam_role" "api_server" {
  name        = "CodelaveAPIServerRole"
  description = "Assumed by EC2 instances running the Codelave API server"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "api_server_policy" {
  name = "CodelaveAPIServerPolicy"
  role = aws_iam_role.api_server.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ReadSecrets"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:codelave/*"
      },
      {
        Sid    = "WriteLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:log-group:/codelave/*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "api_server" {
  name = "CodelaveAPIServerInstanceProfile"
  role = aws_iam_role.api_server.name
}

# --- Role 2: Sandbox Host Role (assumed by Firecracker bare-metal hosts) ---
resource "aws_iam_role" "sandbox_host" {
  name        = "CodelAveSandboxHostRole"
  description = "Assumed by bare-metal/EC2 Firecracker sandbox host instances"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "sandbox_host_policy" {
  name = "CodelAveSandboxHostPolicy"
  role = aws_iam_role.sandbox_host.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DescribeInstances"
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeTags"
        ]
        Resource = "*"
      },
      {
        Sid    = "ReadSandboxPayloads"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::codelave-sandbox-payloads",
          "arn:aws:s3:::codelave-sandbox-payloads/*"
        ]
      },
      {
        Sid    = "WriteLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:log-group:/codelave/sandbox/*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "sandbox_host" {
  name = "CodelAveSandboxHostInstanceProfile"
  role = aws_iam_role.sandbox_host.name
}

# --- Role 3: CI/CD Pipeline Role (assumed via GitHub Actions OIDC) ---
# This eliminates the need for static AWS access keys in GitHub secrets.
# GitHub Actions authenticates via OIDC and exchanges a short-lived token.
resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint — stable, but can be re-fetched if needed
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

resource "aws_iam_role" "cicd_pipeline" {
  name        = "CodelAveCICDPipelineRole"
  description = "Assumed by GitHub Actions CI/CD pipeline via OIDC — no static keys"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github_actions.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
        }
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "cicd_pipeline_policy" {
  name = "CodelAveCICDPipelinePolicy"
  role = aws_iam_role.cicd_pipeline.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRAccess"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "*"
      },
      {
        Sid    = "TerraformStateAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.state_bucket_name}",
          "arn:aws:s3:::${var.state_bucket_name}/*"
        ]
      }
    ]
  })
}


# =============================================================================
# BILLING ALERT
# AWS Budgets alert via email when monthly spend exceeds the threshold.
# NOTE: You must manually enable "Receive Billing Alerts" in the AWS Billing
# Console → Billing Preferences before this takes effect.
# =============================================================================

resource "aws_budgets_budget" "monthly" {
  name         = "codelave-monthly-budget"
  budget_type  = "COST"
  limit_amount = var.monthly_budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }
}
