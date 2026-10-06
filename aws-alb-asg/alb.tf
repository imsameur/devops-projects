# Application Load Balancer across two Availability Zones
resource "aws_lb" "app" {
  name               = "project10-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.Public.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name = "Project10-ALB"
  }
}

# Web servers will register in this target group
resource "aws_lb_target_group" "web" {
  name        = "project10-web-tg"
  port        = 80
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = aws_vpc.main.id

  deregistration_delay = 30

  health_check {
    enabled             = true
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "Project10-Web-TG"
  }
}

# Forward incoming HTTP requests to the target group
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}