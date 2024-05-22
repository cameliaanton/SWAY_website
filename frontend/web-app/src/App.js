import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminPage from './AdminStuff/Admin';
import ChangePasswordPage from './pages/ChangePassword';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductsPage from './pages/Products';
import ProductPage from './pages/ProductPage';
import FavoritesPage from './pages/Favorites';
import ProfilePage from './pages/Profile';
import ShoppingCartPage from './pages/ShoppingCart';
import CheckOutPage from './pages/CheckOut';
import UserOrdersPage from './pages/UserOrders';
import ManageProducts from './AdminStuff/ManageProducts';
import ManageUsers from './AdminStuff/ManageUsers';
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return JSON.parse(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getCookie('user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCookie('user', JSON.stringify(userData), 7); // Set cookie for 7 days
  };

  const handleLogout = () => {
    setUser(null);
    setCookie('user', '', -1); // Clear cookie
  };

  return (
    <div className='App'>
      <Router>
        <header>
          <Navbar user={user} onLogout={handleLogout} />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/login" exact element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" exact element={<RegisterPage />} />
            <Route path="/login/changePassword" exact element={<ChangePasswordPage />} />
            <Route path="/admin" exact element={<AdminPage user={user} />} />
            <Route path="/employee" exact element={<AdminPage user={user} />} />
            <Route path="/products" exact element={<ProductsPage user={user} />} />
            <Route path="/product/:id" exact element={<ProductPage />} />
            <Route path="/profile" exact element={<ProfilePage user={user} />} />
            <Route path="/favorites" exact element={<FavoritesPage user={user} />} />
            <Route path="/cart" exact element={<ShoppingCartPage user={user} />} />
            <Route path="/checkout" exact element={<CheckOutPage user={user} />} />
            <Route path="/orders" exact element={<UserOrdersPage user={user} />} />
            <Route path="/admin/users" exact element={<ManageUsers />} />
            <Route path="/admin/products" exact element={<ManageProducts />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </Router>
    </div>
  );
}

export default App;
