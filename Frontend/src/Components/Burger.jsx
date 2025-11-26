import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {NavLink} from 'react-router-dom';
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
                <li><NavLink to={'/purchase'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Purchase</NavLink></li>

                <li><NavLink to={`/transaction`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Transaction</NavLink></li>

                <li><NavLink to={`/prices`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Prices</NavLink> </li>

                <li><NavLink to={`/salesman`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Salesman</NavLink></li>

                <li><NavLink to={`/sku`} className={({ isActive }) => (isActive ? 'active-link' : '')}>SKQ</NavLink></li>

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
