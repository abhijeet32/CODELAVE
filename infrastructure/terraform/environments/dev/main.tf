module "networking" {
  source = "../../modules/networking"

  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
}

module "security_groups" {
  source = "../../modules/security-groups"

  vpc_id      = module.networking.vpc_id
  vpc_cidr    = module.networking.vpc_cidr
  environment = var.environment
}

module "ec2" {
  source = "../../modules/ec2"

  ami_id                = "ami-0c7217cdde317cfec" # Generic Ubuntu 22.04 AMI, update as needed
  server_instance_type  = "t3.micro"
  sandbox_instance_type = "t3.medium"
  
  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
  
  api_sg_id     = module.security_groups.api_server_sg_id
  alb_sg_id     = module.security_groups.alb_sg_id
  sandbox_sg_id = module.security_groups.sandbox_host_sg_id
}
