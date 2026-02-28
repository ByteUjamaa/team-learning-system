# React and  Django Production Deployment (Step-by-Step)
### Docker + PostgreSQL + GitHub Actions (CI/CD) + Oracle server + Nginx + Gunicorn + Custom Domain + SSL

This repository demonstrates how to deploy a **Django application**  with **React** from local development to **production** using:
- Django  
- Docker & Docker Compose  
- PostgreSQL  
- GitHub Actions (CI/CD)  
- Oracle cloud server   
- Nginx
- Gunicorn
- Custom Domain
- SSL (Let’s Encrypt)

You will go step-by-step from:

**Local → Docker → GitHub → oracle server → Domain → HTTPS**

## Prerequisites

Install the following on your system:

- Git
- Python 3.10+  
- pip  
- Docker Desktop  
- VS Code (recommended)

  ## Step 1 — Clone the Project
```sh
git clone git@github.com:ByteUjamaa/team-learning-system.git
cd team-learning-system

```

## Run Django Locally (Without Docker)
Create virtual environment
```sh
cd Backend
python3 -m venv env
source env/bin/activate     # Mac / Linux
# OR
env\Scripts\activate        # Windows
```

Install dependencies
```sh
pip install -r requirements.txt
```
Create ```.env``` file
```sh
DEBUG=True
SECRET_KEY=<YOUR-SECRET-KEY>

# Database Settings
DB_NAME=<DATABASE-NAME>
DB_USER=<POSTGRES-USERNAME>
DB_PASSWORD=<YOUR-PASSWORD>
DB_HOST=db
DB_PORT=5432

# Email Configuration
EMAIL_HOST_USER=<YOUR-EMAIL-ADDRESS>
EMAIL_HOST_PASSWORD=<PASSWORD> # USE APP PASSWORD IF YOU ARE USING GMAIL
```

Create database tables and run the Django server
```sh
python manage.py migrate
python manage.py runserver


```Create ```.env``` file inside /Frontend/ directory and write:
```sh
on docker communicate using services and not localhost
VITE_SERVER_BASE_URL=http://backend:8000/
```
And run the frontend - React
```sh
npm install
npm run dev
```
## Create Dockerfile for backend
Create a new file "Dockerfile" inside /backend-drf/ folder
```sh
# Purpose: A Dockerfile is a step-by-step instruction file that tells Docker how to build and run our application.
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# gunicorn = production server, clickmart_main.wsgi:application = Django entry point, --bind 0.0.0.0:8000 = external traffic. Reminaing: tuning options
# A worker is just one instance of your Django app running inside Gunicorn.
CMD ["gunicorn", "team_system.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3" , "--timeout", "180"]
```

## Create Dockerfile for frontend
Create a new file "Dockerfile" inside /Frontend/ folder
```sh
# Stage 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build arguments for environment variables
ARG VITE_SERVER_BASE_URL

# This line passes an environment variable into the Docker container so the React app knows the backend API URL.
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

RUN npm run build

# Stage 2: Nginx, alpine means the lighter version of Nginx
FROM nginx:alpine

# Copy build output to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## On the root directory, create a file "docker-compose.yml"
```sh
services:
  db:
    image: postgres:16-alpine
    env_file:
      - .env.production
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./Backend
    ports:
      - "8000:8000"
    env_file:
      - ./Backend/.env.docker
    depends_on:
      - db
    volumes:
      - ./Backend/staticfiles:/app/staticfiles
      - ./Backend/media:/app/media
    command: >
      sh -c "python manage.py collectstatic --noinput &&
             python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"

  frontend:
    build:
      context: ./Frontend
      args:
        VITE_SERVER_BASE_URL: "http://backend:8000/"
    ports:
      - "5173:80"
    depends_on:
      - backend


# This creates a named Docker volume to permanently store PostgreSQL data.
# Without this:
  # Database data is stored inside the container
  # If container is deleted → data is lost
# With this:
  # Data is stored in a Docker-managed volume
  # Data persists even if container stops or restarts
volumes:
  postgres_data:
```

Make sure to create a copy of ```.env``` and name it as ```.env.docker```
```sh
SECRET_KEY=<YOUR-DJANGO-SECRETKEY>
DEBUG=True

# Database Settings
DB_NAME=<YOUR_DOCKER-DB>
DB_USER=postgres
DB_PASSWORD=<PASSWORD>
DB_HOST=db
DB_PORT=5432


