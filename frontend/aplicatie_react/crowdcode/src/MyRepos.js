"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import RepoDetails from "./RepoDetails"
import { FaUser, FaUsers, FaLock, FaGlobe, FaStar, FaCodeBranch, FaCircle, FaSync } from "react-icons/fa"

function MyRepos() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedRepo, setSelectedRepo] = useState(null)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleRepoClick = (repo) => {
        setSelectedRepo(repo)
    }

    const handleBackToRepos = () => {
        setSelectedRepo(null)
    }

    const handleSyncWithGitHub = () => {

        console.log("Syncing with GitHub...")
    }

    const repositories = [
        {
            id: 1,
            name: "proiect_prac",
            description: "A web application with a React frontend and a Python backend connected to a PostgreSQL database.",
            author: "alexandrapr3da",
            isPrivate: true,
            collaborators: 2,
            stars: 24,
            forks: 8,
            language: "Python",
            updatedAt: "2 days ago",
        },
        {
            id: 2,
            name: "filesystem-ralucZ",
            description: "SdE2 Devoir 1 - File System Simulation",
            author: "ralucZ",
            isPrivate: true,
            collaborators: 1,
            stars: 156,
            forks: 42,
            language: "Rust",
            updatedAt: "2 years ago",
        },
        {
            id: 3,
            name: "rustybox-ralucZ",
            description: "SdE2 Devoir 2 - Simulation of Linux commands",
            author: "ralucZ",
            isPrivate: true,
            collaborators: 1,
            stars: 89,
            forks: 23,
            language: "Rust",
            updatedAt: "2 years ago",
        },
        {
            id: 4,
            name: "Rusty Loader",
            description: "SdE2 Devoir 3 Starter - Rusty Loader",
            author: "ralucZ",
            isPrivate: true,
            collaborators: 1,
            stars: 12,
            forks: 3,
            language: "Rust",
            updatedAt: "2 years ago",
        },
    ]

    const getLanguageColor = (language) => {
        const colors = {
            JavaScript: "#f1e05a",
            Python: "#3572A5",
            TypeScript: "#2b7489",
            Go: "#00ADD8",
            Java: "#b07219",
            "C++": "#f34b7d",
            HTML: "#e34c26",
            CSS: "#563d7c",
        }
        return colors[language] || "#8b949e"
    }

    if (selectedRepo) {
        return <RepoDetails repository={selectedRepo} onBack={handleBackToRepos} />
    }

    return (
        <div className="container">

            <Header onToggle={handleToggle} />


            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} onClose={handleClose} />

            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            <div className="repos-page">
                <div className="repos-header">
                    <h1 className="gradient-text">My Repositories</h1>
                    <p className="repos-subtitle">Explore and manage your repositories synced with GitHub</p>
                    <div className="sync-button-container">
                        <button className="action-button" onClick={handleSyncWithGitHub}>
                            <FaSync /> Sync with GitHub
                        </button>
                    </div>
                </div>

                <div className="repos-list">
                    {repositories.map((repo) => (
                        <div
                            key={repo.id}
                            className="repo-card"
                            onClick={() => handleRepoClick(repo)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="repo-header">
                                <div className="repo-title-section">
                                    <h3 className="repo-name">{repo.name}</h3>
                                    <div className="repo-badges">
                                        {repo.isPrivate ? (
                                            <span className="repo-badge private">
                        <FaLock /> Private
                      </span>
                                        ) : (
                                            <span className="repo-badge public">
                        <FaGlobe /> Public
                      </span>
                                        )}
                                    </div>
                                </div>
                                <div className="repo-collaborators">
                                    {repo.collaborators === 1 ? (
                                        <span className="collaborator-info">
                      <FaUser /> Solo
                    </span>
                                    ) : (
                                        <span className="collaborator-info">
                      <FaUsers /> {repo.collaborators} collaborators
                    </span>
                                    )}
                                </div>
                            </div>

                            <p className="repo-description">{repo.description}</p>

                            <div className="repo-footer">
                                <div className="repo-stats">
                  <span className="repo-language">
                    <FaCircle style={{ color: getLanguageColor(repo.language) }} />
                      {repo.language}
                  </span>
                                    <span className="repo-stat">
                    <FaStar /> {repo.stars}
                  </span>
                                    <span className="repo-stat">
                    <FaCodeBranch /> {repo.forks}
                  </span>
                                </div>
                                <span className="repo-updated">Updated {repo.updatedAt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyRepos
