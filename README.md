# AI-Powered Virtual Interview Simulator

A web-based tool to help candidates practice technical and HR interviews with AI-driven feedback and scoring.

## Features
- Supports multiple topics: JavaScript, React, Python, HR, HTML, CSS, Backend, Node.js, Express.js, Redux, MongoDB, MySQL.
- Real-time AI feedback using the Gemini API.
- Progress tracking and performance reports with charts.

## Prerequisites
Before building and running the project, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **Gemini API Key** from Google Cloud - [Get it here](https://cloud.google.com/)

## Build Instructions
Follow these steps to set up and run the project locally:

1. **Clone the Repository**
   ```bash
   git remote add origin https://github.com/IshantRaut/AI-Powered_Interview.git
   cd your-repo

##Install Dependencies
bash

npm install

Set Up Environment Variables


Create a .env file in the root directory.
Add your Gemini API key:


VITE_GEMINI_API_KEY=your-api-key-here

Run the Development Server

npm run dev




Contributing
Feel free to fork this repo, submit issues, or send pull requests. See  for details (if you create one).

Usage
Select a topic from the homepage.
Answer questions posed by the AI.
Receive feedback, scores, and key takeaways.
View your progress in the dashboard.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
