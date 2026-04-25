# RankGrow – AI SEO Engine 🚀

RankGrow is a high-performance, full-stack SaaS platform designed to perform comprehensive Search Engine Optimization (SEO) and Answer Engine Optimization (AEO) audits. It intelligently analyzes domains to identify structural gaps, grade website performance, and dynamically suggest actionable improvements to boost search visibility.

## 🌟 Key Features

* **Real-time Domain Auditing:** Input any URL to instantly scrape, parse, and analyze meta-data and content structure.
* **Secure Authentication System:** Built-in Register and Login flows utilizing salted hashing and JWT-based session tokens.
* **Persistent History:** Your executed analytical reports are tracked securely so that historical scores can be accessed seamlessly across different sessions.
* **Interactive Dashboard:** Beautifully crafted React frontend delivering results in a sleek, glassmorphic visual interface.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
* **Framework:** React + Vite
* **Routing / State:** React Context API
* **Network Protocol:** Axios (configured with global auth interceptors and dynamic base URL detection)

**Backend Architecture:**
* **Serverless Node:** Express 5 Framework (`express.json()` native payload parsing)
* **Authentication:** `jsonwebtoken` (JWT) for secure validation + `bcryptjs` for strict password encryption.
* **Database & ORM:** PostgreSQL bound seamlessly via Prisma 6.

---

## ⚙️ Getting Started (Local Development)

Both the frontend client and the backend server must be running concurrently for the application to function. Follow these exact steps to spin up the application on your local machine:

### 1. Database Configuration
You must have a PostgreSQL database system running locally on the default port `5432`.
Create a database named `RankGrow`.

Navigate into the `server` directory and manually create a `.env` file to map your configuration:
```bash
cd server
touch .env
```
Update the `DATABASE_URL` inside your newly created `.env` file to match your Postgres credentials: `postgresql://<USERNAME>:<PASSWORD>@localhost:5432/RankGrow?schema=public`

Push the structural schemas into your active database:
```bash
npx prisma db push
```

### 2. Booting the Backend
Ensure you are still inside the `/server` directory, install all Node requirements, and launch exactly on Port 5000:
```bash
npm install
node index.js
```
*The server will boot and listen natively on `http://localhost:5000`.*

### 3. Booting the Frontend
Open a **new, separate terminal window**, navigate into your `/client` directory, and launch the Vite development environment:
```bash
cd client
npm install
npm run dev
```
*The React UI will launch and become actively available at `http://localhost:3000`.*

---

## 🔒 Security Posture & Environment Secrets
Never commit `.env` files. Both application clusters (`client/` and `server/`) feature stringent `.gitignore` implementations explicitly shielding configuration secrets from leaking into your GitHub index. When deploying to production environments (such as Vercel, Render, or AWS), make sure to manually setup environment variables in your hosting provider's dashboard.
