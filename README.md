# P2P | Peer-to-Peer Professional File Transfer Project

**You can use the project without intalling it!: [Official P2P website](https://p2p-tranfer-files.vercel.app).**

## 💡 About the Project
This project allows users to send any type of file directly between devices using peer-to-peer technology with maximum browser speed. 
This project is **open source** and anyone is welcome to **download, study, and contribute to the code.**

## 🛠️ Tech Stack
- HTML5 & CSS3
- TypeScript
- React (with TypeScript)
- Node.js
- Tailwind CSS

## 🚀 Getting Started (How to launch the project locally)

### Prerequisites
- Make sure you have **Node.js** installed on your device. If you don't have it, download it from the [Official Node.js website](https://nodejs.org/).
- Make sure you have **Git** installed. Clone the repository to your PC using:
  ```bash
  git clone https://github.com
  ```

### Installation Steps

1. **Install npm packages for both frontend and backend:**
   * Go to the frontend folder and install dependencies:
     ```bash
     cd frontend/P2P
     npm install
     ```
   * In the other terminal go to the backend folder and install dependencies:
     ```bash
     cd backend
     npm install
     ```

2. **Configure Environment Variables & Server URL:**
   * **Backend Configuration:** Go to the backend folder (`cd backend`). Find the `env.example` file, open it, and paste your frontend React URL in line 2:
     ```env
     PORT=8080
     FRONTENDURL=http://localhost:5173
     ```
     *(Note: 5173 is the default port for Vite/React, change it if yours is different. You do not need to change the backend port, 8080 is recommended).*
   * **Rename the file:** Change the filename from `env.example` to `.env`.
   * **Frontend Configuration:** To establish the WebSocket connection, open `SendSecondStep.tsx` located in:
     `.../P2P/frontend/P2P/src/components/send_page/SendSecondStep.tsx`
     Go to **line 108** and change the WebSocket URL to your local Node.js server URL:
     ```typescript
     const socket = new WebSocket('ws://localhost:8080')
     ```

3. **Launch the Application:**
   Open two separate terminal windows to run both services simultaneously.
   * **In the frontend terminal:**
     ```bash
     npm run dev
     ```
   * **In the backend terminal:**
     ```bash
     node server.js
     ```
     *(Note: If you change the `.env` configuration later, remember to restart the Node server by stopping it and running `node server.js` again. React restarts automatically).*

4. **Its fully recommended to use a cloudflare tunnel for node and react gives you a secure https link and new node and react link**

5. I hope it worked out! Have fun using the program! 🎉

## 📄 License
This project is licensed under the **GNU GPLv3 License** - see the [LICENSE](DOCS/LICENSE/GNUGPLv3License.txt) file for details.
Copyright © 2026 AveniroxTM. The project is available as open-source under license.

---
*Have fun and have a nice day!*  
**Avenirox Team.**
