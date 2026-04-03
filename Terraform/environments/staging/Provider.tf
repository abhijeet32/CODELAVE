provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Codelave"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
