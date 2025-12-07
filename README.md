# AgriManage - VVMS (Vegetable Vendor Management System)

> **Enterprise-grade vegetable vendor management platform with automated CI/CD deployment**

[![Deployment](https://img.shields.io/badge/deployment-automated-success)](https://github.com/vaibhavtiwari12/Agrimanage-VVMS)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**AgriManage VVMS** is a comprehensive vegetable vendor management system built on the MERN stack. It provides complete capabilities for managing vegetable vendors, tracking inventory, handling transactions, and generating reports.

### Key Capabilities

- 👥 **Vendor Management** (Kisan & Purchaser)
- 📦 **Inventory Tracking**
- 💰 **Transaction Management**
- 📊 **Reporting & Analytics**
- 🌐 **Multi-language Support** (English, Hindi)
- 🔒 **Secure Authentication**
- 📱 **Responsive Design**

---

## ✨ Features

### Business Features

- Complete vendor lifecycle management
- Real-time inventory tracking
- Automated billing and settlements
- Comprehensive transaction history
- PDF report generation
- Excel export functionality
- Advanced search and filtering
- Multi-language UI (English/Hindi)

### Technical Features

- 🚀 **Automated CI/CD** with GitHub Actions
- 🐳 **Docker containerization**
- 🔒 **Security scanning** (Trivy, Gitleaks)
- 🎨 **Code quality checks** (ESLint, Prettier)
- ⚡ **Pre-commit hooks** (Husky, lint-staged)
- 📈 **Production monitoring**
- 🔄 **Zero-downtime deployments**
- 🏷️ **Version tagging** (latest, timestamp, commit SHA)

---

## 🛠️ Tech Stack

### Frontend

- **React** 17.x - UI framework
- **Redux** - State management
- **React Router** - Navigation
- **Ant Design** - UI components
- **Chart.js** - Data visualization
- **React Intl** - Internationalization

### Backend

- **Node.js** 20.x - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### DevOps & Infrastructure

- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Render** - Hosting (Free tier)
- **Docker Hub** - Container registry
- **MongoDB Atlas** - Database hosting

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **MongoDB** (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vaibhavtiwari12/Agrimanage-VVMS.git
   cd Agrimanage-VVMS
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Configure environment variables**

   Create `.env` files in `backend/` and `frontend/`:

   **backend/.env:**

   ```env
   MONGO_URL=mongodb://localhost:27017/mvmsyshk
   PORT=3001
   NODE_ENV=development
   SESSION_SECRET=your-secret-key-here
   ```

   **frontend/.env:**

   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

4. **Start development servers**

   ```bash
   # From root directory
   npm run dev
   ```

   This starts both frontend (port 4009) and backend (port 3001) concurrently.

---

## 🌐 Deployment

### Automated Deployment (Recommended)

We use **GitHub Actions** for fully automated CI/CD.

**Deploy with a single command:**

```bash
git push origin master
```

#### What Happens Automatically:

1. ✅ Code quality validation (ESLint)
2. ✅ Security scanning (Trivy, Gitleaks)
3. ✅ Docker image build (linux/amd64)
4. ✅ Push to Docker Hub with 3 tags:
   - `latest`
   - `YYYYMMDD-HHMMSS`
   - `commit-SHA`
5. ✅ Trigger Render deployment
6. ✅ Application goes live in ~10 minutes

### Initial Setup (One-time, 15 minutes)

#### Step 1: Configure GitHub Secrets

Add these secrets to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name          | Value                               | How to Get                                               |
| -------------------- | ----------------------------------- | -------------------------------------------------------- |
| `DOCKER_USERNAME`    | `your-dockerhub-username`           | Your Docker Hub username                                 |
| `DOCKER_TOKEN`       | `dckr_pat_xxxxx...`                 | [Create token](https://hub.docker.com/settings/security) |
| `RENDER_DEPLOY_HOOK` | `https://api.render.com/deploy/...` | Render Dashboard → Service → Settings                    |

#### Step 2: Configure Render Service

1. **Create Web Service** on [Render](https://render.com)
2. **Deploy from registry**: `your-dockerhub-username/vvmsprod:latest`
3. **Set environment variables**:
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/mvmsyshk
   PORT=3001
   NODE_ENV=production
   SESSION_SECRET=<generate with: openssl rand -base64 32>
   ```
4. **Enable Auto-Deploy** from registry
5. **Copy Deploy Hook URL** for GitHub Secrets

#### Step 3: First Deployment

```bash
# Make any change (or empty commit)
git commit --allow-empty -m "trigger: initial deployment"
git push origin master

# Monitor at:
# - GitHub Actions: https://github.com/YOUR_USERNAME/Agrimanage-VVMS/actions
# - Docker Hub: https://hub.docker.com/r/YOUR_USERNAME/vvmsprod/tags
# - Render: https://dashboard.render.com
```

### Deployment Architecture

```
┌─────────────────┐
│   Developer     │
│  (Local Code)   │
└────────┬────────┘
         │ git push origin master
         ▼
┌─────────────────────────────────────────┐
│         GitHub Actions (CI/CD)          │
│  ┌───────────────────────────────────┐  │
│  │ 1. Validate code quality          │  │
│  │ 2. Run security scans             │  │
│  │ 3. Build Docker image             │  │
│  │ 4. Push to Docker Hub             │  │
│  │ 5. Trigger Render deployment      │  │
│  └───────────────────────────────────┘  │
└─────────┬───────────────┬───────────────┘
          │               │
          ▼               ▼
   ┌────────────┐  ┌─────────────────┐
   │ Docker Hub │  │     Render      │
   │  Registry  │  │   (Production)  │
   └────────────┘  └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ MongoDB Atlas   │
                   │   (Database)    │
                   └─────────────────┘
```

### Monitoring & Rollback

**Monitor Deployment:**

- GitHub Actions: View build logs and deployment status
- Render Dashboard: View application logs and metrics
- Docker Hub: Verify image tags

**Rollback (if needed):**

```bash
# 1. Find working image tag on Docker Hub
# 2. Update Render service to use that tag
# 3. Or revert Git commit:
git revert <bad-commit-hash>
git push origin master  # Auto-deploys
```

---

## 💻 Development

### Project Structure

```
Agrimanage-VVMS/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
│       ├── deploy.yml       # Main deployment workflow
│       ├── pr-check.yml     # PR validation
│       └── security-scan.yml # Security scanning
├── frontend/                # React application
│   ├── src/
│   │   ├── Components/      # React components
│   │   ├── Store/           # Redux store
│   │   ├── i18n/            # Internationalization
│   │   └── config/          # Configuration
│   └── package.json
├── backend/                 # Node.js/Express API
│   ├── Mongo/               # Database controllers
│   ├── Router/              # API routes
│   ├── Schema/              # Mongoose schemas
│   └── package.json
├── Dockerfile               # Production container
├── .dockerignore
├── .gitignore
├── .prettierrc              # Code formatting
├── .husky/                  # Git hooks
└── package.json             # Root package
```

### Available Scripts

**Root level:**

```bash
npm run dev              # Start frontend + backend in dev mode
npm run prod-build       # Build for production
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
```

**Frontend:**

```bash
npm start                # Development server (port 4009)
npm run build            # Production build
npm test                 # Run tests
npm run lint             # Lint frontend code
```

**Backend:**

```bash
npm start                # Start backend server (port 3001)
```

### Code Quality

#### Pre-commit Hooks (Husky)

Automatically runs before each commit:

- ✅ ESLint auto-fix on staged files
- ✅ Prettier formatting
- ⚠️ Warnings allowed, errors block

#### Manual Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format all code
npx prettier --write "**/*.{js,jsx,json,md}"
```

### Environment Variables

**Backend (.env):**

```env
MONGO_URL=mongodb://localhost:27017/mvmsyshk
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-secret-key
```

**Frontend (.env):**

```env
REACT_APP_API_URL=http://localhost:3001
```

**Production (Render):**

```env
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/mvmsyshk
PORT=3001
NODE_ENV=production
SESSION_SECRET=<strong-random-value>
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Contribution Workflow

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

   Pre-commit hooks will auto-fix formatting.

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Automated checks will run (lint, build, security)
   - Address any review comments
   - Once approved, it will be merged and auto-deployed!

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

---

## 🔒 Security

- ✅ All secrets stored in environment variables
- ✅ Automated security scanning (Trivy, Gitleaks)
- ✅ Dependency vulnerability checks
- ✅ No hardcoded credentials
- ✅ HTTPS in production
- ✅ Session-based authentication

**Report security issues**: Create a private security advisory on GitHub

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team

Developed and maintained by **Avalon Team**

---

## 📞 Support

### Documentation

- 📖 Full deployment guide (local files - not in Git)
- 🔧 Troubleshooting guides
- 🎯 API documentation

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Actions**: Check workflow logs
- **Render Logs**: View application runtime logs

---

## 🎯 Quick Links

| Resource             | URL                                                        |
| -------------------- | ---------------------------------------------------------- |
| **Repository**       | https://github.com/vaibhavtiwari12/Agrimanage-VVMS         |
| **GitHub Actions**   | https://github.com/vaibhavtiwari12/Agrimanage-VVMS/actions |
| **Docker Hub**       | https://hub.docker.com/r/YOUR_USERNAME/vvmsprod            |
| **Render Dashboard** | https://dashboard.render.com                               |

---

## 🚀 Quick Start Summary

```bash
# 1. Clone & Install
git clone https://github.com/vaibhavtiwari12/Agrimanage-VVMS.git
cd Agrimanage-VVMS
npm install && cd frontend && npm install && cd ../backend && npm install

# 2. Configure environment
# Create .env files in backend/ and frontend/

# 3. Start development
npm run dev

# 4. Deploy to production
git push origin master  # That's it!
```

---

**Built with ❤️ using the MERN Stack**

**Last Updated**: December 7, 2025  
**Status**: ✅ Production Ready  
**Deployment**: Automated via GitHub Actions
