# =============================================================================
# SECRETS MANAGER — Per-Environment Placeholder Secrets
#
# These create the secret "containers" in AWS Secrets Manager. The actual
# secret values are intentionally NOT set here (never store secrets in
# Terraform state). Populate them manually via the AWS Console or CLI after
# the first apply:
#
#   aws secretsmanager put-secret-value \
#     --secret-id "codelave/dev/db-credentials" \
#     --secret-string '{"username":"admin","password":"changeme"}'
# =============================================================================

locals {
  # Use a customer-managed KMS key if provided, otherwise use no explicit key
  # (AWS Secrets Manager falls back to the AWS-managed default key)
  kms_key_id = var.kms_key_arn != "" ? var.kms_key_arn : null
}

# --- Database Credentials Secret ---
resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "codelave/${var.environment}/db-credentials"
  description = "Database credentials for the Codelave ${var.environment} environment"

  kms_key_id              = local.kms_key_id
  recovery_window_in_days = var.recovery_window_days

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Purpose     = "db-credentials"
  }
}

# Placeholder value — overwrite this manually with real credentials
resource "aws_secretsmanager_secret_version" "db_credentials_placeholder" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "REPLACE_ME"
    password = "REPLACE_ME"
    host     = "REPLACE_ME"
    port     = 5432
    dbname   = "codelave_${var.environment}"
  })

  lifecycle {
    # Terraform will not overwrite changes made to the secret value outside of Terraform
    ignore_changes = [secret_string]
  }
}

# --- API Keys Secret ---
resource "aws_secretsmanager_secret" "api_keys" {
  name        = "codelave/${var.environment}/api-keys"
  description = "Third-party API keys for the Codelave ${var.environment} environment"

  kms_key_id              = local.kms_key_id
  recovery_window_in_days = var.recovery_window_days

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Purpose     = "api-keys"
  }
}

resource "aws_secretsmanager_secret_version" "api_keys_placeholder" {
  secret_id = aws_secretsmanager_secret.api_keys.id
  secret_string = jsonencode({
    stripe_key    = "REPLACE_ME"
    sendgrid_key  = "REPLACE_ME"
    jwt_secret    = "REPLACE_ME"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
