"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { FaUser, FaExclamationCircle, FaCheckCircle, FaCodeBranch, FaThumbsUp, FaThumbsDown } from "react-icons/fa"

export default function IssueDetails({ selectedIssue, onBack }) {
    const [userResponse, setUserResponse] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleSubmitResponse = () => {
        console.log("Submitting response:", userResponse)
        // Add your submission logic here
        setUserResponse("")
    }

    const getIssueDetails = (id) => ({
        id,
        title: "Database connection timeout in production",
        description: `I'm experiencing database connection timeouts when deploying to production. The connection works fine in development but fails in production environment.

Error message:
Connection timeout after 30 seconds

The database configuration looks like this:
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  timeout: 30000
};

Has anyone encountered this issue before? Any suggestions would be appreciated.`,
        repository: "project_test",
        status: "open",
        votes: 3,
        responses: 2,
        labels: ["bug", "production"],
        author: "You",
        timeAgo: "created 2 hours ago",
        answers: [
            {
                id: 1,
                content: `I had a similar issue. Try increasing the timeout value and check if your production database allows connections from your server IP.

You might also want to implement connection pooling:
const pool = new Pool({
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 30000
});`,
                author: "DevExpert",
                timeAgo: "1 hour ago",
                votes: 2,
            },
            {
                id: 2,
                content: `This looks like a network connectivity issue. Check your firewall settings and make sure the database port is open. Also verify your environment variables are correctly set in production.`,
                author: "SysAdmin",
                timeAgo: "30 minutes ago",
                votes: 1,
            },
        ],
    })

    const issueData = getIssueDetails(selectedIssue)

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
                            line.includes("connectionTimeoutMillis:") ||
                            line.includes("idleTimeoutMillis:")
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

    return (
        <div className="container">
            <Header onToggle={handleToggle} />
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} onClose={handleClose} />
            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            <div className="homepage">
                <div className="discussion-detail">
                    <button className="back-button" onClick={onBack}>
                        ← Back to Issues
                    </button>

                    <div className="detail-card">
                        <div className="votes">
                            <span>{issueData.votes}</span>
                            <span className="vote-label">votes</span>
                            <span>{issueData.responses}</span>
                            <span className="vote-label">responses</span>
                        </div>

                        <div className="detail-content">
                            <div className="issue-header-detail">
                                <div className="issue-status-detail">
                                    {issueData.status === "open" ? (
                                        <FaExclamationCircle className="status-icon open" />
                                    ) : (
                                        <FaCheckCircle className="status-icon closed" />
                                    )}
                                    <span className={`status-text ${issueData.status}`}>
                    {issueData.status.charAt(0).toUpperCase() + issueData.status.slice(1)}
                  </span>
                                </div>
                                <div className="issue-repo-detail">
                                    <FaCodeBranch className="repo-icon" />
                                    <span>{issueData.repository}</span>
                                </div>
                            </div>

                            <h1>{issueData.title}</h1>

                            <div className="issue-labels-detail">
                                {issueData.labels.map((label, index) => (
                                    <span key={index} className="issue-label">
                    {label}
                  </span>
                                ))}
                            </div>

                            <div className="detail-text">{renderContentWithCodeHighlighting(issueData.description)}</div>

                            <div className="detail-user">
                                <FaUser className="avatar" />
                                <div className="user-info">
                                    <strong>{issueData.author}</strong>
                                    <span>{issueData.timeAgo}</span>
                                </div>
                            </div>

                            {/* Responses Section */}
                            <div className="responses-section">
                                <h3>
                                    {issueData.responses} Response{issueData.responses !== 1 ? "s" : ""}
                                </h3>
                                {issueData.answers.map((answer) => (
                                    <div key={answer.id} className="response-card">
                                        <div className="response-votes">
                                            <button className="vote-btn">
                                                <FaThumbsUp />
                                            </button>
                                            <span className="vote-count">{answer.votes}</span>
                                            <button className="vote-btn">
                                                <FaThumbsDown />
                                            </button>
                                        </div>
                                        <div className="response-content">
                                            <div className="response-text">{renderContentWithCodeHighlighting(answer.content)}</div>
                                            <div className="response-user">
                                                <FaUser className="avatar" />
                                                <div className="user-info">
                                                    <strong>{answer.author}</strong>
                                                    <span>{answer.timeAgo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="answer-section">
                                <h3>Your Response</h3>
                                <div className="answer-input-container">
                  <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Write your response here..."
                      className="answer-input"
                      rows="6"
                  />
                                    <button className="submit-answer" onClick={handleSubmitResponse} disabled={!userResponse.trim()}>
                                        Submit Response
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
