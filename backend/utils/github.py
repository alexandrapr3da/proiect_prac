from github import Github
import os
import requests

GITHUB_API_BASE = "https://api.github.com"

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
    

def get_github_user(pat: str):
    headers = {"Authorization": f"token {pat}", "Accept": "application/vnd.github+json"}
    resp = requests.get(f"{GITHUB_API_BASE}/user", headers=headers, timeout=15)
    if resp.status_code != 200:
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text
        raise ValueError(f"GitHub token invalid or unauthorized: {detail}")
    return resp.json()

def get_user_repos(pat: str):
    headers = {"Authorization": f"token {pat}", "Accept": "application/vnd.github+json"}
    resp = requests.get(f"{GITHUB_API_BASE}/user/repos", headers=headers, timeout=15)

    if resp.status_code != 200:
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text
        raise ValueError(f"Unable to fetch repos: {detail}")

    repos = resp.json()
    return [
        {
            "github_id": str(repo["id"]),
            "name": repo["name"],
            "full_name": repo["full_name"],
            "url": repo["html_url"],
            "description": repo.get("description"),
            "private": repo["private"],
            "stargazers_count": repo["stargazers_count"],
            "forks_count": repo["forks_count"],
        }
        for repo in repos
    ]