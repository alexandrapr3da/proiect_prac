from github import Github
import os

def search_github_repos(query: str, token: str):
    try:
        g = Github(token)
        result = g.search_repositories(query=query)
        return [{
            "github_id": str(repo.id),
            "name": repo.full_name,
            "url": repo.html_url,
            "description": repo.description
        } for repo in result[:5]]
    except Exception as e:
        return {"error": str(e)}