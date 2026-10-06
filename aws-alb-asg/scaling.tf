resource "aws_autoscaling_policy" "requests" {
  name                   = "project10-request-scaling"
  autoscaling_group_name = aws_autoscaling_group.web.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"

      resource_label = "${aws_lb.app.arn_suffix}/${aws_lb_target_group.web.arn_suffix}"
    }

    target_value = 100
  }
}