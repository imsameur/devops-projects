resource "aws_launch_template" "web" {
  name_prefix   = "project10-web-"
  image_id      = var.ami_id
  instance_type = var.instance_type

  vpc_security_group_ids = [
    aws_security_group.web.id
  ]

  user_data = filebase64("${path.module}/user-data.sh")

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "Project10-Web-Server"
    }
  }
}