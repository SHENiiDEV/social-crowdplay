# 🚀 Production Deployment Guide for crowdplay.net

This guide walks you through deploying the **Social CrowdPlay** platform to an Ubuntu/Debian VPS where **PHP 8.4-FPM, Nginx, MySQL, and SQLite** are already installed.

- **Domain**: `crowdplay.net` / `www.crowdplay.net`
- **Repository**: `https://github.com/SHENiiDEV/social-crowdplay.git`
- **PHP Version**: `PHP 8.4-FPM` (`/run/php/php8.4-fpm.sock`)
- **Web Root**: `/var/www/crowdplay.net/public`

---

## 📋 Table of Contents
1. [Prerequisites & System Setup](#1-prerequisites--system-setup)
2. [Clone Repository & Install Dependencies](#2-clone-repository--install-dependencies)
3. [Environment Configuration (.env)](#3-environment-configuration-env)
4. [Database Migration & Seeding](#4-database-migration--seeding)
5. [Frontend Asset Compilation (Vite)](#5-frontend-asset-compilation-vite)
6. [Directory Permissions](#6-directory-permissions)
7. [Nginx Configuration](#7-nginx-configuration)
8. [SSL Certificate with Certbot](#8-ssl-certificate-with-certbot)
9. [Cron & Queue Workers (Optional)](#9-cron--queue-workers)
10. [Verification & Maintenance Checklist](#10-verification--maintenance-checklist)

---

## 1. Prerequisites & System Setup

Ensure Node.js (v18+ or v20+), Composer, and required PHP 8.4 extensions are present on your VPS:

```bash
# Update package index
sudo apt update && sudo apt upgrade -y

# Verify PHP 8.4 & modules
php -v
php -m | grep -E "bcmath|ctype|curl|dom|fileinfo|mbstring|openssl|pdo_mysql|pdo_sqlite|tokenizer|xml"

# If missing any PHP 8.4 extensions:
sudo apt install -y php8.4-fpm php8.4-mysql php8.4-sqlite3 php8.4-mbstring \
    php8.4-xml php8.4-bcmath php8.4-curl php8.4-zip php8.4-intl unzip git curl

# Install Node.js 20.x (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Composer (if not installed)
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

---

## 2. Clone Repository & Install Dependencies

```bash
# Create directory structure
sudo mkdir -p /var/www/crowdplay.net
sudo chown -R $USER:$USER /var/www/crowdplay.net

# Clone repository
git clone https://github.com/SHENiiDEV/social-crowdplay.git /var/www/crowdplay.net
cd /var/www/crowdplay.net

# Install PHP dependencies (production optimized)
composer install --no-dev --optimize-autoloader

# Install Node dependencies
npm ci
```

---

## 3. Environment Configuration (.env)

Create and edit the production `.env` file:

```bash
cp .env.example .env
nano .env
```

### Production `.env` template:

```ini
APP_NAME="CrowdPlay Casino"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://crowdplay.net

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# --- DATABASE CONFIGURATION ---
# Option A: MySQL (Recommended for production)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crowdplay
DB_USERNAME=crowdplay_user
DB_PASSWORD=YOUR_SECURE_MYSQL_PASSWORD

# Option B: SQLite (Alternative)
# DB_CONNECTION=sqlite
# DB_DATABASE=/var/www/crowdplay.net/database/database.sqlite

# --- SESSION & CACHE ---
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=database
QUEUE_CONNECTION=database

# --- MAIL NOTIFICATIONS (Account Block Notices to Compliance) ---
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="compliance@crowdplay.net"
MAIL_FROM_NAME="CrowdPlay Security & Compliance"

# --- NEXUS GGR CASINO API INTEGRATION ---
GGR_AGENT_CODE=crowdplay
GGR_AGENT_TOKEN=c9540f990614ec0e60efa22d4c5fe5fe
GGR_AGENT_SECRET=7e49159d19c1db28e7f70966b1242606
GGR_API_URL=https://api.nexusggr.dev

# --- VITE ASSET CONFIG ---
VITE_APP_NAME="${APP_NAME}"
```

### Generate Application Key:
```bash
php artisan key:generate
```

---

## 4. Database Migration & Seeding

### If using MySQL:
```bash
# Create MySQL DB and User (via mysql client):
sudo mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS crowdplay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -u root -p -e "CREATE USER IF NOT EXISTS 'crowdplay_user'@'localhost' IDENTIFIED BY 'YOUR_SECURE_MYSQL_PASSWORD';"
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON crowdplay.* TO 'crowdplay_user'@'localhost';"
sudo mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### If using SQLite:
```bash
touch /var/www/crowdplay.net/database/database.sqlite
```

### Run Migrations & Game Synchronization:
```bash
cd /var/www/crowdplay.net

# Run all migrations
php artisan migrate --force

# Seed default admin and initial casino catalog
php artisan db:seed --force

# Fetch latest live slots catalog from Nexus GGR provider
php artisan ggr:sync-games
```

---

## 5. Frontend Asset Compilation (Vite)

Compile the React + Tailwind production assets:

```bash
cd /var/www/crowdplay.net
npm run build
```

---

## 6. Directory Permissions

Ensure `www-data` owns storage, cache, and bootstrap directories:

```bash
cd /var/www/crowdplay.net

# Set ownership to web server user
sudo chown -R www-data:www-data /var/www/crowdplay.net

# Set standard permissions
sudo find /var/www/crowdplay.net -type f -exec chmod 644 {} \;
sudo find /var/www/crowdplay.net -type d -exec chmod 755 {} \;

# Grant writable access to storage and cache
sudo chmod -R 775 /var/www/crowdplay.net/storage
sudo chmod -R 775 /var/www/crowdplay.net/bootstrap/cache

# If using SQLite:
# sudo chmod 775 /var/www/crowdplay.net/database
# sudo chmod 664 /var/www/crowdplay.net/database/database.sqlite
```

---

## 7. Nginx Configuration

Create the Nginx server block for `crowdplay.net`:

```bash
sudo nano /etc/nginx/sites-available/crowdplay.net
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name crowdplay.net www.crowdplay.net;
    root /var/www/crowdplay.net/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php index.html;

    charset utf-8;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml;

    # Maximum file upload size
    client_max_body_size 32M;

    # Main application routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Static Assets Caching
    location ~* \.(ico|css|js|gif|jpeg|jpg|png|woff|woff2|ttf|svg|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
        try_files $uri /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    # PHP 8.4-FPM FastCGI Handler
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300s;
        fastcgi_send_timeout 300s;
        fastcgi_read_timeout 300s;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Enable Site and Test Configuration:

```bash
sudo ln -s /etc/nginx/sites-available/crowdplay.net /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. SSL Certificate with Certbot

Install and run Certbot for Let's Encrypt SSL:

```bash
# Install certbot and nginx plugin (if not already installed)
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install certificate
sudo certbot --nginx -d crowdplay.net -d www.crowdplay.net

# Test automatic renewal
sudo certbot renew --dry-run
```

Certbot will automatically configure HTTPS redirect and TLS ciphers in `/etc/nginx/sites-available/crowdplay.net`.

---

## 9. Cron & Queue Workers

### 1. Configure Laravel Task Scheduler (Cron):
```bash
sudo crontab -u www-data -e
```
Add this line:
```cron
* * * * * cd /var/www/crowdplay.net && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Configure Systemd Queue Worker (Optional for background mail/jobs):
```bash
sudo nano /etc/systemd/system/crowdplay-worker.service
```

```ini
[Unit]
Description=CrowdPlay Laravel Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php8.4 /var/www/crowdplay.net/artisan queue:work --sleep=3 --tries=3 --max-time=3600
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now crowdplay-worker
```

---

## 10. Verification & Maintenance Checklist

### 1. Optimize Laravel Caches:
```bash
cd /var/www/crowdplay.net
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 2. Verify GGR Webhook Endpoint:
Provider callbacks must be reachable at:
`https://crowdplay.net/gold_api`

Test health check:
```bash
curl -X POST https://crowdplay.net/gold_api \
  -H "Content-Type: application/json" \
  -d '{"method":"user_balance","agent_code":"crowdplay","agent_secret":"7e49159d19c1db28e7f70966b1242606","user_code":"user_1"}'
```
Expected response:
```json
{"status":1,"msg":"SUCCESS","balance":10000,"user_balance":10000}
```

### 3. Deploying Future Updates:
```bash
cd /var/www/crowdplay.net
git pull origin main
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl restart php8.4-fpm
```
