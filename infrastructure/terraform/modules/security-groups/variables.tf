variable "vpc_id" {
  description = "The ID of the VPC to create security groups in"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block of the VPC — used to restrict SSH to internal traffic only"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod) — used for tagging and naming"
  type        = string
}
