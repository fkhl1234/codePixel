import React, { useState } from "react";
import { Link } from "react-router-dom";

import './Home.css';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

// Login Dialog 창
function LoginDialog({ open, handleClose, handleLogin, setForm, handleRegister }) {
    // form key:value 변경 (함수형 업데이트)
    const changeForm = (key) => (e) => {
        setForm(prevForm => ({
            ...prevForm,
            [key]: e.target.value
        }));
    }

    return (
        <Dialog 
            open={open}  
            onClose={handleClose}
            PaperProps={{
                sx: { width: 500 }
            }}
        >
            <DialogTitle sx={{ position: 'relative', fontSize: '30px' }}>
                Login
                <CloseIcon
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        cursor: 'pointer',
                        '&:hover': {
                            scale: 1.2,
                            backgroundColor: 'lightgray',
                        }
                    }}
                />
            </DialogTitle>

            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pt: 2,
                px: 2,
            }}>
                <TextField 
                    id='userId' 
                    label='ID' 
                    variant="outlined" 
                    onChange={changeForm('userId')} 
                />
                <TextField 
                    id='userPw' 
                    label='PW' 
                    variant="outlined" 
                    type="password"
                    onChange={changeForm('userPw')}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin();
                        }
                    }}
                />
                <Button 
                    variant="contained"
                    onClick={handleLogin}
                    sx={{ fontSize: '20px' }}
                >
                    Login
                </Button>
                <Button 
                    variant="outlined"
                    onClick={handleRegister}
                    sx={{ width: 'fit-content', alignSelf: 'flex-end', fontSize: 17 }}
                >
                    Register
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default function Home() {
    const [open, setOpen] = useState(false);                 // Dialog 상태
    const [loginForm, setLoginForm] = useState({            // 로그인 form
        userId: "", 
        userPw: ""
    });

    // Dialog 열기/닫기
    const handleClickOpen = () => setOpen(true);
    const handleClickClose = () => setOpen(false);

    // 로그인 요청
    const handleLogin = async () => {
        try {
            const res = await fetch('/api/login', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginForm)
            });
            const data = await res.json();

            if(data.authenticated) {
                console.log(data.message);
                window.location.href = '/menu';       // 다음 페이지 이동
            } else {
                alert(data.message);                 // 실패 시 alert
            }
        } catch(err) {
            console.error(err);
            alert("서버 오류가 발생했습니다.");
        }
    }

    const handleRegister = async() => {
        try {
            // 요청 보내기
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginForm)
            });
            const data = await res.json();

            if(data.authenticated) {
                alert(`${data.userId} 회원 가입이 완료되었습니다.`);
            } else {
                alert(`회원가입 실패 : ${data.message}`);
            }
        } catch(err) {
            console.error(err);
            alert('서버 오류가 발상했습니다.');
        }
    }

    return (
        <div className="Home">
            <header>
                <div className="home-logo">
                    <h1>codePixel</h1>
                </div>
            </header>
            <main>
                <div className="buttonZone">
                    <Button 
                        variant='contained' 
                        className="Buttons" 
                        sx={{ fontSize: '30px', fontWeight: 'bold' }}
                        onClick={handleClickOpen}
                    >
                        Login
                    </Button>

                    <LoginDialog
                        open={open}
                        handleClose={handleClickClose}
                        handleLogin={handleLogin}
                        form={loginForm}
                        setForm={setLoginForm}
                        handleRegister={handleRegister}
                    />

                    <Button 
                        variant='contained'
                        component={Link} 
                        to='/help' 
                        className="Buttons" 
                        sx={{ fontSize: '30px', fontWeight: 'bold' }}
                    >
                        Help
                    </Button>
                </div>
            </main>
        </div>
    )
}
