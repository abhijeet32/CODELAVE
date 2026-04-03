variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block for the entire VPC (must be /16)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "List of CIDR blocks for the two public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.3.0/24"]

  validation {
    condition     = length(var.public_subnet_cidrs) == 2
    error_message = "Exactly 2 public subnet CIDRs are required (one per AZ)."
  }
}

variable "private_subnet_cidrs" {
  description = "List of CIDR blocks for the two private subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.2.0/24", "10.0.4.0/24"]

  validation {
    condition     = length(var.private_subnet_cidrs) == 2
    error_message = "Exactly 2 private subnet CIDRs are required (one per AZ)."
  }
}

variable "availability_zones" {
  description = "List of two Availability Zones to spread subnets across"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]

  validation {
    condition     = length(var.availability_zones) == 2
    error_message = "Exactly 2 Availability Zones are required."
  }
}
