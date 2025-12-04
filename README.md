# EverCRM

> Enterprise-ready property management CRM for managing properties, tenants, leases, payments, and maintenance workflows. Includes secure tenant access and is built for future automation, analytics, and integrated screening systems.

---

## 🌟 Overview

EverCRM is a modern property management system designed to streamline operations for landlords, real estate operators, and property management teams. The platform centralizes the entire lifecycle of rental assets—from property onboarding to lease administration, rent collection, and maintenance requests.

This product is owned by **Ever Hernandez** and created/designed by **Cesar A. Aguilar** as an enterprise SaaS-grade application with future scalability in mind.

---

## 🏗 Core Features (MVP)

### For Property Managers
✔ User authentication & secure access  
✔ Create and manage properties  
✔ Add units per property (beds, baths, square footage, rent price, status)  
✔ Track active tenants  
✔ Create and track leases  
✔ Record rent payments  
✔ Manage and categorize maintenance requests  

### For Tenants (Portal)
✔ Secure login  
✔ Submit maintenance requests  
✔ View request status  
✔ View lease information  
✔ Access payment history  

---

## 📌 Future Roadmap

These enhancements are part of the planned system evolution:

🔹 Automated rent reminders  
🔹 Online payment gateway integration  
🔹 Tenant screening workflows  
🔹 Dynamic reporting and KPIs  
🔹 Custom document generation  
🔹 Role-based permissions  
🔹 Multi-property portfolio analytics  
🔹 Data export (CSV, XLSX, PDF)  

---

## 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend UI | React 18 + TypeScript + Tailwind CSS |
| Routing | React Router |
| Icons | Lucide Icons |
| State/Data | REST API or Bolt Database Integration |
| Data Security | Row Level Security (RLS) |
| Deploy Options | Vercel / Netlify / Render |

---

## 🧱 Architecture Concept
EverCRM
│
├── Public Area
│ ├── Landing Page
│ ├── Login & Registration
│ └── Password Reset
│
├── Property Management Module
├── Tenant Management Module
├── Lease Management Module
├── Payment Tracking Module
├── Maintenance Requests Module
│
└── Tenant Portal

This modular architecture supports future SaaS multi-tenant scaling.

---

## 🚀 Deployment Instructions

### Install
```bash
npm install
Development server
bash
Copy code
npm run dev
Build for production
bash
Copy code
npm run build
npm run preview
