"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Details from "./Details"
import { FaUser } from "react-icons/fa"

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedDiscussion, setSelectedDiscussion] = useState(null)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleDiscussionClick = (discussionId) => {
        setSelectedDiscussion(discussionId)
    }

    const handleBackToTopics = () => {
        setSelectedDiscussion(null)
    }

    return (
        <div className="container">
            {/* Header */}
            <Header onToggle={handleToggle} />

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} onClose={handleClose} />
            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            <div className="homepage">
                {!selectedDiscussion ? (
                    <>
                        <div className="topics-header">
                            <h1 className="gradient-text">Latest Topics</h1>
                            <button className="start-discussion">Start Discussion</button>
                        </div>

                        <div className="topics-list">
                            {[1, 2, 3, 4].map((item) => (
                                <div className="topic-card" key={item}>
                                    <div className="votes">
                                        <span>0</span>
                                        <span className="vote-label">votes</span>
                                        <span>4</span>
                                        <span className="vote-label">answers</span>
                                    </div>
                                    <div className="topic-content">
                                        <h2>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleDiscussionClick(item)
                                                }}
                                            >
                                                Generic output type depending on input parameter type
                                            </a>
                                        </h2>
                                        <p>
                                            I created a function to query a database table for a specific attribute. The Attribute to query is
                                            not known, neither is the type.
                                        </p>
                                    </div>
                                    <div className="topic-user">
                                        <FaUser className="avatar" />
                                        <div className="user-info">
                                            <strong>Ioana Popa</strong>
                                            <span>asked 16 mins ago</span>
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
                            <span>67</span>
                            <span>68</span>
                            <span>Next →</span>
                        </div>
                    </>
                ) : (
                    <Details selectedDiscussion={selectedDiscussion} onBack={handleBackToTopics} />
                )}
            </div>
        </div>
    )
}
