# Allow users to access the ALB
resource "aws_security_group" "alb" {
  name        = "project10-alb-sg"
  description = "Allow HTTP access to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP from users"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Project10-ALB-SG"
  }
}

# Allow web server access only from the ALB
resource "aws_security_group" "web" {
  name        = "project10-web-sg"
  description = "Allow HTTP only from ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Project10-Web-SG"
  }
}