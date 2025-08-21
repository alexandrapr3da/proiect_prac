"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { FaUser, FaSignOutAlt } from "react-icons/fa"

function Profile() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleLogout = () => {
        // Add any logout logic here (clear tokens, etc.)
        window.location.href = "/login"
    }

    return (
        <div className="container">
            {/* Header */}
            <Header onToggle={handleToggle} />

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} onClose={handleClose} />

            {/* Floating bubbles */}
            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            <div className="homepage">
                <div className="discussion-detail">
                    <div className="profile-header">
                        <h1 className="gradient-text">Your GitHub Profile</h1>
                        <button className="logout-button" onClick={handleLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>

                    <div className="detail-card profile-card">
                        <div className="profile-content">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar">
                                    <FaUser />
                                </div>
                                <div className="profile-info">
                                    <h2>Ioana Popa</h2>
                                    <p className="profile-email">ioana.popa@gmail.com</p>
                                </div>
                            </div>

                            <div className="profile-note">
                                <p>
                                    To modify your profile information, please visit your GitHub account settings and make changes there.
                                    Your updates will be reflected here automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
