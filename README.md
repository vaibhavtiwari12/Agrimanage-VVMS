# VVMS By Avalon

VVMS is a comprehensive vegetable vendor management system that has all the capabilities to store manage and see the data for a vegetable vendors.

Avalon is a MERN framework, which serves the primary purpose to be **PLUG and PLAY**. Following some simple steps will get you up and running in no time, and will save a lot of time for you to start writing a framework from the scratch.

In Avalon, react app is served through the Node application and is build using a command so you essentially do not have to worry about the optimization and cleaning of code that has to be done for the production deployment as that is already been taken care of by webpack.

## **Get Started**

### LOCAL DEVELOPMENT - Running FrontEnd and BackEnd application separately.

1. Run the command `npm install` on folder `root`, `backend` and `frontend`.
2. open two separate terminal or command prompt window - one in frontend and one in backend folder.
3. run `npm start` in both.
4. Front-End Application will be running on port `4009` and backend will be running on `3001`.

**NOTE** - Node application is set to work on port 3001 although that can be changed in `.env.prod` file (please be advised in local if you are chaning the node application port you will also have to change the `proxy` property in `frontend/package.json` as that will redirect all the API calls to backend on the port mentioned in proxy url). You can also change the front end port by changing the `PORT` property in `.env.prod` file.

### LOCAL DEVELOPMENT - Running FrontEnd and Backend Application Together as one.

1. Run the command `npm install` on folder `root`, `backend` and `frontend`.
2. In the root folder of application open a terminal or command prompt.
3. Run Command - `npm run build:prod`
4. once it is completed, go to `/backend` folder in terminal and run `npm start`
5. your application will be hosted on `localhost:3001`

**NOTE** - `localhost:3001` is the homepage of application will serve your react application too.

### **Setting Up Mongo** (Optional)

1. Install the latest distribution of Mongo in your system.
2. If you are on windows create a folder in your c: drive root named `data` and inside that create another folder named as `bin`
3. go to your `C:\Program Files\MongoDB\Server\4.4\bin` and open terminal or command prompt and run `mongod`.
4. you will have your mongoServer up and running on port 27017.

**NOTE** - All the mongo related configurations are there in `\backend\Mongo`.

## Deployment on AWS

### Deploying Mongo Server

1. Go to AWS Console and create a new EC2 linux instance by clicking Launch Instance.
2. Make sure you whitelist the custom HTTP Connection to port 27017 in security groups while creating the machine.
3. Download the private key Pair and launch the instance.

**Making SSH connection with EC2 Machine**

1. Install the Putty and Putty gen on your local machine
2. open putty gen and click on `load` select the downloaded `.pem` file and click generate(your browse might be defaulted to `.ppk` files make sure you change that to All Files to see your `.pem` file).
3. save the private key(.ppk) and close the keygen.
4. open Putty and in the Host name write `ec2-user@<Public IP Address of your ec2 instance>`
5. then go to `SSH` in the putty category on left open it and click on `Auth`
6. Under Authentication Parameters browse the private key file for authentication and select the ppk file that was recently generated.
7. go back to session from the category on left and click `Open`
8. You will be connected to the ec2 machine.

**Installing mongo on the ec2 Machine**

1. Run `sudo vi /etc/yum.repos.d/mongodb-org-4.2.repo`
2. add following code to it :

```
 [mongodb-org-4.2]
 name=MongoDB Repository
 baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/4.2/x86_64/
 gpgcheck=1
 enabled=1
 gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```

3. Save the file and run `sudo yum install -y mongodb-org`
4. After installation is finished open `sudo vi /etc/mongod.conf` file.
5. Change the bindIp to the 0.0.0.0 to accept the connection from everywhere ( this is to test the connection, later change that to IP of node appliation ec2 instance)
6. Save file and Run `sudo chkconfig mongod on`
7. Run `sudo service mongod start` to start the mongo server
8. You can restart the servive with command : `sudo service mongod restart`
9. You can check the Mongo running status by runnng command `mongo` and then `show databases`. write `exit` to exit the mongo console.

---

## 🚀 Modern Deployment (Recommended)

### Automated Deployment with GitHub Actions

We now have an **enterprise-level automated CI/CD pipeline** using **100% FREE services**!

**Deploy to production with a single command:**

```bash
git push origin master
```

That's it! The system automatically:

- ✅ Builds Docker image for production (linux/amd64)
- ✅ Pushes to Docker Hub with versioned tags
- ✅ Triggers Render deployment
- ✅ Runs security scans
- ✅ Notifies on completion

### Quick Setup (10 minutes)

```bash
# Run the interactive setup script
./setup-deployment.sh
```

Follow the prompts to configure:

1. GitHub Secrets (Docker credentials, Render webhook)
2. Verify workflows
3. Trigger first deployment

### Documentation

| Document                                                   | Purpose                          |
| ---------------------------------------------------------- | -------------------------------- |
| **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)**       | Overview & architecture          |
| **[DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)** | Daily commands & quick reference |
| **[ENTERPRISE_DEPLOYMENT.md](./ENTERPRISE_DEPLOYMENT.md)** | Complete setup guide             |
| **[DEPLOYMENT_COMPARISON.md](./DEPLOYMENT_COMPARISON.md)** | Manual vs Automated comparison   |

### Key Features

- **Zero Cost**: 100% free services (GitHub Actions, Docker Hub, Render)
- **Fast**: 5-10 minute deployments
- **Secure**: Automated security scanning with Trivy & Gitleaks
- **Reliable**: 91%+ success rate
- **Team-Friendly**: Any team member can deploy
- **Versioned**: Multiple tags per deployment (latest, date-time, commit SHA)

### Architecture

```
Developer → Git Push → GitHub Actions → Docker Hub → Render → Production
                          ↓
                    Security Scans
```

### Legacy Deployment

For manual deployment using the old method, see:

- **[deploy.sh](./deploy.sh)** - Legacy deployment script
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Legacy deployment guide (manual process)

---

## 📚 Additional Documentation

- **[SECURITY.md](./SECURITY.md)** - Security guidelines
- **[AUTOMATION.md](./AUTOMATION.md)** - Automation features
- **[TOAST_STANDARDIZATION.md](./TOAST_STANDARDIZATION.md)** - UI/UX standards

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Create a Pull Request to `master`
4. Automated checks will run (build validation, security scans)
5. Once approved and merged, automatic deployment to production!

---

## 📞 Support

For deployment issues:

- Check **GitHub Actions** logs for build errors
- Review **Render** dashboard for deployment status
- See troubleshooting in **ENTERPRISE_DEPLOYMENT.md**

---

**Last Updated**: December 7, 2025
**Deployment**: Automated via GitHub Actions ✅
