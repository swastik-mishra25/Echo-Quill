# 🪶 Echo Quill – Full-Stack AI Story Generator

**Echo Quill** is an intelligent story generation platform powered by **LangChain** and **Google GenAI**, enabling users to craft creative, engaging, and personalized stories with just a few clicks.  
With a fast **FastAPI backend** and a responsive **React + Vite frontend**, Echo Quill delivers a seamless storytelling experience with modern design and modular architecture.

---

## ⚡ POWER FEATURES

- 🧠 **AI-Powered Story Generation** using LangChain + Google GenAI  
- 📄 **Dynamic Prompts** with tone, theme & genre customization  
- 🚀 **Fast & Scalable Backend** built with FastAPI and Uvicorn  
- 🎨 **Modern Frontend** using React + Vite + Tailwind CSS  
- 🧩 **Component-Based Architecture** for clean and reusable UI  
- 🛠️ **Environment Variable Management** with `python-dotenv`  
- 🔁 **Hot Module Replacement (HMR)** for rapid frontend iteration  
- 🧱 **Typed Data Models** powered by Pydantic  
- 🐳 **Production-Ready Deployment** via Gunicorn and FastAPI  

---

## 🧠 Tech Stack

### 🖥️ Frontend
- **React.js (Vite)**
- **Tailwind CSS**
- **React Router v7**
- **ESLint + SWC**
- **JavaScript (ES6+)**

### ⚙️ Backend
- **FastAPI**
- **Uvicorn**
- **Gunicorn**
- **LangChain**
- **LangChain-Core**
- **LangChain-Google-GenAI**
- **Python-Dotenv**
- **Pydantic**

---

## 📂 Folder Structure

```
Echo-Quill/
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── assets/         # Images, icons, etc.
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── backend/                # FastAPI backend
│   ├── main.py             # FastAPI entry point
│   ├── routes/             # API route definitions
│   ├── services/           # LangChain integration logic
│   ├── models/             # Pydantic data models
│   └── .env.example        # Example environment variables
│
└── README.md               # Project documentation
```

---

## ⚙️ Installation & Setup

### 🔧 Clone the Repository
```bash
git clone https://github.com/swastik-mishra25/Echo-Quill.git
cd Echo-Quill
```

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app will start on **http://localhost:5173**

#### 🧩 About the Frontend

This frontend is built using **React + Vite** with **HMR** (Hot Module Replacement) for fast refresh and **ESLint** rules for code quality.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) – uses [Babel](https://babeljs.io/) for Fast Refresh  
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) – uses [SWC](https://swc.rs/) for optimized compilation  

For production-grade apps, we recommend using **TypeScript** with **typescript-eslint** for type-aware linting.  
Refer to the [React Compiler documentation](https://react.dev/learn/react-compiler/installation) if you wish to enable the React Compiler.

---

### ⚙️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

> Ensure you have **Python 3.9+** installed.

#### ▶️ Run the FastAPI Server

```bash
uvicorn main:app --reload
```

The backend API will start on **http://127.0.0.1:8000**

---

### 🌐 Connecting Frontend & Backend

Update your frontend `.env` or configuration file with:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This ensures seamless communication between the frontend and backend.

---

## 🧩 Environment Variables

Create a `.env` file inside the backend directory and add your Google API key:

```bash
GOOGLE_API_KEY=your_google_genai_key
```

---

## 📦 Backend Dependencies (requirements.txt)

```
fastapi
uvicorn
python-dotenv
langchain
langchain-core
langchain-google-genai
pydantic
gunicorn
```

---

## 🚀 Deployment

### 🖥️ Backend Deployment

Deploy the FastAPI app using **Gunicorn + Uvicorn** or on cloud platforms like:
- **Render**
- **Railway**
- **AWS EC2**

Example command for production:
```bash
gunicorn -k uvicorn.workers.UvicornWorker main:app
```

### 🌐 Frontend Deployment

Build the production version:
```bash
npm run build
```

Then deploy easily via:
- **Vercel**
- **Netlify**
- **GitHub Pages**

---

## 💡 Future Enhancements

- ✍️ Story continuation and editing feature  
- 📚 Story history & saving feature  
- 🌈 Writing modes (Poetry, Sci-Fi, Mystery, etc.)  
- 🗣️ Voice-based story generation input  
- 💾 User authentication and dashboard  

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository  
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request 🚀

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support

If you liked this project, please **⭐ star the repository** and share it with others!  
Made with 💜 by [Swastik Mishra](https://github.com/swastik-mishra25)
