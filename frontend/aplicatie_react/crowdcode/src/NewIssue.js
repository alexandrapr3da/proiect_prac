"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { FaArrowLeft, FaUser, FaCode, FaEye, FaPaperPlane, FaExclamationCircle } from "react-icons/fa"

function NewIssue({ repository, onBack }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (title.trim() && description.trim()) {
            // Handle issue submission here
            console.log("Submitting issue:", { title, description, repository: repository.name })

            setShowSuccess(true)
            setTitle("")
            setDescription("")

            // Hide notification and navigate back after 3 seconds
            setTimeout(() => {
                setShowSuccess(false)
                onBack()
            }, 3000)
        }
    }

    const renderContentWithCodeHighlighting = (content) => {
        if (!content) return ""

        const lines = content.split("\n")
        return lines.map((line, index) => {
            // Check if line contains code patterns
            const isCodeLine =
                line.includes("```") ||
                line.includes("function") ||
                line.includes("const ") ||
                line.includes("let ") ||
                line.includes("var ") ||
                line.includes("import ") ||
                line.includes("export ") ||
                line.includes("class ") ||
                line.includes("if (") ||
                line.includes("for (") ||
                line.includes("while (") ||
                line.includes("return ") ||
                line.includes("console.") ||
                line.includes("document.") ||
                line.includes("window.") ||
                line.includes("async ") ||
                line.includes("await ") ||
                line.includes("=>") ||
                line.includes("${") ||
                line.includes("</") ||
                line.includes("</")

            if (isCodeLine) {
                return (
                    <div key={index} className="code-line">
                        {line}
                    </div>
                )
            }
            return (
                <div key={index} className="text-line">
                    {line}
                </div>
            )
        })
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

            {showSuccess && (
                <div className="success-notification">
                    <div className="success-content">
                        <FaExclamationCircle className="success-icon" />
                        <span>Issue submitted successfully! Redirecting back to repository...</span>
                    </div>
                </div>
            )}

            <div className="new-issue-page">
                {/* Back button */}
                <button className="back-button" onClick={onBack}>
                    <FaArrowLeft /> Back to {repository.name}
                </button>

                {/* Repository context */}
                <div className="issue-repo-context">
                    <div className="repo-context-info">
                        <FaUser className="owner-avatar" />
                        <span className="owner-name">{repository.author}</span>
                        <span className="repo-separator">/</span>
                        <span className="repo-name">{repository.name}</span>
                    </div>
                    <div className="issue-indicator">
                        <FaExclamationCircle />
                        <span>New Issue</span>
                    </div>
                </div>

                {/* New Issue Form */}
                <div className="new-issue-container">
                    <div className="issue-header">
                        <h1 className="issue-title">Create New Issue</h1>
                        <p className="issue-subtitle">Report a bug, request a feature, or ask a question about {repository.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="issue-form">
                        {/* Title Input */}
                        <div className="form-group">
                            <label htmlFor="issue-title" className="form-label">
                                Title <span className="required">*</span>
                            </label>
                            <input
                                id="issue-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brief description of the issue..."
                                className="issue-title-input"
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div className="form-group">
                            <div className="form-label-row">
                                <label htmlFor="issue-description" className="form-label">
                                    Description <span className="required">*</span>
                                </label>
                                <div className="format-toggle">
                                    <button
                                        type="button"
                                        className={`format-btn ${!isPreviewMode ? "active" : ""}`}
                                        onClick={() => setIsPreviewMode(false)}
                                    >
                                        <FaCode /> Write
                                    </button>
                                    <button
                                        type="button"
                                        className={`format-btn ${isPreviewMode ? "active" : ""}`}
                                        onClick={() => setIsPreviewMode(true)}
                                    >
                                        <FaEye /> Preview
                                    </button>
                                </div>
                            </div>

                            {!isPreviewMode ? (
                                <textarea
                                    id="issue-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail. You can use code blocks with \`\`\` or inline code with backticks..."
                                    className="issue-description-input"
                                    rows="12"
                                    required
                                />
                            ) : (
                                <div className="issue-preview">
                                    {description ? (
                                        <div className="preview-content">{renderContentWithCodeHighlighting(description)}</div>
                                    ) : (
                                        <div className="preview-placeholder">
                                            Nothing to preview yet. Write something in the description field.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="format-help">
                                <small>
                                    <strong>Tip:</strong> Use \`\`\` for code blocks, `backticks` for inline code, and include relevant
                                    error messages or logs.
                                </small>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button type="submit" className="submit-issue-btn" disabled={!title.trim() || !description.trim()}>
                                <FaPaperPlane /> Submit Issue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewIssue
