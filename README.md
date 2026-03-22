<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTJwcHpuY3ZrZ254aWViOThycnFpNXZ3cDh0M2wycWZuazd3ZG1waiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fKqBFh5pebTrycP2wo/giphy.gif" width="420" />
</p>


# SolutionChat

A full-stack real-time live chat application using the MERN stack (MongoDB, Express, React, Node.js), Socket.io, and Tailwind CSS. The design is inspired by modern messaging apps with a sleek dark-mode aesthetic (Obsidian Teal).

🎉 **Live Demo**: [https://amitsolutionhub-support-chat.vercel.app/](https://amitsolutionhub-support-chat.vercel.app/)

## Features
- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **User Profiles**: Upload an avatar and update your bio.
- **Real-time Messaging**: Instant chat via Socket.io.
- **Global & Private Rooms**: Chat with everyone or start direct messaging.
- **Media & Document Attachments**: Send images and files natively.
- **Typing Indicators & Online Status**: Real-time awareness of active users.
- **Design Excellence**: Custom glassmorphic UI, responsive layout, and beautiful scrollbars.

---

## 🚀 Running Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017 (or change the `MONGO_URI` in `.env`).

### 1. Setup Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create your environment file by copying the example:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and put your MongoDB Atlas connection string and any JWT Secret.*
3. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000`):
   ```bash
   node server.js
   ```

### 2. Setup Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Create your environment file by copying the example (For local development, you can leave VITE_BACKEND_URL blank to use the proxy):
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment Guide

### MongoDB Atlas Setup (Database)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and create a Database User with a secure password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
4. Get your connection URI: `mongodb+srv://<user>:<password>@cluster0...`

### GitHub Security Note
> [!IMPORTANT]
> The backend repository has a `.gitignore` specifically ensuring that `.env` is NOT pushed to GitHub. This keeps your MongoDB Atlas password and JWT Secrets perfectly isolated and safe.

### Backend Deployment (Render)
1. Push your `backend` directory to your GitHub account as a new repository.
2. Go to [Render](https://render.com/) and click "New Web Service".
3. Connect your GitHub repository.
4. Set the Start Command to: `node server.js`
5. In the **Environment Variables** section, add your secret keys so Render can securely access them:
   - `PORT`: `5000`
   - `MONGO_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *A secure random JWT signature token*
6. Deploy. Take note of your assigned Render URL (e.g., `https://solutionchat-api.onrender.com`).
   *Note: Because Render uses an ephemeral disk on its Free Tier, avatars uploaded to `/uploads` folder might reset across server sleeping periods. For permanent uploads in production, binding a Cloudinary integration is recommended.*

### Frontend Deployment (Vercel)
1. Push your `frontend` directory to your GitHub account as a new repository.
2. Go to [Vercel](https://vercel.com/) and "Add New Project".
3. Import the `frontend` repository. Vercel automatically detects the Vite configuration.
4. Before clicking Deploy, expand the **Environment Variables** tab and add:
   - `VITE_BACKEND_URL`: *Your Render Backend URL (e.g., `https://solutionchat-api.onrender.com`)*
5. Click **Deploy**. Vercel will build the frontend with injected secure parameters pointing safely to your backend. Your users can now navigate to your provided Vercel URL to start chatting!
