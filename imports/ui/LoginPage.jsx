import React from 'react';

export const LoginPage = () => {
    const api_key = '6df9d08b-58ee-49c4-abf3-57941fb2b991';

    return (
        <div className='flex flex-col items-center justify-center h-screen '>
            <h1 className='text-lg font-semibold mb-4'>Click the button to login</h1>
            <a
                href={`https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${api_key}&redirect_uri=http://localhost:3000/`}
                className='bg-indigo-600 rounded p-2 font-semibold text-white'
            >
                Upstox Login
            </a>
        </div>
    );
};

