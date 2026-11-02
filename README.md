# CertifyX – Digital Certificate Management System

CertifyX is a digital certificate management and verification platform that helps users generate, manage, and verify digital certificates.

## 🌐 Live Application

**[Open CertifyX](https://d2fgx9fo39pdv2.cloudfront.net/)**

## ✨ Features

- Generate digital certificates.
- Verify certificates using unique certificate IDs.
- Generate downloadable PDF certificates.
- QR-code-based certificate verification.
- Backend API integration.
- AWS DynamoDB integration for certificate data.
- AWS S3 integration for object storage.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- TypeScript

**AWS Services**
- Amazon ECS
- Amazon DynamoDB
- Amazon S3
- Amazon CloudFront
- Amazon ECR

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

## 🚀 Deployment

- Frontend hosted using Amazon S3 and distributed through Amazon CloudFront.
- Backend deployed using Amazon ECS.
- Certificate data managed using Amazon DynamoDB.

## 💻 Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Configure the required environment variables before starting the backend.

## 🔐 Security

- Keep AWS credentials and environment variables private.
- Never commit `.env` files or secret keys to GitHub.

## 👨‍💻 Author

**Harishwaran R**

## 📄 License

This project is available for educational and development purposes.
