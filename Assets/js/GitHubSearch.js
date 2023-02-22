class GitHubSearch {
    static search(username) {
        return fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(({ login, name, public_repos, followers }) => ({ login, name, public_repos, followers }))
    }
}

export { GitHubSearch }