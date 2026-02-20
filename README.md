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

