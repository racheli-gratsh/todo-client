import React, { useState } from 'react';
import service from './service';
 
function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
 
    async function handleRegister(e) {
        e.preventDefault();
        try {
            await service.register(username, password);
            setMessage('נרשמת בהצלחה! עובר להתחברות...');
            setTimeout(() => onRegister(), 2000);
        } catch {
            setMessage('שגיאה בהרשמה');
        }
    }
 
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>הרשמה</h2>
            <form onSubmit={handleRegister}>
                <input placeholder="שם משתמש" value={username} onChange={e => setUsername(e.target.value)} /><br /><br />
                <input placeholder="סיסמה" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
                <button type="submit">הרשם</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
 
export default Register;