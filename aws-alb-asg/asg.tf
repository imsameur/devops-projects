resource "aws_autoscaling_group" "web" {
  name = "project10-web-asg"

  min_size         = 2
  desired_capacity = 2
  max_size         = 3

  vpc_zone_identifier = [
    aws_subnet.Public.id,
    aws_subnet.public_b.id
  ]

  target_group_arns = [
    aws_lb_target_group.web.arn
  ]

  health_check_type         = "ELB"
  health_check_grace_period = 180
  default_instance_warmup   = 180

  launch_template {
    id      = aws_launch_template.web.id
    version = aws_launch_template.web.latest_version
  }

  tag {
    key                 = "Name"
    value               = "Project10-Web-Server"
    propagate_at_launch = true
  }

  depends_on = [
    aws_lb_listener.http,
    aws_route_table_association.public,
    aws_route_table_association.public_b
  ]

  lifecycle {
    ignore_changes = [desired_capacity]
  }
}