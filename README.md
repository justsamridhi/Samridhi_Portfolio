# Samridhi Gupta — Personal Portfolio

A pixel-inspired personal portfolio built with the MERN stack to showcase my technical skills, projects, experience, and creative interests. Designed with an interactive interface, thoughtful animations, and a warm, minimal aesthetic.

🌐 **Live Portfolio:** [View Portfolio](https://samridhi-portfolio-taupe.vercel.app)  
💻 **GitHub:** [justsamridhi](https://github.com/justsamridhi)

---

## ✨ Overview

This portfolio brings together my journey as a Computer Science undergraduate, developer, and creative learner. It combines a pixel-art-inspired visual identity with interactive components and a full-stack backend for features such as the guestbook and contact form.

The interface features a cream, sage, and muted orange palette, two visual themes, and subtle motion designed to enhance the experience without overwhelming the content.

## 🚀 Features

- **Pixel-Inspired UI:** A distinctive visual style with a warm, minimal color palette and playful details.
- **Day Desk & Night Desk:** Light and dark themes for different viewing preferences.
- **Interactive Hero:** Typewriter effects, ASCII-inspired glitches, and animated introductory elements.
- **Developer & Creative Profiles:** Interactive identity cards highlighting technical and creative interests.
- **Skills Showcase:** Organized technical skills with interactive elements and subtle animations.
- **Projects Section:** A curated presentation of selected projects and development work.
- **Experience & Education:** A structured overview of academic and professional experience.
- **Certificates:** A dedicated space for certifications and learning achievements.
- **Creative Corner:** A glimpse into interests beyond software development.
- **Guestbook:** Visitor messages supported by backend moderation.
- **Contact Form:** A backend-integrated form that stores messages in MongoDB.
- **Resume Download:** Resume files available in PDF and DOCX formats through the Express backend.
- **Responsive Layout:** Designed to provide a usable experience across desktop and mobile screens.
- **Motion & Accessibility:** Subtle animations with support for reduced-motion preferences.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript/JavaScript as used in the client, Vite |
| Styling | SCSS, CSS animations |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Deployment | Vercel (frontend), Render (backend) |
| Development Tools | Git, GitHub, npm |

## 📁 Project Structure

```text
Samridhi_Portfolio/
├── client/                 # React + Vite frontend
│   ├── public/              # Public assets and static files
│   ├── src/
│   │   ├── components/      # Portfolio sections and UI components
│   │   ├── assets/          # Imported frontend assets
│   │   └── ...              # App entry points, styles, and utilities
│   ├── package.json
│   └── vite.config.ts
│
├── server/                  # Express backend
│   ├── index.js              # Server entry point
│   ├── package.json
│   └── .env.example          # Environment variable template
│
├── assets/                  # Shared assets, if present
├── documents/               # Resume and supporting documents, if present
└── README.md
```

*The exact directory contents may vary as the project evolves.*

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- A MongoDB database, such as [MongoDB Atlas](https://www.mongodb.com/atlas), for database-backed functionality

### 1. Clone the repository

```bash
git clone https://github.com/justsamridhi/Samridhi_Portfolio.git
cd Samridhi_Portfolio
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`, using `.env.example` as a reference.

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_SECRET=your_admin_secret
CLIENT_ORIGIN=http://localhost:3000
```

Replace the example values with your own configuration. Never commit real credentials or secrets to GitHub.

### 3. Configure the frontend

Open a second terminal from the repository root:

```bash
cd client
npm install
```

If the frontend requires a backend URL environment variable, configure it using the variable name expected by the existing client code. For local development, it should point to your local Express server.

### 4. Run the development servers

**Terminal 1 — Backend**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

Open the local URL printed by Vite in your terminal. Check `client/vite.config.ts` for the configured development port; Vite may choose another available port if the default is occupied.

> Ensure the backend's CORS configuration allows your local frontend origin and that MongoDB is accessible.

### 5. Build for production

From the `client/` directory:

```bash
npm run build
```

The production-ready frontend bundle is generated in `client/dist/`.

## 🌍 Deployment

The project uses a separately deployed frontend and backend.

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `client`.
3. Configure any required frontend environment variables.
4. Deploy the project and verify the production URL.

### Backend — Render

1. Create a Web Service linked to the repository.
2. Set the root directory to `server`.
3. Configure the appropriate build and start commands from `server/package.json`.
4. Add the required environment variables in the Render dashboard.
5. Confirm that the server starts successfully and connects to MongoDB.

**Important:** Configure the backend's CORS allowlist to include the deployed frontend origin. Update it if you connect a custom domain.

## 🔐 Security Notes

- Keep `.env` files out of version control.
- Never expose database connection strings, administrative secrets, or private credentials.
- Use environment variables for deployment configuration.
- Validate and sanitize user-submitted contact and guestbook data on the server.
- Restrict administrative functionality to authorized users.

## ♿ Accessibility & Performance

The portfolio aims to provide a comfortable browsing experience through:

- Reduced-motion support.
- Optimized image loading.
- Responsive layouts.
- Subtle transitions and hover feedback.
- Clear navigation and content structure.

## 🔮 Future Improvements

Potential enhancements include:

- Further optimization of image formats and loading performance.
- More consistent scroll-triggered animations across all sections.
- Additional accessibility and cross-device testing.
- Expanded project case studies and technical documentation.

## 👩‍💻 About Me

I'm **Samridhi Gupta**, a Computer Science undergraduate interested in software development, data structures and algorithms, and understanding how software systems work. I enjoy building projects, exploring new technologies, and combining technical problem-solving with creative expression.

- **GitHub:** [@justsamridhi](https://github.com/justsamridhi)
- **Portfolio:** [samridhi-portfolio-taupe.vercel.app](https://samridhi-portfolio-taupe.vercel.app)

---

*Built with curiosity, creativity, and a love for learning.*
