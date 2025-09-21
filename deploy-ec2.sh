#!/bin/bash

# EC2 Deployment Script for Medical AI Agent
# This script sets up both frontend and backend on the same EC2 instance

echo "🚀 Starting EC2 Deployment for Medical AI Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on EC2
if [[ ! -f /home/ubuntu ]]; then
    print_warning "This script is designed for Ubuntu EC2 instances"
fi

# Set variables
PROJECT_DIR="/home/ubuntu/medVoiceAgent"
DOMAIN="medai.somn.in"
BACKEND_PORT=4000
FRONTEND_PORT=3000

print_status "Setting up Medical AI Agent on EC2..."
print_status "Domain: ${DOMAIN}"
print_status "Project Directory: ${PROJECT_DIR}"

# Step 1: Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js if not installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Step 3: Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# Step 4: Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl enable nginx
fi

# Step 5: Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot for SSL..."
    sudo apt install certbot python3-certbot-nginx -y
fi

# Step 6: Setup MongoDB (optional - you can use Atlas)
if ! command -v mongod &> /dev/null; then
    print_status "Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Step 7: Create project directory and clone/pull code
if [[ ! -d "$PROJECT_DIR" ]]; then
    print_status "Cloning repository..."
    cd /home/ubuntu
    git clone https://github.com/your-username/medicalAiAgent.git medVoiceAgent
else
    print_status "Updating repository..."
    cd "$PROJECT_DIR"
    git pull origin main
fi

# Step 8: Setup backend
print_status "Setting up backend..."
cd "$PROJECT_DIR/medbackend"

# Create backend environment file
cat > .env << EOF
# Database Configuration
MONGO_URI=mongodb://localhost:27017/medicalai

# JWT Configuration
JWT_SECRET=super-secret-jwt-key-for-production-make-it-very-long-and-random-12345678
JWT_EXPIRY=24h

# OpenMic API Configuration
OPENMIC_API_KEY=your_openmic_api_key_here

# Server Configuration
PORT=$BACKEND_PORT
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://$DOMAIN
EOF

# Install dependencies and build
npm install
npm run build

# Step 9: Setup frontend
print_status "Setting up frontend..."
cd "$PROJECT_DIR/medfrontend"

# Create frontend environment file
echo "NEXT_PUBLIC_BACKEND=https://$DOMAIN/api" > .env.production

# Install dependencies and build
npm install
npm run build

# Step 10: Create PM2 ecosystem configuration
print_status "Creating PM2 configuration..."
cd "$PROJECT_DIR"

cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [
    {
      name: 'medical-ai-backend',
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/medVoiceAgent/medbackend',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/home/ubuntu/logs/backend-err.log',
      out_file: '/home/ubuntu/logs/backend-out.log',
      log_file: '/home/ubuntu/logs/backend-combined.log',
      time: true,
      restart_delay: 1000,
      max_restarts: 10
    },
    {
      name: 'medical-ai-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/medVoiceAgent/medfrontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_BACKEND: 'https://medai.somn.in/api'
      },
      error_file: '/home/ubuntu/logs/frontend-err.log',
      out_file: '/home/ubuntu/logs/frontend-out.log',
      log_file: '/home/ubuntu/logs/frontend-combined.log',
      time: true,
      restart_delay: 1000,
      max_restarts: 10
    }
  ]
}
EOF

# Step 11: Create logs directory
mkdir -p /home/ubuntu/logs

# Step 12: Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Backend API routes
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://$DOMAIN' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PATCH, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://$DOMAIN';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PATCH, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            return 204;
        }
    }

    # Frontend routes
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
if [[ $? -eq 0 ]]; then
    print_status "Nginx configuration is valid"
    sudo systemctl restart nginx
else
    print_error "Nginx configuration error"
    exit 1
fi

# Step 13: Start applications with PM2
print_status "Starting applications with PM2..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

# Step 14: Seed database (optional)
print_status "Seeding database..."
cd "$PROJECT_DIR/medbackend"
npm run seed || print_warning "Database seeding failed - you may need to configure MongoDB"

# Step 15: Setup SSL certificate
print_status "Setting up SSL certificate..."
print_warning "Make sure your domain $DOMAIN points to this server's IP address"
read -p "Have you configured your DNS? Press Enter to continue with SSL setup, or Ctrl+C to cancel..."

sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || print_warning "SSL setup failed - you can run 'sudo certbot --nginx -d $DOMAIN' manually later"

# Step 16: Create update script
print_status "Creating update script..."
cat > /home/ubuntu/update-medical-ai.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating Medical AI Application..."

cd /home/ubuntu/medVoiceAgent

# Pull latest changes
git pull origin main

# Update backend
cd medbackend
npm install
npm run build

# Update frontend
cd ../medfrontend
npm install
npm run build

# Restart applications
pm2 restart all

echo "✅ Update complete!"
pm2 status
EOF

chmod +x /home/ubuntu/update-medical-ai.sh

print_status "Deployment complete!"
print_status "Your Medical AI Agent is now running at: https://$DOMAIN"
print_status ""
print_status "Useful commands:"
print_status "  - Check status: pm2 status"
print_status "  - View logs: pm2 logs"
print_status "  - Update application: ./update-medical-ai.sh"
print_status "  - Monitor: pm2 monit"
print_status ""
print_status "🎉 Setup complete! Your application should be accessible at https://$DOMAIN"
