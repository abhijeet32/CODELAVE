resource "aws_instance" "codelave_server" {
  ami                         = var.ami_id
  instance_type               = var.server_instance_type
  subnet_id                   = var.private_subnet_ids[0]
  vpc_security_group_ids      = [var.api_sg_id]
  associate_public_ip_address = false # Private subnet, should not have public IP

  tags = {
    Name = "codelave-server"
  }
}

resource "aws_instance" "sandbox_host" {
  ami                         = var.ami_id
  instance_type               = var.sandbox_instance_type
  subnet_id                   = var.private_subnet_ids[1]
  vpc_security_group_ids      = [var.sandbox_sg_id]
  associate_public_ip_address = false # Private subnet, should not have public IP

  tags = {
    Name = "sandbox-host"
  }
}

resource "aws_lb" "codelave_alb" {
  name               = "codelave-alb"
  load_balancer_type = "application"
  subnets            = var.public_subnet_ids
  security_groups    = [var.alb_sg_id]

  tags = {
    Name = "codelave-alb"
  }
}

resource "aws_lb_target_group" "codelave_tg" {
  name        = "codelave-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"
}

resource "aws_lb_target_group_attachment" "codelave_server" {
  target_group_arn = aws_lb_target_group.codelave_tg.arn
  target_id        = aws_instance.codelave_server.id
  port             = 80
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.codelave_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.codelave_tg.arn
  }
}
