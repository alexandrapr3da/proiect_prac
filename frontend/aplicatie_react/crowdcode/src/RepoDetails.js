import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import NewIssue from "./NewIssue"
import {
    FaFolder,
    FaFile,
    FaArrowLeft,
    FaPlus,
    FaSync,
    FaStar,
    FaCodeBranch,
    FaEye,
    FaCircle,
    FaUser,
} from "react-icons/fa"

function RepoDetails({ repository, onBack }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showNewIssue, setShowNewIssue] = useState(false)

    const handleToggle = () => setIsSidebarOpen(!isSidebarOpen)
    const handleClose = () => setIsSidebarOpen(false)

    const handleNewIssue = () => {
        setShowNewIssue(true)
    }

    const handleBackFromNewIssue = () => {
        setShowNewIssue(false)
    }

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

    const fileStructure = [
        { name: ".idea", type: "folder", icon: FaFolder },
        { name: "backend", type: "folder", icon: FaFolder },
        { name: "frontend", type: "folder", icon: FaFolder },
        { name: ".gitignore", type: "file", icon: FaFile },
    ]

    if (showNewIssue) {
        return <NewIssue repository={repository} onBack={handleBackFromNewIssue} />
    }

    return (
        <div className="container">
            <Header onToggle={handleToggle} />

            <Sidebar isOpen={isSidebarOpen} onToggle={handleToggle} onClose={handleClose} />

            <div className="bubble"></div>
            <div className="bubble-small"></div>
            <div className="bubble-bottom"></div>

            <div className="repo-details-page">
                <button className="back-button" onClick={onBack}>
                    <FaArrowLeft /> Back to Repositories
                </button>

                <div className="repo-details-header">
                    <div className="repo-info">
                        <div className="repo-owner">
                            <FaUser className="owner-avatar" />
                            <span className="owner-name">{repository.author}</span>
                            <span className="repo-separator">/</span>
                        </div>
                        <h1 className="repo-title">{repository.name}</h1>
                        <div className="repo-visibility">
                            {repository.isPrivate ? (
                                <span className="visibility-badge private">Private</span>
                            ) : (
                                <span className="visibility-badge public">Public</span>
                            )}
                        </div>
                    </div>

                    <div className="repo-actions">
                        <button className="action-button" onClick={handleNewIssue}>
                            <FaPlus /> New issue
                        </button>
                        <button className="action-button">
                            <FaSync /> Sync with GitHub
                        </button>
                    </div>
                </div>

                <div className="repo-stats-bar">
                    <div className="stats-left">
            <span className="stat-item">
              <FaEye /> {repository.stars + 15} watching
            </span>
                        <span className="stat-item">
              <FaStar /> {repository.stars} stars
            </span>
                        <span className="stat-item">
              <FaCodeBranch /> {repository.forks} forks
            </span>
                    </div>
                    <div className="stats-right">
            <span className="repo-language-stat">
              <FaCircle style={{ color: getLanguageColor(repository.language) }} />
                {repository.language}
            </span>
                    </div>
                </div>

                {repository.description && (
                    <div className="repo-description-section">
                        <p className="repo-description-text">{repository.description}</p>
                    </div>
                )}

                <div className="file-browser">
                    <div className="file-browser-header">
                        <div className="branch-info">
                            <FaCodeBranch /> main
                        </div>
                        <div className="commit-info">Latest commit • {repository.updatedAt}</div>
                    </div>

                    <div className="file-list">
                        {fileStructure.map((item, index) => (
                            <div key={index} className="file-item">
                                <div className="file-info">
                                    <item.icon className={`file-icon ${item.type}`} />
                                    <span className="file-name">{item.name}</span>
                                </div>
                                <div className="file-meta">
                  <span className="commit-message">
                    {item.type === "folder" ? "Updated folder structure" : "Initial commit"}
                  </span>
                                    <span className="commit-time">{repository.updatedAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RepoDetails
