import React, { useState } from 'react';

function TokenInput() {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [response, setResponse] = useState('');

    const validateToken = (token) => {

        const regex = /^[a-f0-9]{40}$/i;
        return regex.test(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse('');
        setError('');

        if (!validateToken(token)) {
            setError('Invalid token!');
            return;
        }

        try {
            const res = await fetch('https://api.github.com/user', {
                method: 'GET',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github+json',
                },
            });

            if (res.status === 401) {
                setError('Unauthorized: Token is invalid or expired.');
                return;
            }

            if (!res.ok) {
                throw new Error(`GitHub API error: ${res.status}`);
            }

            const data = await res.json();
            setResponse(`Authenticated as: ${data.login}`);
        } catch (err) {
            console.error(err);
            setError(`Request failed: ${err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter your GitHub token:
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Your 40-char GitHub token"
                />
            </label>
            <button type="submit">Authenticate with GitHub</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {response && <p style={{ color: 'green' }}>{response}</p>}
        </form>
    );
}

export default TokenInput;
