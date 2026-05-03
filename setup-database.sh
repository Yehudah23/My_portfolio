#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}Portfolio Database Setup Script${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# Check if MySQL is running
echo -e "${BLUE}Checking MySQL service...${NC}"
if ! pgrep -x "mysqld" > /dev/null; then
    echo -e "${RED}MySQL is not running. Please start XAMPP/LAMPP first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MySQL is running${NC}"
echo ""

# Copy PHP files to LAMPP htdocs
echo -e "${BLUE}Copying PHP files to /opt/lampp/htdocs/myportfolio/php...${NC}"
sudo mkdir -p /opt/lampp/htdocs/myportfolio/php
sudo cp -r php/* /opt/lampp/htdocs/myportfolio/php/
sudo chmod -R 755 /opt/lampp/htdocs/myportfolio/php
sudo mkdir -p /opt/lampp/htdocs/myportfolio/php/logs
sudo chmod -R 777 /opt/lampp/htdocs/myportfolio/php/logs
echo -e "${GREEN}✓ PHP files copied${NC}"
echo ""

# Create database and tables
echo -e "${BLUE}Setting up database...${NC}"
mysql -u root -p << 'EOF'
SOURCE php/database.sql;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database created successfully${NC}"
else
    echo -e "${RED}✗ Database creation failed${NC}"
    exit 1
fi
echo ""

# Update config if needed
echo -e "${BLUE}Configuration:${NC}"
echo "Database: myportfolio"
echo "User: root"
echo "Password: (empty)"
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update email settings in /opt/lampp/htdocs/myportfolio/php/config.php"
echo "2. Start PHP server: cd /opt/lampp/htdocs/myportfolio && php -S localhost:8000 -t php"
echo "3. Start Angular: npm start"
echo ""
