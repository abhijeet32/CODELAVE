variable "admin_username" {
  description = "The username for the non-root Terraform-managed admin IAM user"
  type        = string
  default     = "codelave-admin"
}

variable "alert_email" {
  description = "Email address to receive billing and budget alerts"
  type        = string
}

variable "monthly_budget_limit" {
  description = "Monthly USD budget threshold that triggers an alert"
  type        = string
  default     = "5"
}

variable "state_bucket_name" {
  description = "Globally unique name for the S3 bucket that stores Terraform remote state"
  type        = string
}


variable "aws_region" {
  description = "The AWS region to deploy global resources into"
  type        = string
  default     = "us-east-1"
}

variable "github_org" {
  description = "GitHub organization name for the OIDC CI/CD trust policy (e.g. 'my-org')"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name for the OIDC CI/CD trust policy (e.g. 'CODELAVE')"
  type        = string
}
