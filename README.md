
# Team Learning Management System (TLMS)

##  Project Overview

**TLMS** is a private web app for our study group.

Main features:

* Login with admin-provided accounts
* Fill and edit your profile
* Change password
* View other team members
* Read announcements from admin

**Tech Stack:**

* Frontend: React.js
* Backend: Django + Django REST Framework
* Database: SQLite



##  Project Structure

```
team-learning-system/
├── backend/       # Django backend
│   ├── team_system/       
│   ├── accounts/          # Auth and profiles
│   ├── announcements/     
│   └── manage.py
    └── requirements.txt
    
├── frontend/      # React frontend
│   ├── src/
│   │   ├── pages/         # Login, Profile, Members, Announcements
│   │   ├── components/    # Navbar, MemberCard, Modal
│   │   └── services/      # API calls
│   └── package.json
└── README.md
```

    

##  Git Workflow

* **Branches:**

  * `master` → stable version
  * `dev` → active development
* **Rule:** Always push your work to `dev` branch.

**Example workflow:**

```bash
git checkout dev               # switch to dev
git pull origin dev            # update dev
git checkout -b my-feature     # create your feature branch
git add .
git commit -m "Clear commit message"
git push origin my-feature     # push branch
```

* Create a **Pull Request (PR)** to merge into `dev`.
* Project Lead reviews and merges PRs.



##  Commit Message Guidelines

* Keep messages short and clear
* Examples:

  * `Added login API endpoint`
  * `Implemented profile form validation`
  * `Created members list page`



##  Setup Instructions

### Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```


## Team Tips

* don’t push directly to `master`
* Pull latest changes from `dev` before starting
* Test your code before pushing
* Communicate early if you face issues





## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
