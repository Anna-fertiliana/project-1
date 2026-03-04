import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

import { useAppDispatch } from "./app/hooks";
import { setAuth } from "./features/authSlice";

import BookDetail from "./pages/BookDetail";
import Category from "./pages/Category";
import AuthorDetail from "./pages/AuthorDetail";
import Cart from "./pages/Cart";
import Borrow from "./pages/Borrow";
import BorrowSuccess from "./pages/BorrowSuccess";
import Profile from "./pages/Profile";
import Borrowed from "./pages/BorrowedList";
import Reviews from "./pages/Review";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminUserList from "./pages/admin/AdminUserList";
import AdminBorrowedList from "./pages/admin/AdminBorrowedList";
import AdminBookList from "./pages/admin/AdminBookList";
import AdminEditBook from "./pages/admin/AdminEditBook";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);

        dispatch(
          setAuth({
            token,
            user: parsedUser,
          })
        );
      } catch (error) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= MAIN LAYOUT ================= */}
        <Route element={<MainLayout />}>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/category" element={<Category />} />
          <Route path="/authors/:id" element={<AuthorDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/borrow-success" element={<BorrowSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/borrowed" element={<Borrowed />} />
          <Route path="/reviews" element={<Reviews />} />

        </Route>

        {/* ================= ADMIN AREA ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<AdminUserList />} />
          <Route path="borrowed" element={<AdminBorrowedList />} />
          <Route path="books" element={<AdminBookList />} />
          <Route path="books/edit/:id" element={<AdminEditBook />} />
        </Route>

        {/* ================= USER PROTECTED ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="USER">
              <div>User Dashboard</div>
            </ProtectedRoute>
          }
        />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;