import React, { useState } from 'react';
import {useAuth } from './useAuth';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import './Login.css';

export default function Login() {
    const { setIsLoggedIn, setUserId } = useAuth(); // 훅 호출

    // 로그인 입력 폼
    const [loginForm, setLoginForm] = useState({
        userId: "",
        userPw: "",
    });
    
    // 로그인 폼 변경 시 반영
    const changeLoginForm = (key) => e => {
        setLoginForm(prev => ({
            ...prev,
            [key]: e.target.value
        }))
    };

    // 실제 로그인 요청
    const handleLogin = async () => {
        try {
            const res = await fetch('/api/login', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', // 쿠키 사용
                body: JSON.stringify(loginForm)
            });
            const data = await res.json();

            if(data.authenticated) {
                console.log(data.message);
                setIsLoggedIn(true);
                setUserId(loginForm.userId);
                window.location.href = '/main';       // 다음 페이지 이동
            } else {
                alert(data.message);                 // 실패 시 alert
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="Login">
            <div className='Login-backRectangle' />
                <p className='Login-title'>codePixel</p>
                <div className='Login-loginRectangle'>
                    <p>Login</p>
                    <div className='Login-inputField'>
                        <TextField variant='outlined' size='small' id='userID' label="Username" 
                            onChange={changeLoginForm('userId')}/>
                        <TextField variant='outlined' size='small' id='userPw' label="Password" type='password' 
                            onChange={changeLoginForm('userPw')}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') {
                                    e.preventDefault();
                                    handleLogin();
                                }
                            }} />
                        <div className='Login-clickOption'>
                            <p className='Login-forgetPassword'>Forget Password?</p>
                        </div>
                        <Button variant='contained' disableElevation
                            sx={{
                                backgroundColor: '#006AFF',
                                fontFamily: "'Lato', 'Noto Sans KR', sans-serif",
                                fontWeight: '700',
                            }}
                            onClick={handleLogin}>
                                Sign in</Button>
                        <div className='Login-clickOption'>
                            <p className='Login-optionText'>Create an account?</p>
                            <p className='Login-optionText'>Guest</p>
                        </div>
                    </div>
                </div>
        </div>
    )
}