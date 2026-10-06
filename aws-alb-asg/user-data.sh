#!/bin/bash
set -euxo pipefail

# Install the web server
dnf install -y nginx

# Identify the server responding to requests
SERVER_NAME=$(hostname)

# Create the application page
cat > /usr/share/nginx/html/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>ALB and ASG</title>
</head>
<body>
    <h1>Application Availability</h1>
    <p>Application is running.</p>
    <p>Server: ${SERVER_NAME}</p>
</body>
</html>
EOF

# Create the health-check endpoint
echo "healthy" > /usr/share/nginx/html/health

# Start Nginx and enable it after reboot
systemctl enable --now nginx
