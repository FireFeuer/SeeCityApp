import {useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    
    navigate('/login');
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Электронная почта" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterForm;