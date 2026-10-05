# Architecture

## Request flow

- Visitors send HTTP requests to the EC2 public IPv4 address.
- The Security Group allows inbound TCP port 80.
- Nginx serves the static website from /usr/share/nginx/html/index.html.
- Administrators connect over SSH on TCP port 22 from their current public IP /32.

## Deployment configuration

- Region: ap-southeast-1 (Singapore)
- Instance name: project-07-web-server
- Instance type: t3.micro
- OS: Amazon Linux 2023, x86_64
- AMI used in this lab: ami-01a395a37625fb28c
- Root storage: 8 GiB gp3
- Public IPv4: Auto-assigned
- Web server: Nginx
- Website: Mini Shop by Niyamoter shad

## Bootstrap

EC2 user data runs the Bash script during the first boot.
The script installs Nginx, writes the website, checks the Nginx
configuration, and enables and starts the service.

The HTML is embedded in user-data.sh, so a new instance does not
need to download website files from GitHub.

website/index.html is the readable website source. Keep its content
in sync with the HTML embedded in user-data.sh.

## Reboot behavior

User data runs once by default.
Nginx starts after reboot because its systemd service is enabled.
The website remains stored on the root EBS volume.

## Network requirements

The instance uses a subnet with an internet gateway route.
A public IPv4 address and outbound access are required for package
installation and public website access.

## Scope

This lab uses one EC2 instance and HTTP.
HTTPS, a load balancer, and high availability are outside this project.
The AMI ID is region-specific. Record the selected AMI when repeating
the deployment.
