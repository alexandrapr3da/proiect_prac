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

    const posts = [
        {
            id: 1,
            title: "Generic output type depending on input parameter type",
            description: "I created a function to query a database table for a specific attribute. The Attribute to query is not known, neither is the type.",
            author: "ralucZ",
            time: "16 mins ago",
            votes: 0,
            answers: 4
        },
        {
            id: 2,
            title: "What algorithm best finds the shortest path of a graph that visits all marked edges",
            description: "The current problem I have is that I have an undirected graph, with edges with varying non-negative weights. Some edges are marked as must visit. Starting at a particular node...",
            author: "alexandrapr3da",
            time: "2 hours ago",
            votes: 1,
            answers: 0
        },
        {
            id: 3,
            title: "How do I convert a derived class to base abstract generic class when returned from function?",
            description: "I am working on an application where I need to pull data from different systems with different connection types, get some data from each one, then return it in a consistent format. I have defined a ...",
            author: "ralucZ",
            time: "4 hours ago",
            votes: 2,
            answers: 1
        },
        {
            id: 4,
            title: "How to update string attributes to object instances if they exist",
            description: "I'm trying to use a for loop to iterate through a set of objects, check if those objects store string data (specifically their 'Pokemon.evolution' variable) which is the same as a the name of one of ...",
            author: "alexandrapr3da",
            time: "27 mins ago",
            votes: 4,
            answers: 2
        }
    ]

    return (
        <div className="container">

            <Header onToggle={handleToggle} />

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
                            {posts.map((post) => (
                                <div className="topic-card" key={post.id}>
                                    <div className="votes">
                                        <span>{post.votes}</span>
                                        <span className="vote-label">votes</span>
                                        <span>{post.answers}</span>
                                        <span className="vote-label">answers</span>
                                    </div>
                                    <div className="topic-content">
                                        <h2>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleDiscussionClick(post.id)
                                                }}
                                            >
                                                {post.title}
                                            </a>
                                        </h2>
                                        <p>{post.description}</p>
                                    </div>
                                    <div className="topic-user">
                                        <FaUser className="avatar" />
                                        <div className="user-info">
                                            <strong>{post.author}</strong>
                                            <span>asked {post.time}</span>
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
