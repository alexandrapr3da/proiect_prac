import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onToggle, onClose }) => {
    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
                <div
                    className={`sidebar-content ${isOpen ? 'open' : ''}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="sidebar-header">
                        <div className="sidebar-icon" onClick={onToggle}>
                            <FaBars />
                        </div>
                        <Link to="/" className="logo">
                            <span>CrowdCode</span>
                        </Link>
                    </div>
                    <ul>
                        <li><a href="#" style={{color: '#fff', textDecoration: 'none'}}>proiect_prac</a></li>
                        <li><a href="#" style={{color: '#fff', textDecoration: 'none'}}>filesystem-ralucZ</a></li>
                        <li><a href="#" style={{color: '#fff', textDecoration: 'none'}}>rustybox-ralucZ</a></li>
                        <li><a href="#" style={{color: '#fff', textDecoration: 'none'}}>rustyloader-ralucZ</a></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
