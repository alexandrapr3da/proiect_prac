import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBook, FaExclamationCircle, FaInbox, FaUserCircle, FaHome } from 'react-icons/fa';

const Header = ({ onToggle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="navbar">
            <div className="sidebar-icon" onClick={onToggle}>
                <FaBars />
            </div>
            <Link
                to="/"
                className="logo"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <FaBook />
                <span style={{
                    color: isHovered ? 'transparent' : '#fff',
                    background: isHovered ? 'linear-gradient(90deg, #ff6ec4, #7873f5)' : 'none',
                    WebkitBackgroundClip: isHovered ? 'text' : 'initial',
                    WebkitTextFillColor: isHovered ? 'transparent' : 'initial',
                }}>
          CrowdCode
        </span>
            </Link>
            <div className="search-bar">
                <input type="text" placeholder="Search" />
            </div>
            <div className="nav-icons">
                <Link to="/myrepos" className="nav-icon"><FaBook /></Link>
                <Link to="/myissues" className="nav-icon"><FaExclamationCircle /></Link>
                <Link to="/inbox" className="nav-icon"><FaInbox /></Link>
                <Link to="/profile" className="nav-icon"><FaUserCircle /></Link>
                <Link to="/" className="nav-icon"><FaHome /></Link>
            </div>
        </div>
    );
};

export default Header;