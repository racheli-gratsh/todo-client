import { useState } from 'react';
import service from './service';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

   const handleLogin = async () => {
    try {
        const result = await service.login(username, password);
        localStorage.setItem('token', result.token);

        onLogin(); // 👈 זה השינוי החשוב
    } catch (err) {
        alert('שגיאה בהתחברות');
    }
};

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;