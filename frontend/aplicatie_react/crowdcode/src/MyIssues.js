"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import IssueDetails from "./IssueDetails"
import { FaUser, FaExclamationCircle, FaCheckCircle, FaClock, FaCodeBranch } from "react-icons/fa"

function MyIssues() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedIssue, setSelectedIssue] = useState(null)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleViewIssue = (issueId) => {
        setSelectedIssue(issueId)
    }

    const handleBackToIssues = () => {
        setSelectedIssue(null)
    }

    const getMyIssues = () => [
        {
            id: 1,
            title: "Database connection timeout in production",
            description: `I'm experiencing database connection timeouts when deploying to production. The connection works fine in development but fails in production environment.

Error message:
Connection timeout after 30 seconds

The database configuration looks like this:
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  timeout: 30000
};`,
            repository: "project_test",
            status: "open",
            createdAt: "2 hours ago",
            labels: ["bug", "production"],
        },
        {
            id: 2,
            title: "API rate limiting not working correctly",
            description: `The rate limiting middleware is not properly throttling requests. Users can make unlimited API calls which is causing server overload.

Current implementation:
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

Expected: 100 requests per 15 minutes
Actual: No rate limiting applied`,
            repository: "api-server",
            status: "open",
            createdAt: "4 hours ago",
            labels: ["bug", "security", "api"],
        },
        {
            id: 3,
            title: "Add dark mode toggle to settings page",
            description: `Users have requested a dark mode option in the application settings. This should persist across sessions and apply to all pages.

Requirements:
- Toggle switch in settings
- Save preference to localStorage
- Apply theme globally
- Smooth transition between themes`,
            repository: "frontend-ui",
            status: "open",
            createdAt: "1 day ago",
            labels: ["enhancement", "ui", "settings"],
        },
        {
            id: 4,
            title: "Update README with installation instructions",
            description: `The current README is missing detailed installation instructions for new contributors. We need to add:

- Prerequisites
- Step-by-step setup guide
- Environment variables configuration
- Common troubleshooting tips

This will help new developers get started quickly.`,
            repository: "project_test",
            status: "closed",
            createdAt: "2 days ago",
            labels: ["documentation", "good first issue"],
        },
        {
            id: 5,
            title: "Memory leak in image processing service",
            description: `The image processing service is consuming increasing amounts of memory over time, eventually causing the application to crash.

Memory usage pattern:
- Starts at ~200MB
- Grows to 2GB+ after processing 1000 images
- No memory is released after processing

Suspected cause: Images not being properly disposed after processing.`,
            repository: "media-service",
            status: "open",
            createdAt: "3 days ago",
            labels: ["bug", "performance", "critical"],
        },
        {
            id: 6,
            title: "Implement user profile picture upload",
            description: `Add functionality for users to upload and manage their profile pictures.

Technical requirements:
- Support JPEG, PNG, WebP formats
- Maximum file size: 5MB
- Automatic image resizing to 200x200px
- Store images in cloud storage
- Update user profile with image URL

const uploadConfig = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
};`,
            repository: "user-management",
            status: "open",
            createdAt: "5 days ago",
            labels: ["enhancement", "user-experience"],
        },
        {
            id: 7,
            title: "Fix broken unit tests in authentication module",
            description: `Several unit tests in the authentication module are failing after the recent security updates. Tests need to be updated to match the new implementation.

Failing tests:
- test_login_with_valid_credentials
- test_password_reset_flow
- test_token_expiration

All tests were passing before the security patch was applied.`,
            repository: "auth-service",
            status: "closed",
            createdAt: "1 week ago",
            labels: ["bug", "testing", "authentication"],
        },
    ]

    const issues = getMyIssues()

    const renderContentWithCodeHighlighting = (content) => {
        return content.split("\n\n").map((paragraph, index) => {
            const lines = paragraph.split("\n")

            return (
                <div key={index}>
                    {lines.map((line, lineIndex) => {
                        // Highlight code lines
                        if (
                            line.trim().startsWith("const ") ||
                            line.trim().startsWith("Connection timeout") ||
                            line.trim().includes("process.env") ||
                            line.trim().includes("dbConfig") ||
                            line.includes("host:") ||
                            line.includes("port:") ||
                            line.includes("timeout:") ||
                            line.includes("app.use(rateLimit({") ||
                            line.includes("maxSize:") ||
                            line.includes("allowedTypes:")
                        ) {
                            return (
                                <div key={lineIndex} className="code-block">
                                    {line}
                                </div>
                            )
                        }

                        // Regular text line
                        return line.trim() ? <p key={lineIndex}>{line}</p> : <br key={lineIndex} />
                    })}
                </div>
            )
        })
    }

    if (selectedIssue) {
        const selectedIssueDetails = issues.find((issue) => issue.id === selectedIssue)
        return <IssueDetails selectedIssue={selectedIssueDetails} onBack={handleBackToIssues} />
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

            {/* Page content */}
            <div className="homepage">
                <div
                    className="topics-header"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                >
                    <h1 className="gradient-text">My Issues</h1>
                    <p className="repos-subtitle">Manage and track your issues for open-source projects</p>
                </div>

                <div className="issues-list">
                    {issues.map((issue) => (
                        <div
                            key={issue.id}
                            className="detail-card issue-card"
                            onClick={() => handleViewIssue(issue.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="issue-header">
                                <div className="issue-status">
                                    {issue.status === "open" ? (
                                        <FaExclamationCircle className="status-icon open" />
                                    ) : (
                                        <FaCheckCircle className="status-icon closed" />
                                    )}
                                    <span className={`status-text ${issue.status}`}>
                    {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                  </span>
                                </div>
                                <div className="issue-repo">
                                    <FaCodeBranch className="repo-icon" />
                                    <span>{issue.repository}</span>
                                </div>
                            </div>

                            <div className="detail-content">
                                <h2 className="issue-title">{issue.title}</h2>

                                <div className="issue-labels">
                                    {issue.labels.map((label, index) => (
                                        <span key={index} className="issue-label">
                      {label}
                    </span>
                                    ))}
                                </div>

                                <div className="detail-text issue-description">
                                    {renderContentWithCodeHighlighting(issue.description)}
                                </div>

                                <div className="detail-user issue-meta">
                                    <FaUser className="avatar" />
                                    <div className="user-info">
                                        <strong>You</strong>
                                        <span className="issue-time">
                      <FaClock className="time-icon" />
                      created {issue.createdAt}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <span>← Previous</span>
                    <span className="active">1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>…</span>
                    <span>Next →</span>
                </div>
            </div>
        </div>
    )
}

export default MyIssues
