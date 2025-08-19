"use client"

import { useState } from "react"
import { FaUser, FaComment, FaExclamationCircle, FaCodeBranch, FaStar, FaEye } from "react-icons/fa"
import Header from "./Header"
import Sidebar from "./Sidebar"

function Inbox() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const notifications = [
        {
            id: 1,
            type: "reply",
            icon: <FaComment />,
            user: "sarah_dev",
            message: "replied to your issue",
            issue: "Database connection timeout in production",
            repository: "project_test",
            time: "2 minutes ago",
            unread: true,
        },
        {
            id: 2,
            type: "mention",
            icon: <FaUser />,
            user: "john_doe",
            message: "mentioned you in",
            issue: "API rate limiting implementation",
            repository: "api-service",
            time: "1 hour ago",
            unread: true,
        },
        {
            id: 3,
            type: "status",
            icon: <FaExclamationCircle />,
            user: "maintainer",
            message: "closed your issue",
            issue: "Memory leak in user authentication",
            repository: "auth-module",
            time: "3 hours ago",
            unread: false,
        },
        {
            id: 4,
            type: "pr",
            icon: <FaCodeBranch />,
            user: "alex_coder",
            message: "opened a pull request that references your issue",
            issue: "Fix documentation typos",
            repository: "docs-site",
            time: "1 day ago",
            unread: false,
        },
        {
            id: 5,
            type: "star",
            icon: <FaStar />,
            user: "community_user",
            message: "starred your repository",
            issue: "react-components",
            repository: "react-components",
            time: "2 days ago",
            unread: false,
        },
        {
            id: 6,
            type: "watch",
            icon: <FaEye />,
            user: "developer123",
            message: "started watching",
            issue: "your repository",
            repository: "web-scraper",
            time: "3 days ago",
            unread: false,
        },
        {
            id: 7,
            type: "reply",
            icon: <FaComment />,
            user: "code_reviewer",
            message: "added a comment to your issue",
            issue: "Performance optimization needed",
            repository: "frontend-app",
            time: "1 week ago",
            unread: false,
        },
    ]

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

            {/* Page content */}
            <div className="homepage">
                <div
                    className="topics-header"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <h1 className="gradient-text">Inbox</h1>
                    <p className="repos-subtitle">Stay updated with your notifications and activity</p>
                </div>

                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`notification-card ${notification.unread ? "unread" : ""}`}>
                            <div className="notification-icon">{notification.icon}</div>
                            <div className="notification-content">
                                <div className="notification-main">
                                    <span className="notification-user">{notification.user}</span>
                                    <span className="notification-action">{notification.message}</span>
                                    <span className="notification-target">"{notification.issue}"</span>
                                    <span className="notification-repo">in {notification.repository}</span>
                                </div>
                                <div className="notification-time">{notification.time}</div>
                            </div>
                            {notification.unread && <div className="unread-indicator"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Inbox