EMAIL_HOST_USER=<YOUR-EMAIL-ADDRESS>
EMAIL_HOST_PASSWORD=<YOUR-PASSWORD> # app password if you're using Gmail account

# also create .env.production for your PostgreSQL production container, but remember the Postgres image expects POSTGRES_ prefix
POSTGRES_DB=<YOUR_DOCKER_DB>
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<YOUR_PASSWORD>

#in big picture
Postgres container initializes database using POSTGRES_*
                ↓
Database is created
                ↓
Django connects using DB_* variables
```

Your project is now Dockerized 

See the docker container health:
```sh
docker compose ps
```

You can try creating superuser inside Docker container.
```sh
docker compose exec backend python manage.py createsuperuser
```


create a VM  from any cloud provider 

 Connect via SSH
```
chmod 400 private key
ssh -i private key opc@<PUBLIC_IP>
Update system first:
sudo apt update && sudo apt upgrade -y


3. Install Docker & Docker Compose
Bash# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Log out & log back in
exit
Reconnect after logout:
ssh -i private key opc@<PUBLIC_IP>

4. Clone the Project
sudo mkdir devroot
sudo chown $USER:$USER  devroot
cd devroot
git clone git@github.com:ByteUjamaa/team-learning-system.git .

check if you see all the file
```

5. Configure Environment Variables
```
Frontend (in docker-compose.yml)
YAMLservices:
  frontend:
    environment:
      - VITE_SERVER_BASE_URL=http://<PUBLIC_IP>:8000/api/v1
Backend environment files
Create/edit these files:
Bashnano backend/.env.production
nano backend/.env.docker
Example content for .env.docker / .env.production:
textDEBUG=False
ALLOWED_HOSTS=<PUBLIC_IP>,localhost,127.0.0.1
SECRET_KEY=your-super-long-random-secret-key-here
# ... database credentials, stripe keys, etc.
```
6. deal now with the firewalls
```

Go to your instance → Primary VNIC → click Subnet
Open Default Security List (or assigned one)
Add Ingress Rules:
TCP | Port 22 | 0.0.0.0/0 (usually already exists)
TCP | Port 8000 | 0.0.0.0/0
TCP | Port 5173 | 0.0.0.0/0


B. Instance Firewall (iptables)
for the oracle server if you use linux image
make sure you update and open also the linux firewalls   ufw for port 22 80 443

# Make rules persistent
sudo apt update
sudo apt install -y iptables-persistent

# During installation → choose YES to save current IPv4 rules
# Or later:
sudo netfilter-persistent save
Verify:
Bashsudo iptables -L -v -n
```
test  and make some changes 
```
7. Build & Start Containers
Bashdocker compose up --build -d
docker compose ps
8. Test Your Deployment

Backend API → http://<PUBLIC_IP>:8000/
Frontend → http://<PUBLIC_IP>:5173/
Django Admin (if enabled) → http://<PUBLIC_IP>:8000/admin/

9. Important Django & CORS Settings
In your Django settings.py:
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")



 CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://130.61.230.245:5173"
]

Push to GitHub:
```sh
git add .
git commit -m "Allowed host & environments added"
git push origin master
```

This will push the changes to GitHub.

###  Goal - Whenever I push code to GitHub, my oracle server should automatically update.

But first...

### Manually pull the code from GitHub to oracle server .
While logged-in to oracle server :
```sh
git pull origin main
```

Rebuild containers:
```sh
docker compose down -v
docker compose up --build -d
```

## Rule Before Automation
❗Never automate something you haven’t done manually.

## Setup CI/CD (GitHub Actions)
In local project:

Create a new file:  

```sh
.github/workflows/automate.yml
```
```sh
name: Auto Deploy to Oracle Cloud Server

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.ORACLE_HOST }}
          username: ${{ secrets.ORACLE_USER }}
          key: ${{ secrets.ORACLE_SSH_KEY }}
          script: |
            cd devroot
            git pull origin master
            docker compose up --build -d

```

Add GitHub Secrets:
GitHub → Your Repository → Settings → Secrets and variables → Actions → New repository secret .

```
Required GitHub Secrets

The following secrets must be configured in the GitHub repository to allow secure deployment:

Secret Name	Description
ORACLE_HOST	Public IP address of the Oracle Cloud VM
ORACLE_USER	SSH username (usually ubuntu)
ORACLE_SSH_KEY	Private SSH key for connecting to the Oracle server

Important Notes

     The SSH key must be the full private key content, not the filename

     Root login is disabled on Oracle Cloud — always use the ubuntu user
```

