"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import { FaUser } from "react-icons/fa"

export default function Details({ selectedDiscussion, onBack }) {
    const [userAnswer, setUserAnswer] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleSubmitAnswer = () => {
        console.log("Submitting answer:", userAnswer)

        setUserAnswer("")
    }

    const getDiscussionDetails = (id) => ({
        id,
        title: "Generic output type depending on input parameter type",
        content: `I created a function to query a database table for a specific attribute. The Attribute to query is not known, neither is the type.

Previously, I had the following rule:
allow read: if request.auth.token.email in
get(/databases/$(database)/documents/users/$(userId)).data.shareWith;

Now, that the data structure changed and shareWith is no longer an array of email addresses, but an array of maps, how can I adapt this rule accordingly?

This is how the DB looks like now:
shareWith: email: "some@email.com"`,
        votes: 0,
        answers: 4,
        author: "Ioana Popa",
        timeAgo: "asked 16 mins ago",
    })

    const discussionData = getDiscussionDetails(selectedDiscussion)

    const renderContentWithCodeHighlighting = (content) => {
        return content.split("\n\n").map((paragraph, index) => {

            const lines = paragraph.split("\n")

            return (
                <div key={index}>
                    {lines.map((line, lineIndex) => {

                        if (
                            line.trim().startsWith("allow read:") ||
                            line.trim().startsWith("get(/") ||
                            line.trim().startsWith("shareWith: email:")
                        ) {
                            return (
                                <div key={lineIndex} className="code-block">
                                    {line}
                                </div>
                            )
                        }

                        const parts = line.split(
                            /(if request\.auth\.token\.email in get$$[^)]+$$\.data\.shareWith;|shareWith: email: "[^"]+"|`[^`]+`)/g,
                        )

                        if (parts.length > 1) {
                            return (
                                <p key={lineIndex}>
                                    {parts.map((part, partIndex) => {
                                        if (
                                            part.includes("if request.auth.token.email") ||
                                            part.includes("shareWith: email:") ||
                                            (part.startsWith("`") && part.endsWith("`"))
                                        ) {
                                            return (
                                                <code key={partIndex} className="inline-code">
                                                    {part.replace(/`/g, "")}
                                                </code>
                                            )
                                        }
                                        return part
                                    })}
                                </p>
                            )
                        }

                        return <p key={lineIndex}>{line}</p>
                    })}
                </div>
            )
        })
    }

    return (
        <div className="container">

            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} onClose={handleClose} />
            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            <div className="homepage">
                <div className="discussion-detail">
                    <button className="back-button" onClick={onBack}>
                        ← Back to Topics
                    </button>

                    <div className="detail-card">
                        <div className="votes">
                            <span>{discussionData.votes}</span>
                            <span className="vote-label">votes</span>
                            <span>{discussionData.answers}</span>
                            <span className="vote-label">answers</span>
                        </div>

                        <div className="detail-content">
                            <h1>{discussionData.title}</h1>

                            <div className="detail-text">{renderContentWithCodeHighlighting(discussionData.content)}</div>

                            <div className="answer-section">
                                <h3>Your Answer</h3>
                                <div className="answer-input-container">
                  <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Write your answer here..."
                      className="answer-input"
                      rows="8"
                  />
                                    <button className="submit-answer" onClick={handleSubmitAnswer} disabled={!userAnswer.trim()}>
                                        Submit Answer
                                    </button>
                                </div>
                            </div>

                            <div className="detail-user">
                                <FaUser className="avatar" />
                                <div className="user-info">
                                    <strong>{discussionData.author}</strong>
                                    <span>{discussionData.timeAgo}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pagination">
                        <span>← Previous</span>
                        <span className="active">1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>…</span>
                        <span>67</span>
                        <span>68</span>
                        <span>Next →</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
