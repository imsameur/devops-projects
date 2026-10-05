# Resource Cleanup

Perform cleanup after saving screenshots and pushing all project files
to GitHub.

## 1. Terminate the EC2 instance

- Open EC2 in ap-southeast-1 (Singapore).
- Select project-07-web-server.
- Verify the instance ID before proceeding.
- Choose Instance state > Terminate instance.
- Wait until the instance state is Terminated.

Termination permanently removes access to files on the instance.
Confirm the GitHub push before terminating.

## 2. Verify EBS cleanup

- Open EC2 > Volumes.
- Verify the root volume was deleted through Delete on termination.
- If a volume remains, verify it belongs to this project and is
  unattached before deleting it.
- Keep volumes used by other projects.

## 3. Verify public IP cleanup

This project used an auto-assigned public IPv4 address.
It is released when the instance is terminated.

No Elastic IP was allocated for this project.
If an Elastic IP was separately allocated for the lab, disassociate
and release it after verifying ownership.

## 4. Delete the project Security Group

- Open EC2 > Security Groups.
- Find project-07-web-sg.
- Verify it is no longer associated with any network interface.
- Delete it when unused.

## 5. Keep shared resources

- Keep devops-projects-key if other projects use it.
- Keep the default VPC, subnets, route tables and internet gateway.
- This project does not require deleting shared network resources.

## Final checks

- Project instance is terminated.
- No project EBS volume remains.
- No project Elastic IP remains allocated.
- Project Security Group is deleted when unused.
- Code, documentation and screenshots are available on GitHub.