## Push automation file:
```sh
git add .
git commit -m "CI/CD Setup"
git push origin main
```

Check GitHub Actions tab.
```sh
Deployment Process

On every push to the master branch, GitHub Actions will automatically:

Connect to the Oracle Cloud server via SSH

Navigate to the application directory

Pull the latest code from the GitHub repository

Build and restart the Docker containers using Docker Compose
```

Make a small frontend change and confirm auto-deploy.

✅ Auto deploy successful.



## Nginx Config
From local project, create file:
```sh
nginx/default.conf
```
```
server {
    listen 80;

    # Frontend (React)
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend (Django)
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Django admin & static
    location /admin/ {
        proxy_pass http://backend:8000;
    }

    location /static/ {
        proxy_pass http://backend:8000;
    }

    location /media/ {
        proxy_pass http://backend:8000;
    }
}
```
### Docker Compose Changes
- Add nginx service
- Remove ports from backend & frontend
- Update frontend API URL: ``` VITE_SERVER_BASE_URL="/api/v1" ```

```
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
  depends_on:
    - frontend
    - backend
```

Push changes:
```sh
git add .
git commit -m "Nginx Setup"
git push origin main
```

## Update Firewall (Production)
Keep:
- ```22``` (SSH)
- ```80``` (HTTP)

Remove:
- ```8000``` (Backend)
- ```5173``` (Frontend)

## Final Test
http://<ORACLE_IP>/

If you get error: Add ```backend``` to allowed host in oracle server manually.

Restart docker:
```sh
docker compose down -v
docker compose up --build -d
```
NOTE remember to add CSRF_TRUSTED_ORIGINS  in the setting 

## Gunicorn Setup (Production WSGI Server)

### 1. Add Gunicorn Dependency
Add `gunicorn` inside `requirements.txt`:


#### Update Backend Dockerfile

No special change is required other than ensuring requirements.txt is installed.
Gunicorn will be installed automatically via dependencies.

#### Update docker-compose.yml
Replace the Django run command with Gunicorn:
```
command: >
  gunicorn team_system.wsgi:application --bind 0.0.0.0:8000 --workers 3
```
- team_system.wsgi:application → Django entry point
- --bind 0.0.0.0:8000 → Listen on all interfaces
- --workers 3 → Run 3 Python worker processes

```
git add .
git commit -m "Deploy Gunicorn"
git push origin main
```

#### Important Note
✅ We did not change the application code.

✅ We only changed how Python code is executed in production.

### Verify Gunicorn Is Running
SSH into the oracle server:
```
ssh root@<ORACLE-IP>
cd devroot
cd Backend
docker compose logs backend


output will be  like
backend-1  | Not Found: /static/admin/css/base.css
backend-1  | Not Found: /static/admin/css/nav_sidebar.css
backend-1  | Not Found: /static/admin/css/dark_mode.css
backend-1  | Not Found: /static/admin/css/responsive.css
backend-1  | Not Found: /static/admin/js/theme.js
backend-1  | Not Found: /static/admin/css/dashboard.css
backend-1  | Not Found: /static/admin/js/nav_sidebar.js
backend-1  | Not Found: /static/admin/css/responsive.css
backend-1  | Not Found: /static/admin/css/nav_sidebar.css
backend-1  | Not Found: /static/admin/css/dashboard.css

POINT TO NOTE Gunicorn DOEST NOT COLLECT STATICS FILE AS runserver  ADD SETTING ON THE Nginx SO AS TO
COLLECT THE STATIC FILE 
```

## Purchase a Domain

Purchase a domain from any provider (GoDaddy, Namecheap, etc.).

Connect Domain to oracle server(DNS)
Add the following A records in your domain DNS:
| Type | Host | Value              |
| ---- | ---- | ------------------ |
| A    | @    | `<YOUR_ORACLE_SERVER_IP>` |
| A    | www  | `<YOUR_ORACLE_SERVER_IP>` |

Wait for DNS propagation (usually a few minutes to a few hours).

