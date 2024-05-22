import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon

function Navbar({ user, onLogout }) {
    const [openLinks, setOpenLinks] = useState(false);
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/'); // Redirect to home after logout
    };

    const handleFavorites = () => {
        if (user) {
            navigate('/favorites', { state: { user } });
        } else {
            navigate('/login');
        }
    };
    const handleShoppingCart = () => {
        if (user) {
            navigate('/cart', { state: { user } });
        } else {
            navigate('/login');
        }
    };

    // Use useEffect to handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setOpenLinks(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="navbar">
            <div className="leftSide">
                <Link to="/">
                    <img src={Logo} alt="Logo" />
                </Link>
            </div>
            <div className={`rightSide ${openLinks ? "open" : "close"}`}>
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/profile"><AccountCircleIcon /></Link>
                        <button onClick={handleShoppingCart}><ShoppingCartIcon /></button>
                        <button onClick={handleFavorites}><FavoriteIcon /></button>
                        <button onClick={handleLogout} className="logout-button"><ExitToAppIcon /></button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                <button className="toggle" onClick={toggleNavbar}>
                    <ReorderIcon />
                </button>
            </div>
            {openLinks && (
                <div className="dropdownMenu">
                    <Link to="/">Home</Link>
                    {user ? (
                        <>
                            <Link to="/profile"><AccountCircleIcon /></Link>
                            <button onClick={handleShoppingCart}><ShoppingCartIcon /></button>
                            <button onClick={handleFavorites}><FavoriteIcon /></button>
                            <button onClick={handleLogout} className="logout-button"><ExitToAppIcon /></button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Navbar;
