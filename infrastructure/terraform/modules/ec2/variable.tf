variable "ami_id" {
  description = "The AMI ID to use for the EC2 instances"
  type        = string
}

variable "server_instance_type" {
  description = "Instance type for the API Server"
  type        = string
  default     = "t3.micro"
}

variable "sandbox_instance_type" {
  description = "Instance type for the Sandbox Host"
  type        = string
  default     = "t3.medium"
}

variable "vpc_id" {
  description = "The VPC ID where instances will be deployed"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs (for the ALB)"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs (for the instances)"
  type        = list(string)
}

variable "api_sg_id" {
  description = "Security Group ID for the API Server"
  type        = string
}

variable "alb_sg_id" {
  description = "Security Group ID for the ALB"
  type        = string
}

variable "sandbox_sg_id" {
  description = "Security Group ID for the Sandbox Host"
  type        = string
}