```
Nginx Domain & SSL Notice

Important: After adding your domain name, do NOT modify default.conf locally.

All Nginx configuration changes, including SSL setup, must be done on the server.

Why

When you push code to GitHub and redeploy, local changes to default.conf will be overwritten.

SSL certificates and settings are server-specific. Any local modifications will be lost.

To apply SSL after updates, you must re-run the SSL setup command on the server.

Recommendation

Add your domain and configure SSL directly on the server.

Keep default.conf in GitHub as-is.

Whenever you make server-side changes to SSL or Nginx, do not push those changes to GitHub.
so add nginx in  the .gitignore

This ensures your SSL stays valid and your domain configuration is not accidentally reset.
```


### Nginx Config as Server-Managed File
Certbot modifies the Nginx config directly on the server,
so we must remove it from Git tracking.
```
git rm --cached nginx/default.conf
```
- Removes the file from Git

Add to .gitignore:
```
nginx/default.conf
```

#### Commit and Push
```
git add .
git commit -m "Make nginx config server-managed"
git push origin main
```

#### SSH into oracle server
- Create `nginx/default.conf` file
- Add domain to this file:
```
server_name example.com www.example.com;
```
Restart nginx:
```
docker compose restart nginx
```
#### Update Django ALLOWED_HOSTS
Add your domain into `.env.docker`

Restart backend:
```
docker compose restart backend
```
### Test Domain (HTTP only
http://example.com

```
Serving Django with Gunicorn and Nginx
Issue

After switching to Gunicorn to serve Django in production, the app works but static files (CSS, JS, images) are not loading.

Gunicorn only serves dynamic content and does not handle static files.

Solution

Use Nginx as a reverse proxy to handle static files and forward dynamic requests to Gunicorn.

Nginx serves static content directly, improving performance and making the app fully accessible via the browser.

Docker Setup
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./Backend/staticfiles:/static
  depends_on:
    - frontend
    - backend

Nginx Config Example (default.conf)
server {
    listen 80;
    server_name  server_name tlms.live www.tlms.live;

    location /static/ {
        alias /static/;   # Serve Django static files
    }

    location / {
        proxy_pass http://backend:8000;  # Forward dynamic requests to Gunicorn
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

## Install SSL (Let’s Encrypt)

In the server root directory, create folders:
```
mkdir -p certbot/www
mkdir -p certbot/conf
```
### Update docker-compose.yml (Nginx service)
Edit docker-compose.yml locally (nginx service):
```
volumes:
  - ./certbot/www:/var/www/certbot
  - ./certbot/conf:/etc/letsencrypt
```
Push to main branch.

### Update nginx/default.conf
Edit `nginx/default.conf`

Add this block:
```
location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
```

Restart Nginx container:
```
docker compose restart nginx
```
Make sure the site with HTTP still works at this point:

### Install Certbot
```
apt update
apt install certbot -y


### Get SSL Certificate (WEBROOT METHOD)
```
sudo certbot certonly \
  --webroot \
  -w /home/ubuntu/devroot/certbot/www \
  -d tlms.live \
  -d www.tlms.live
```

### Enable HTTPS in Nginx
Edit `nginx/default.conf` again:

Replace with FINAL CONFIG:

```
server {
    listen 80;
    server_name tlms.live www.tlms.live;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name tlms.live www.tlms.live;

    # SSL certificate
    ssl_certificate /etc/letsencrypt/live/tlms.live/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tlms.live/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Admin
    location /admin/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files (if served by ngnix)
    location /static/ {
        alias /static/;
    }

    location /media/ {
        proxy_pass http://backend:8000;
    }
}

docker compose restart nginx

then check for the docker ps if ypu will see the ngnix


in case you geting error on the nginx container

make sure your nginx service in the docker compose look like this

nginx:
   image: nginx:alpine
   ports:
     - "80:80"
   volumes:
     - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
     - ./backend-drf/static:/static
     - ./certbot/www:/var/www/certbot
     - /etc/letsencrypt/:/etc/letsencrypt:ro                  
   depends_on:
     - frontend
     - backend


```

push changes to the github




#### Restart Nginx
docker compose restart nginx

remember to expose the port  - "443:443"     on the ngnix service in the docker compose  

#### Test HTTPS 
https://example.com

Congratulations  You did it.


one more move 
solve the  refresh problem in the r frontend
```
Create file nginx.conf next to your Dockerfile in Frontend file :

add

server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: better error pages, caching, etc.
    # error_page 404 /index.html;
}


Then update your Dockerfile:

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL
RUN npm run build

FROM nginx:alpine
# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


