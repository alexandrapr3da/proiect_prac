import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBook, FaExclamationCircle, FaInbox, FaUserCircle, FaHome } from 'react-icons/fa';

function MyIssues() {
    return (
        <div className="container">
            {/* Navbar */}
            <div className="navbar">
                <div className="sidebar-icon"><FaBars/></div>
                <div className="logo">
                    <FaBook/>
                    <span>CrowdCode</span>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Search"/>
                </div>
                <div className="nav-icons">
                    <Link to="/myrepos" className="nav-icon"><FaBook/></Link>
                    <Link to="/myissues" className="nav-icon"><FaExclamationCircle/></Link>
                    <Link to="/inbox" className="nav-icon"><FaInbox/></Link>
                    <Link to="/profile" className="nav-icon"><FaUserCircle/></Link>
                    <Link to="/" className="nav-icon"><FaHome/></Link>
                </div>
            </div>

            {/* Floating bubbles */}
            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            {/* Page content */}
            <div className="page-content">
                <h1 className="gradient-text">My Issues</h1>
                <p>Manage and track your issues for open-source projects.</p>
            </div>
        </div>
    );
}

export default MyIssues;