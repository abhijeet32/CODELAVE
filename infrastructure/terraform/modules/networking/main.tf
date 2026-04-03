# =============================================================================
# NETWORKING MODULE
# Creates a production-ready, multi-AZ VPC with:
#   - 2 public subnets  (across 2 AZs) — for load balancers & NAT GWs
#   - 2 private subnets (across 2 AZs) — for API servers & sandbox hosts
#   - 1 Internet Gateway
#   - 2 NAT Gateways (one per AZ — HA design)
#   - 2 public route tables + 2 private route tables
# =============================================================================

# -----------------------------------------------------------------------------
# 1. VPC
# -----------------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "codelave-vpc-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 2. Public Subnets — one per AZ
#    Instances here get public IPs; they sit behind the IGW.
#    NAT Gateways also live here.
# -----------------------------------------------------------------------------
resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "codelave-public-subnet-${count.index + 1}-${var.environment}"
    Environment = var.environment
    Tier        = "public"
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 3. Private Subnets — one per AZ
#    No public IPs. Outbound traffic routes through the NAT GW in the same AZ.
# -----------------------------------------------------------------------------
resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "codelave-private-subnet-${count.index + 1}-${var.environment}"
    Environment = var.environment
    Tier        = "private"
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 4. Internet Gateway — the VPC's door to the public internet
# -----------------------------------------------------------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "codelave-igw-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 5. Elastic IPs & NAT Gateways — one per public subnet (HA design)
#    Each private subnet routes outbound traffic through the NAT GW
#    in the SAME AZ to avoid cross-AZ data transfer charges.
# -----------------------------------------------------------------------------
resource "aws_eip" "nat" {
  count  = 2
  domain = "vpc"

  tags = {
    Name        = "codelave-nat-eip-${count.index + 1}-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_nat_gateway" "nat" {
  count = 2

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id # NAT must live in public subnet

  tags = {
    Name        = "codelave-nat-gw-${count.index + 1}-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  depends_on = [aws_internet_gateway.igw]
}

# -----------------------------------------------------------------------------
# 6. Public Route Table
#    One shared table for both public subnets — all traffic goes to the IGW.
# -----------------------------------------------------------------------------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name        = "codelave-public-rt-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_route_table_association" "public" {
  count = 2

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# -----------------------------------------------------------------------------
# 7. Private Route Tables — one per AZ
#    Each private subnet routes outbound traffic through its OWN NAT GW
#    (same AZ) to avoid cross-AZ data transfer fees and single-NAT SPOF.
# -----------------------------------------------------------------------------
resource "aws_route_table" "private" {
  count = 2

  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[count.index].id
  }

  tags = {
    Name        = "codelave-private-rt-${count.index + 1}-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_route_table_association" "private" {
  count = 2

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}
