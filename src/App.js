import React, { useEffect, useState } from 'react';
import service from './service.js';
import Login from './Login.js';
import Register from './Register.js';

function App() {
    const [newTodo, setNewTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [page, setPage] = useState('login');

    const isLoggedIn = !!localStorage.getItem('token');

    async function getTodos() {
        const response = await service.getTasks();
        setTodos(response);
    }

    async function createTodo(e) {
        e.preventDefault();
        await service.addTask(newTodo);
        setNewTodo("");
        await getTodos();
    }

    async function updateCompleted(todo, isComplete) {
        await service.setCompleted(todo.id, isComplete, todo.name);
        await getTodos();
    }

    async function deleteTodo(id) {
        await service.deleteTask(id);
        await getTodos();
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setPage('login');
    }

    useEffect(() => {
        if (isLoggedIn) {
            setPage('app');
            getTodos();
        }
    }, []);

    if (page === 'register') return <Register onRegister={() => setPage('login')} />;
    if (page === 'login') return (
        <div>
            <Login onLogin={() => { setPage('app'); getTodos(); }} />
            <p style={{ textAlign: 'center' }}>
                אין לך חשבון? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setPage('register')}>הרשם כאן</span>
            </p>
        </div>
    );

    return (
        <section className="todoapp">
            <header className="header">
                <h1>todos</h1>
                <button onClick={handleLogout} style={{ float: 'left', cursor: 'pointer' }}>התנתק</button>
                <form onSubmit={createTodo}>
                    <input className="new-todo" placeholder="Well, let's take on the day" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                </form>
            </header>
            <section className="main" style={{ display: "block" }}>
                <ul className="todo-list">
                    {todos.map(todo => (
                        <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                            <div className="view">
                                <input className="toggle" type="checkbox" checked={todo.isComplete || false} onChange={(e) => updateCompleted(todo, e.target.checked)} />
                                <label>{todo.name}</label>
                                <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}

export default App;