output "vpc_id" {
  description = "Project VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnets in two Availability Zones"

  value = [
    aws_subnet.Public.id,
    aws_subnet.public_b.id
  ]
}

output "alb_url" {
  description = "Application URL through the ALB"
  value       = "http://${aws_lb.app.dns_name}"
}

output "target_group_arn" {
  description = "Target group ARN for health verification"
  value       = aws_lb_target_group.web.arn
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.web.name
}

output "web_security_group_id" {
  description = "Web server Security Group ID"
  value       = aws_security_group.web.id
}