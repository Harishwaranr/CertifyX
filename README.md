# CertifyX – Digital Certificate Management System

CertifyX is a digital certificate management and verification platform that enables organizations to generate, manage, and verify digital certificates securely and efficiently.

## 🌐 Live Application

**[🚀 Open CertifyX – Live Website](https://d2fgx9fo39pdv2.cloudfront.net/)**

## ✨ Features

- Generate digital certificates.
- Verify certificates using unique Certificate IDs.
- Generate and download PDF certificates.
- QR-code-based certificate verification.
- Backend API integration.
- AWS DynamoDB integration for secure certificate data management.
- AWS S3 integration for object storage.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- TypeScript

### AWS Cloud Services
- Amazon ECS – Backend deployment
- Amazon DynamoDB – Certificate data storage
- Amazon S3 – Object storage and frontend hosting
- Amazon CloudFront – Frontend content delivery
- Amazon ECR – Docker image storage

## 📁 Project Structure

```text
Digital-Certificate-System/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   └── pages/
    │       ├── GenerateCertificate.tsx
    │       └── VerifyCertificate.tsx
    ├── package.json
    └── index.html
```

## 🚀 Deployment Architecture

- **Frontend:** Hosted on Amazon S3 and delivered through Amazon CloudFront.
- **Backend:** Deployed using Amazon ECS.
- **Database:** Certificate records are stored in Amazon DynamoDB.
- **Container Registry:** Backend Docker images are stored in Amazon ECR.

## 💻 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/HarishwaranR/CertifyX.git
cd CertifyX
```

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Run the Backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

Configure the required environment variables before starting the backend.

## 🔐 Security

- Keep AWS credentials and environment variables private.
- Never commit `.env` files or secret keys to GitHub.
- Use appropriate AWS IAM permissions for cloud resources.

## 👨‍💻 Author

**Harishwaran R**

## 📄 License

This project is available for educational and development purposes.
