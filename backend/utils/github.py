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

def get_issues_from_repo(repo_full_name: str, token: str):
    """
    Fetch open issues from a given GitHub repository.
    repo_full_name should be in the format 'username/repo'
    """
    try:
        g = Github(token)
        repo = g.get_repo(repo_full_name)
        issues = repo.get_issues(state="open")
        return [{
            "title": issue.title,
            "body": issue.body,
            "created_at": issue.created_at.isoformat(),
            "url": issue.html_url,
            "number": issue.number
        } for issue in issues]
    except Exception as e:
        return {"error": str(e)}