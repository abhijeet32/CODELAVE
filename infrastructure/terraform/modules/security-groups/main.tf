# =============================================================================
# SECURITY GROUPS MODULE
# Creates four security groups that enforce strict least-privilege access:
#
#   1. api_server    — public-facing; accepts HTTP/HTTPS from internet
#   2. sandbox_host  — internal only; accepts traffic from API server SG
#   3. database      — PostgreSQL; accepts ONLY from api_server + sandbox_host
#   4. redis         — Redis; accepts ONLY from api_server
#
# DB and Redis groups never whitelist 0.0.0.0/0 — they reference SG IDs.
# =============================================================================

# -----------------------------------------------------------------------------
# 1. ALB Security Group
#    Lives in the public subnet. Accepts HTTP/HTTPS from the public internet.
# -----------------------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "codelave-sg-alb-${var.environment}"
  description = "ALB: allow HTTP/HTTPS from internet"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "codelave-sg-alb-${var.environment}"
    Environment = var.environment
    Role        = "alb"
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 2. API Server Security Group
#    Lives in the private subnet.
#    Accepts HTTP (80) ONLY from the ALB.
#    Accepts SSH (22) from within the VPC CIDR.
# -----------------------------------------------------------------------------
resource "aws_security_group" "api_server" {
  name        = "codelave-sg-api-server-${var.environment}"
  description = "API server: allow HTTP from ALB only, SSH from VPC only"
  vpc_id      = var.vpc_id

  # HTTP — allow ONLY from ALB
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # SSH — restricted to VPC CIDR only (bastion or SSM jump)
  ingress {
    description = "SSH from within VPC only (no public SSH)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # Allow all outbound
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "codelave-sg-api-server-${var.environment}"
    Environment = var.environment
    Role        = "api-server"
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 2. Sandbox Host Security Group
#    Lives in the private subnet; runs Firecracker microVMs.
#    Only the API server is allowed to initiate connections to it.
# -----------------------------------------------------------------------------
resource "aws_security_group" "sandbox_host" {
  name        = "codelave-sg-sandbox-host-${var.environment}"
  description = "Sandbox host: accept connections from API server SG only"
  vpc_id      = var.vpc_id

  # Accept any port from the API server SG (gRPC, custom control plane ports)
  ingress {
    description     = "All traffic from API server"
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.api_server.id]
  }

  # Allow all outbound — sandbox hosts pull images, kernels, payloads via NAT
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "codelave-sg-sandbox-host-${var.environment}"
    Environment = var.environment
    Role        = "sandbox-host"
    ManagedBy   = "terraform"
  }
}

