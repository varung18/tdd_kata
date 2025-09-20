# tdd_kata: README FIRST!! Sweet Shop Management System

A full-stack Sweet Shop management application built with **Spring Boot (backend)**, **MongoDB**, **JWT Authentication**, and **React (frontend)**.  
The system supports user authentication, role-based access (Admin & User), CRUD operations on sweets, purchase/restock actions, and file uploads (photo & video).  

---

## 🚀 Features

### 🔐 Authentication
- User registration & login APIs with **JWT authentication**.
- Role-based authorization (`ROLE_ADMIN`, `ROLE_USER`).
- Frontend login/register integrated with backend auth APIs.

### 🛒 Sweets Management
- **CRUD APIs** for sweets (add, update, delete, get all).
- **Purchase API** → users can purchase sweets (quantity decreases).
- **Restock API** → admins can restock sweets.
- **File Uploads** → sweets can have:
  - 📷 Photo (image upload & retrieval).
  - 🎥 Video (video upload & retrieval in `.mp4` format).

### 🔍 Search & Filter
- Flexible search API using query params:
  - By `name`
  - By `category`
  - By `minPrice`, `maxPrice`
  - **Hybrid search** (e.g. `name + maxPrice`)
- Uses **AND operator** for combined filtering.

### 🎨 Frontend (React)
- Login/Register integrated with backend.
- Dashboard:
  - Displays sweets with photo & video previews.
  - Admin features:
    - Add Sweet (with photo/video upload).
    - Edit Sweet.
    - Delete Sweet.
    - Restock Sweet.
  - User features:
    - Purchase Sweet.
- Uses **Axios** with JWT tokens stored in localStorage.
- Responsive grid-based sweet cards.

---

## 🛠️ Tech Stack

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security 6.x
- MongoDB (Spring Data MongoDB)
- JWT Authentication
- Lombok (boilerplate reduction)

### Frontend
- React 18+
- React Router
- Axios

---

## 📂 Project Structure

### Backend (`/backend`)
backend/
== config/

==== CorsConfig.java

==== CustomUserDetailsService.java

==== JwtAuthenticationFilter.java

==== JwtUtil.java

==== SecurityConfig.java

== controller/

==== AuthController.java

==== SweetController.java

== dto

==== AuthResponse.java

== model

==== Sweet.java

==== User.java

== repository

==== SweetRepository.java

==== UserRepository.java

== service

==== SweetService.java

==== UserService.java

== SweetShopApplication.java (inside of /backend/)

📂 src: This is the main source directory for the application's code.

📂 src/assets: This folder contains static assets like images and icons.

background.png 

icon.jpeg 

react.svg 

📂 src/pages: This folder holds the main application pages, typically consisting of a JSX component and its corresponding CSS stylesheet.

Auth.css

Auth.jsx 🔐

Dashboard.css

Dashboard.jsx 📊

Icons.jsx ✨

📂 src: This folder is for files which are used across the application.

App.css

App.jsx

halwai.jpg

index.css

main.jsx

.gitignore

eslint.config.js

index.html

package-lock.json


# How to setup the project

### Backend
1. Clone repo & open `/backend` in IDE.
2. Configure **MongoDB connection** in `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/sweetshop
   spring.data.mongodb.database=sweetshop
3. mvn spring-boot:run
Runs on: http://localhost:8080

### Frontend

Open /frontend folder.

Install dependencies:
npm install

Run React app:
npm run dev

Frontend runs on: http://localhost:5173

## My AI Usage

### First of all, my apologies for not writing in every required commit for co authors in whereever I used AI tools, and it was required to do so. AI Tools where used in "Test Subject 1 Creating APIs and Moving Backend...", and every commit from "test3a-routing" onwards. I have added commit authors and co-authors from Update 8 Commit Onwards

### Which AI Tools you used in this whole project?
ChatGPT, Claude, and Google Gemini

**Major Uses of Each AI Mentioned Above** OR **How did you used them?**
ChatGPT: Backend API Logic
Claude: Dashboard Cosmetics, Login/ Register Cosmetics, and Code Optimizations, which were done at the end.
Google Gemini: CSS Stylings, Dashboard Cosmetics, Frontend Logic

**Your Reflection**
To be honest, making this fantastic project, made by myself, couldn't be done in 3 days if I hadn't used the AI tools. If I had to craft it alone, it could took around 3-4 weeks, with proper brainstorming.

## Screenshots


Following link is a complete different branch, there you should get dive in videos, screenshots, video tutorial of setting up this project, and Postman API Collection, where all available and definition of created APIs shall be explained. 
https://github.com/varung18/tdd_kata/tree/guide
I appreciate your understanding and thank you for any inconvenice caused


Made with love and passion. Varun Gaur.
