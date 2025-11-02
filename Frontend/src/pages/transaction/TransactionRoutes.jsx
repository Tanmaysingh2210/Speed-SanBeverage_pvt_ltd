import React from 'react';

import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import  LoadOut  from './LoadOut';
import LoadIn from './LoadIn';
=======

import LoadOut from './LoadOut';
import LoadIn from './LoadIn';

>>>>>>> b63d4db84563b8519e9b6904c40849cffc90d1db


const Transaction = () => {
    return (
        <>
            <div className="box">
                <h2>Transactions</h2>
                <div className="options">
                    <ul>
                        <li><NavLink to={`/transaction/all-transaction`} className={({ isActive }) => (isActive ? 'active' : '')}>All Transactions</NavLink></li>
                        <li><NavLink to={`/transaction/load-out`} className={({ isActive }) => (isActive ? 'active' : '')}>Load Out</NavLink></li>

                        <li><NavLink to={`/transaction/load-in`} className={({ isActive }) => (isActive ? 'active' : '')}>Load In</NavLink></li>
                        <li><NavLink to={`/transaction/cash/credit`} className={({ isActive }) => (isActive ? 'active' : '')}>Cash/Credit</NavLink></li>
                        <li><NavLink to={`/transaction/s.sheet`} className={({ isActive }) => (isActive ? 'active' : '')}>S.Sheet</NavLink></li>
                    </ul>
                </div>

                <Routes>
                    <Route index element={<Navigate to="load-out" replace />} />
                    <Route path="load-out" element={<LoadOut />}></Route>
<<<<<<< HEAD
                    <Route path="load-in" element={<LoadIn />} /> 
                     
=======
                    <Route path="load-in" element={<LoadIn />} />                

>>>>>>> b63d4db84563b8519e9b6904c40849cffc90d1db
                </Routes>
            </div>
        </>
    )
}

export default Transaction
