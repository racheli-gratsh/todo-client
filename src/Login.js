import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const result = await axios.post('/login', { username, password });
            localStorage.setItem('token', result.data.token);
            onLogin();
        } catch {
            setError('שם משתמש או סיסמה שגויים');
        }
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>התחברות</h2>
            <form onSubmit={handleLogin}>
                <input placeholder="שם משתמש" value={username} onChange={e => setUsername(e.target.value)} /><br /><br />
                <input placeholder="סיסמה" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
                <button type="submit">התחבר</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;