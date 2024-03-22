import React, { useState } from 'react';
import Home from './Home'; // Importe o componente Home

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar o login

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Após o login, atualize o estado para mostrar a página Home
    setIsLoggedIn(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {isLoggedIn ? (
        <Home />
      ) : (
        <div style={{ width: '300px', padding: '20px', borderRadius: '5px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: 'calc(100% - 16px)', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
