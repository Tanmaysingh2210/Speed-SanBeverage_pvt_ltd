import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import toast from "react-hot-toast";
import { FaWineBottle } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { useDepo } from '../context/depoContext';

const Burger = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { depos } = useDepo();

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

    const [open, setOpen] = useState(false);
    const handleMenuToggle = (isOpen) => {
        setOpen(isOpen);
        if (onMenuToggle) {
            onMenuToggle(isOpen);  // Pass state to parent
        }
    };

    const getDepoName = (depo) => {
        if (!depo || !Array.isArray(depos)) return "";
        const id = String(depo).trim();
        const matchDepo = depos.find((d) => String(d._id).trim() === id);
        return matchDepo?.depoName ?? "";
    }


    return (
        <>
            <button
                onClick={() => handleMenuToggle(true)}
                className={`menu-btn text-3xl p-2 ${open ? "hidden-menu" : ""}`}
            >
                <IoMenu />
            </button>


            <div className={`burger-box ${open ? "show" : "hide"}`}>
                <div className="heading">
                    <FaWineBottle className="text-blue-600 text-2xl" />
                    <h3 >SAN Beverages</h3>

                    <IoClose className="text-3xl cursor-pointer hover:text-red-500"
                        onClick={() => handleMenuToggle(false)}
                    />

                </div>
                <div className="line"></div>
                <ul className="burger-ul">
                    <li><NavLink to={'/stock'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Stock</NavLink></li>

                    <li><NavLink to={'/purchase'} className={({ isActive }) => (isActive ? 'active-link' : '')}>Purchase</NavLink></li>

                    <li><NavLink to={`/transaction`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Transaction</NavLink></li>

                    <li><NavLink to={`/prices`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Prices</NavLink> </li>

                    <li><NavLink to={`/salesman`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Salesman</NavLink></li>

                    <li><NavLink to={`/sku`} className={({ isActive }) => (isActive ? 'active-link' : '')}>SKU</NavLink></li>

                    <li><NavLink to={`/depo`} className={({ isActive }) => (isActive ? 'active-link' : '')}>Depo</NavLink></li>

                </ul>

                {user &&
                    (
                        <div className="user-section">
                            {/* <div className="user-info"> */}
                                {/* <div className="user-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div> */}
                                <div className="user-details">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-depo">{getDepoName(user.depo)}</span>
                                </div>
                            {/* </div> */}
                            <button className="logout-btn" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    )
                }

            </div>
        </>
    )
}

export default Burger
