import React, { useState } from "react";
import { useAuth } from "./AuthContext";

function TokenInput() {
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse("");
        setError("");

        try {
            const res = await fetch("http://localhost:8001/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ github_token: token })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Login failed");
            }

            const data = await res.json();
            login(data.access_token);

            setResponse("✅ Successfully authenticated!");
        } catch (err) {
            console.error(err);
            setError(`❌ ${err.message}`);
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
                    placeholder="Your GitHub token"
                    required
                />
            </label>
            <button type="submit">Authenticate with GitHub</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {response && <p style={{ color: "green" }}>{response}</p>}
        </form>
    );
}

export default TokenInput;
