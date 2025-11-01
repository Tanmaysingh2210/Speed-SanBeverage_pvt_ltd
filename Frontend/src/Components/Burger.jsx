import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from "react-hot-toast";

const Burger = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/signin");
        } catch (err) {
            toast.error("Logout failed");
            console.error(err);
        }
    };
    
    return (
        <div className="burger-box">
            <div className="heading">
                <i className="fas fa-wine-bottle text-blue-600 text-2xl"></i>
                <h3 >SAN Beverages</h3>
            </div>
            <div className="line"></div>

            <ul className="burger-ul">
                <li><Link to={`/transaction`}>Transaction</Link></li>
                <li><Link to={`/prices`}>Prices</Link> </li>
                <li><Link to={`/salesman`}>Salesman</Link></li>
                <li><Link to={`/sku`}>SKQ</Link></li>

            </ul>

            {user && (
                <div className="user-section">
                    <div className="user-info">
                        <div className="user-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            )}

        </div>
    )
}

export default Burger
