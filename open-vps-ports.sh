#!/bin/bash

# Comprehensive Port Opening Script for VPS
echo "🔥 Opening all necessary ports on VPS..."
echo "🌐 VPS IP: 65.108.27.195"
echo ""

# List of ports we need to open
PORTS=(
    3000  # Frontend
    3001  # Backend
    27017 # MongoDB
    22    # SSH (in case it's not open)
    80    # HTTP (for future use)
    443   # HTTPS (for future use)
)

echo "📋 Opening the following ports:"
for port in "${PORTS[@]}"; do
    echo "   Port $port"
done
echo ""

# Function to open port with UFW
open_port_ufw() {
    local port=$1
    echo "Opening port $port with UFW..."
    ufw allow $port/tcp
    ufw allow $port/udp
}

# Function to open port with iptables
open_port_iptables() {
    local port=$1
    echo "Opening port $port with iptables..."
    iptables -A INPUT -p tcp --dport $port -j ACCEPT
    iptables -A INPUT -p udp --dport $port -j ACCEPT
}

# Check and open ports with UFW
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring UFW firewall..."
    for port in "${PORTS[@]}"; do
        open_port_ufw $port
    done
    echo "✅ UFW rules added"
    echo ""
fi

# Check and open ports with iptables
if command -v iptables &> /dev/null; then
    echo "🔥 Configuring iptables..."
    for port in "${PORTS[@]}"; do
        open_port_iptables $port
    done
    echo "✅ iptables rules added"
    echo ""
fi

# Check if firewalld is being used (common on CentOS/RHEL)
if command -v firewall-cmd &> /dev/null; then
    echo "🔥 Configuring firewalld..."
    for port in "${PORTS[@]}"; do
        echo "Opening port $port with firewalld..."
        firewall-cmd --permanent --add-port=$port/tcp
        firewall-cmd --permanent --add-port=$port/udp
    done
    firewall-cmd --reload
    echo "✅ firewalld rules added and reloaded"
    echo ""
fi

# Check if nftables is being used (newer Linux systems)
if command -v nft &> /dev/null; then
    echo "🔥 Configuring nftables..."
    for port in "${PORTS[@]}"; do
        echo "Opening port $port with nftables..."
        nft add rule inet filter input tcp dport $port accept
        nft add rule inet filter input udp dport $port accept
    done
    echo "✅ nftables rules added"
    echo ""
fi

# Show current firewall status
echo "📊 Current firewall status:"
echo ""

if command -v ufw &> /dev/null; then
    echo "UFW Status:"
    ufw status
    echo ""
fi

if command -v iptables &> /dev/null; then
    echo "iptables rules for our ports:"
    iptables -L INPUT -n | grep -E "(3000|3001|27017|22|80|443)" || echo "No iptables rules found for our ports"
    echo ""
fi

if command -v firewall-cmd &> /dev/null; then
    echo "firewalld status:"
    firewall-cmd --list-ports
    echo ""
fi

# Test if ports are accessible
echo "🧪 Testing port accessibility..."
echo "Note: These tests will only work if services are running"
echo ""

for port in "${PORTS[@]}"; do
    if nc -z localhost $port 2>/dev/null; then
        echo "✅ Port $port is listening locally"
    else
        echo "❌ Port $port is not listening locally (service may not be running)"
    fi
done

echo ""
echo "✅ Port opening complete!"
echo ""
echo "🌐 Your services should be accessible at:"
echo "   Frontend: http://65.108.27.195:3000"
echo "   Backend: http://65.108.27.195:3001"
echo "   API Docs: http://65.108.27.195:3001/api"
echo "   MongoDB: 65.108.27.195:27017"
echo ""
echo "🚀 Next steps:"
echo "   1. Start your services: ./start-docker.sh"
echo "   2. Test connectivity: ./test-vps-connectivity.sh"
echo ""
echo "⚠️  Important: If you're using a cloud provider (AWS, DigitalOcean, etc.),"
echo "   you may also need to configure their security groups/firewall rules"
echo "   to allow traffic on these ports."
