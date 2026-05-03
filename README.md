# 📸 SnapFX

**Instant Fun, Privacy-First, Browser-Based Selfie Experience**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=opengl&logoColor=white)](https://www.khronos.org/webgl/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🚀 Project Pitch

**SnapFX** is a premium, high-performance web application that transforms your browser into a professional-grade selfie studio. Powered by custom WebGL shaders, it offers over **80+ cinematic filters** in real-time with zero lag. Designed with a **Privacy-First** philosophy, SnapFX requires no accounts, no installations, and never uploads your photos to a server. Everything happens locally on your device, ensuring your moments remain yours and yours alone.
[![Live Demo](https://img.shields.io/badge/demo-online-green)](https://snapfx-studio.vercel.app/)


---

## ✨ Key Features

*   🎭 **80+ Real-time WebGL Filters** – From Retro VHS and Film Noir to futuristic Neon and Glitch effects.
*   🔲 **Quad Mode** – A unique "Photobooth" experience with sequential 2x2 capture and global filter modifiers.
*   ⚙️ **Advanced Studio Settings** – Customizable countdown timers, mirror toggles, square cropping, and screen flash.
*   📥 **Instant Sharing** – Seamlessly download your high-quality JPGs or use the Web Share API for instant social posting.
*   💎 **Modern Ambient UI** – A stunning, responsive interface built with Glassmorphism and smooth micro-animations.

---

## 🛠 Tech Stack

| Technology | Role |
| :--- | :--- |
| **React 18** | UI Architecture & State Management |
| **Vite** | Blazing fast build tool & dev server |
| **TypeScript** | Type-safe development for complex logic |
| **Tailwind CSS** | Premium styling & responsive design |
| **GLSL / WebGL** | Custom hardware-accelerated filter engine |

### Why WebGL?
We chose **WebGL** (OpenGL Shading Language) to handle image processing because it offloads the heavy lifting to the GPU. This allows SnapFX to apply complex mathematical distortions and color grading at a consistent **60 FPS**, even on mobile devices, without heating up your CPU.

---

## 🏁 Getting Started

Follow these steps to run SnapFX on your local machine:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/snapfx-project.git
    cd snapfx-project
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in browser**
    Navigate to `http://localhost:5173` to start creating!

---

## 🔒 Privacy Statement

**Your privacy is our core architecture.** 

SnapFX is a serverless, client-side application. 
- **No Backend:** We do not have a database or a file server.
- **Local Storage:** Your photos are temporarily stored in your browser's RAM/Local Context for the gallery.
- **Zero Tracking:** No analytics, no cookies, no tracking scripts.
- **Source Code:** Since we are Open Source, you can audit the code yourself to verify that no data ever leaves your browser.

---

<p align="center">
  Made with ✨ by the pesulapmerahh
</p>
