# 📚 Library Web App (Frontend)

A modern Library Web Application built with React, featuring authentication, book browsing, borrowing system, and user management. This project focuses on clean architecture, responsive UI, and efficient state/data handling.

---

## 🚀 Features

### 🔐 Authentication

* User Login & Register
* JWT token stored in localStorage
* Protected routes for authenticated users

### 📖 Book Management

* View list of books
* Search and filter by category
* View detailed book information
* See stock availability and reviews

### 📦 Borrowing System

* Borrow books with real-time UI update (Optimistic UI)
* Automatic stock reduction on borrow
* View borrowing status (BORROWED / RETURNED)

### ⭐ Reviews

* Add reviews to books
* Display user reviews instantly

### 👤 User Dashboard

* View user profile
* Borrowing history
* User statistics

### 🛠️ Admin Features

* Full access to manage system data (if role = ADMIN)

---

## 🧰 Tech Stack

* **React + TypeScript** — Component-based UI with type safety
* **Tailwind CSS** — Utility-first styling
* **shadcn/ui** — Prebuilt UI components
* **Redux Toolkit** — Global state management
* **TanStack Query (React Query)** — Data fetching & caching
* **Axios** — API communication
* **Day.js** — Date formatting
* *(Optional)* **Framer Motion** — Animations

---

## 🧠 State Management

### Redux Toolkit

* `authSlice` → manage token & user data
* `uiSlice` → filter, search, UI states
* *(optional)* `cartSlice` → handle multiple book borrowing

### React Query

* `useQuery` → fetch books, details, and loans
* `useMutation` → login, borrow, review
* Fast and responsive UI updates for better user experience

---

## 🔄 Main User Flow

1. Login / Register
2. Browse books → search & filter
3. View book details
4. Borrow book (stock updates instantly)
5. Add review
6. Check borrowing history
7. View profile & statistics

---

## 🎨 UI / UX Principles

* Responsive design using Tailwind CSS
* Consistent components via shadcn/ui
* Loading & error states on all requests
* Toast/snackbar for user feedback
* Clean and minimal interface

---

## 👥 Role Access

### User

* Browse books
* Borrow books
* Return books
* Add reviews

### Admin

* Manage books
* Manage users
* Manage borrow transactions

---

## 📂 Folder Structure

```
src/
├── api/
├── app/
├── components/
├── features/
├── layout/
├── pages/
├── routes/
└── utils/
```

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/Anna-fertiliana/Project-1--Library-App.git

# Go to project folder
cd library-web

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=your_api_url_here
```

---

## 🌐 API Reference

This project uses a backend API documented via Swagger.

---

## 🔗 Backend API

This frontend consumes REST API from:

https://library-backend-production-b9cf.up.railway.app/api-swagger

---

## 📸 Screenshots

### 🏠 Home Page

![Home Page](./screenshots/Home.png)

Main landing page featuring the “Welcome to Booky” banner, navigation bar, and search functionality.

---

### 📚 Recommendation Section

![Recommendation](./screenshots/Recomendation.png)

Displays a list of recommended books in card format, including ratings and author information.

---

### 📖 Book Detail Page

![Book Detail](./screenshots/Book-Detail.png)

Book detail page includes:

* Book cover
* Description
* Rating & reviews
* **Add to Cart** and **Borrow** buttons

---

### ⭐ Reviews Section

![Reviews](./screenshots/Reviews.png)

Shows user reviews with ratings and comments displayed in real-time.

---

### 👤 Author Page

![Author Page](./screenshots/Author-Detail.png)

Displays author information along with the list of books written by the author.

---

### 🛒 Checkout / Borrow Page

![Checkout](./screenshots/Checkout.png)

Borrowing page with features:

* User information
* Borrowed book list
* Borrow duration selection
* Automatic return date calculation

---

### 📦 Borrowed List

![Borrowed List](./screenshots/borrowed.png)

Displays borrowed and returned books with status:

* **BORROWED**
* **RETURNED**

---

## 🚀 Project Status

* ✅ Authentication (Login & Register)
* ✅ Book List with Search & Filter
* ✅ Book Detail & Reviews
* ✅ Borrow System (Optimistic UI)
* ✅ User Loan History
* ✅ Review System
* ✅ Protected API Requests
* ✅ Responsive UI

This project is actively maintained and open for improvements.

---

## ⚠️ Error Handling

* API request fallback
* Empty state UI
* Loading state
* Form validation
* Unauthorized redirect

---

## 🚀 Deployment

You can deploy this app easily using:

* Vercel (recommended)
* Netlify

---

## 📌 Development Tips

* Build feature by feature:

  * Auth → Books → Detail → Loans → Profile
* Commit per feature for better tracking
* Start simple, then improve UI/UX

---

## 👨‍💻 Author

Developed as part of my personal portfolio to showcase my skills in building scalable and modern web applications using React and TypeScript.

---

## 📄 License

This project is part of my personal portfolio and demonstrates my skills in building modern web applications using React and TypeScript. Feel free to explore and use it as a reference.
