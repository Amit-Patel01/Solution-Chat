# SolutionChat Implementation Plan

## Overview
We are building a full-stack real-time chat web application called "SolutionChat" using the MERN stack + Socket.io + Tailwind CSS. The app will feature global/private rooms, user authentication (JWT), typing indicators, an online user list, document attachments, a user profile page, and a modern "WhatsApp-like" dark-mode interface.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + socket.io-client + react-router-dom + axios + lucide-react
- **Backend**: Node.js + Express + Socket.io + Mongoose + multer (for attachments/avatars)
- **Database**: MongoDB (Atlas)
- **UI Design Aid**: Stitch MCP for rapid UI prototyping and React code generation structure

## Proposed Changes

### Backend (`/backend`)
We will create a structured Express backend:
- `backend/server.js`: Express app setup, Socket.io initialization, static file serving (for uploads), MongoDB connection.
- `backend/models/User.js`: Mongoose schema storing username, email, password, online status, avatar image URL, bio.
- `backend/models/Message.js`: Mongoose schema storing sender ID, receiver ID (or global), message text, timestamp, and optional file attachment URL.
- `backend/controllers/authController.js`: Registration and login handlers issuing JWTs.
- `backend/controllers/userController.js`: Profile fetching and updating handlers.
- `backend/routes/authRoutes.js`: Exposing POST `/register` and `/login`.
- `backend/routes/userRoutes.js`: Exposing GET/PUT `/profile`.
- `backend/routes/uploadRoutes.js`: Exposing endpoints via `multer` to handle file/document uploads.
- `backend/.env`: Config containing `PORT`, `MONGO_URI`, and `JWT_SECRET`.

### Frontend (`/frontend`)
We will initialize a Vite project and configure Tailwind CSS:
- `frontend/src/App.jsx`: Main routing logic.
- `frontend/src/context/AuthContext.jsx`: Manages current logged-in user, token, and profile data.
- `frontend/src/context/SocketContext.jsx`: Manages the single socket connection.
- `frontend/src/pages/Login.jsx` & `Register.jsx`: Auth forms.
- `frontend/src/pages/Profile.jsx`: Page to view/edit user details and avatar.
- `frontend/src/pages/ChatDashboard.jsx`: Main layout combining:
  - `Sidebar.jsx`: List of online users and chat history selection.
  - `ChatWindow.jsx`: Message thread showing attachments (images, docs).
  - `MessageInput.jsx`: Text field, attachment button (file input), send button.

## Verification Plan
### Automated & Manual Verification
- We will boot up both the frontend and backend servers locally.
- Test user registration, login, and profile updates.
- Test sending real-time messages with and without file attachments.
- Verify active "typing..." states and online user list updates.
