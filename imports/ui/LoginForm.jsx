import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage } from './LoginPage';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = e => {
        e.preventDefault();
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        setLoading(true);
        Meteor.loginWithPassword(username, password, (err) => {
            setLoading(false);
            if (err) {
                setError('Login failed. Please check your username and password.');
            } else {
                setError('');
                navigate('/loginpage');
            }
        });
    };

    const handleForgotPassword = () => {
        alert('Forgot Password functionality is not yet implemented.');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-indigo-100">
            <form 
                onSubmit={submit} 
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
            >
                <h2 className="text-center text-2xl font-semibold text-indigo-700 mb-4">Downstox</h2>
                {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                <div className="mb-4">
                    <label 
                        className="block text-indigo-700 text-sm font-bold mb-2" 
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <label 
                            className="block text-indigo-700 text-sm font-bold mb-2" 
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <button 
                            type="button" 
                            className="text-indigo-700 text-sm hover:underline"
                            onClick={handleForgotPassword}
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="mt-4 text-center">
                    <button 
                        type="button" 
                        className="text-indigo-700 hover:underline"
                        onClick={handleSignUp}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};





