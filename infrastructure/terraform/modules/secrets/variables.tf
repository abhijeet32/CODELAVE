variable "environment" {
  description = "The deployment environment (dev, staging, prod)"
  type        = string
}

variable "kms_key_arn" {
  description = "Optional ARN of a customer-managed KMS key for encrypting secrets. If empty, uses the AWS-managed default key."
  type        = string
  default     = ""
}

variable "recovery_window_days" {
  description = "Number of days before a deleted secret is permanently destroyed. Set to 0 to allow immediate deletion (useful in dev/test)."
  type        = number
  default     = 30
}
