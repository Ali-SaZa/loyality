# Cloud Provider Firewall Configuration Guide

This guide explains how to configure firewall rules on popular cloud providers to allow access to your VPS.

## Common Cloud Providers

### 1. DigitalOcean

If you're using DigitalOcean, you need to configure their firewall:

1. **Go to DigitalOcean Dashboard**
2. **Navigate to Networking → Firewalls**
3. **Create a new firewall or edit existing one**
4. **Add the following rules:**

```
Inbound Rules:
- HTTP (Port 80) - Allow
- HTTPS (Port 443) - Allow
- Custom Port 3000 - Allow (Frontend)
- Custom Port 3001 - Allow (Backend)
- Custom Port 27017 - Allow (MongoDB)
- SSH (Port 22) - Allow

Outbound Rules:
- All Traffic - Allow
```

### 2. AWS EC2

If you're using AWS EC2:

1. **Go to EC2 Dashboard**
2. **Navigate to Security Groups**
3. **Select your instance's security group**
4. **Add the following inbound rules:**

```
Type: Custom TCP
Port: 3000
Source: 0.0.0.0/0 (or your IP range)

Type: Custom TCP
Port: 3001
Source: 0.0.0.0/0 (or your IP range)

Type: Custom TCP
Port: 27017
Source: 0.0.0.0/0 (or your IP range)

Type: SSH
Port: 22
Source: Your IP (for security)
```

### 3. Google Cloud Platform

If you're using GCP:

1. **Go to VPC Network → Firewall**
2. **Create a new firewall rule**
3. **Configure as follows:**

```
Name: loyalty-app-ports
Network: default
Priority: 1000
Direction: Ingress
Action: Allow
Targets: All instances
Source IP ranges: 0.0.0.0/0
Protocols and ports: tcp:3000,3001,27017,22
```

### 4. Azure

If you're using Azure:

1. **Go to Virtual Machines**
2. **Select your VM**
3. **Go to Networking**
4. **Add inbound port rules:**

```
Name: Frontend
Priority: 1000
Port: 3000
Protocol: TCP
Source: Any

Name: Backend
Priority: 1001
Port: 3001
Protocol: TCP
Source: Any

Name: MongoDB
Priority: 1002
Port: 27017
Protocol: TCP
Source: Any
```

### 5. Linode

If you're using Linode:

1. **Go to Firewalls in Linode Dashboard**
2. **Create a new firewall**
3. **Add inbound rules:**

```
Label: Frontend
Protocol: TCP
Port: 3000
Action: Accept

Label: Backend
Protocol: TCP
Port: 3001
Action: Accept

Label: MongoDB
Protocol: TCP
Port: 27017
Action: Accept

Label: SSH
Protocol: TCP
Port: 22
Action: Accept
```

## Complete Setup Process

### Step 1: Configure Cloud Provider Firewall

Follow the instructions above for your specific cloud provider.

### Step 2: Configure VPS Firewall

Run the port opening script on your VPS:

```bash
./open-vps-ports.sh
```

### Step 3: Start Services

```bash
./start-docker.sh
```

### Step 4: Test Connectivity

From your local system:

```bash
./test-vps-connectivity.sh
```

## Security Recommendations

### For Production:

1. **Restrict SSH access** to your specific IP address
2. **Use HTTPS** instead of HTTP (ports 80/443)
3. **Consider using a reverse proxy** (nginx) to handle traffic
4. **Restrict MongoDB access** to only necessary IPs
5. **Use strong passwords** and JWT secrets

### For Development:

1. **Allow all traffic** on your app ports for easier testing
2. **Keep SSH access** restricted to your IP
3. **Monitor logs** for any suspicious activity

## Troubleshooting

### If ports still don't work:

1. **Check cloud provider firewall** - This is the most common issue
2. **Verify VPS firewall** - Run `./open-vps-ports.sh`
3. **Check if services are running** - Run `./troubleshoot-vps.sh`
4. **Test from VPS itself** - Try `curl localhost:3001/api`

### Common Issues:

- **Cloud provider firewall blocking traffic** - Most common issue
- **VPS firewall not configured** - Run the port opening script
- **Services not running** - Start Docker services
- **Wrong port bindings** - Check Docker Compose configuration

## Quick Commands Reference

```bash
# On VPS - Open all ports
./open-vps-ports.sh

# On VPS - Start services
./start-docker.sh

# On VPS - Troubleshoot
./troubleshoot-vps.sh

# On local system - Test connectivity
./test-vps-connectivity.sh
```
