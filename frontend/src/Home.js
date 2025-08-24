import React from "react";
import {Link } from "react-router-dom";

import './Home.css';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';

import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

// interface SimpleDialogProps {
//     open: Boolean;
//     onClose: ()=> void;
// };

// function LoginDialog(props: SimpleDialogProps) {
function LoginDialog(props) {
    const { open, onClose, form, setForm } = props;
    const changeForm = (key) => (e) => {
        setForm({
            ...form,
            [key]: e.target.value
        })
    }

    const handleClose = () => {
        onClose();
    }
    
    return(
        <Dialog 
            onClose={handleClose}
            open={open}
            PaperProps={{
                sx: {
                    width: 500,
                }
            }}>
            <DialogTitle 
                sx={{
                    position: 'relative',
                    fontSize: '30px',
                }} >
                Login
                <CloseIcon
                    variant="outlined" 
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      right: 16,  
                      '&:hover': {
                            scale: 1.2,
                            backgroundColor: 'lightgray',
                        }
                    }} />

            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '16px !important',
                paddingRight: 2,
                paddingLeft: 2,
                position: "relative",
                gap: 2,
            }}>
                <TextField id='userId' label='ID' variant="outlined" onChange={changeForm('userId')}/>
                <TextField id='userPw' label='PW' variant="outlined" onChange={changeForm('userPw')}
                    onKeyDown={(e)=> {
                        if(e.key === 'Enter') {
                            e.preventDefault();  // 기본 동작 막기
                            handleClose();
                        }
                    }}/>
                <Button 
                    variant="contained"
                    onClick={handleClose}
                    sx={{
                        fontSize: '20px'
                    }}>
                        Login
                </Button>

                <Button variant="outlined"
                    component={Link}
                    to='/menu'
                    sx={{
                        width: 'fit-content',
                        alignSelf: 'flex-end',
                        fontSize: 17,
                    }}>
                    Guest
                </Button>
            </DialogContent>

        </Dialog>
    )
}

export default function Home() {
    const [open, setOpen] = React.useState(false);
    const [loginForm, setloginForm] = useState({userId: "", userPw: ""});
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickClose = () => {
        setOpen(false);

        const handleSubmit = async() => {
            try {
                const res = await fetch('http://localhost:4000/api/login', {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(loginForm)
                });

                const data = await res.json();
                console.log(data.message);
            } catch(err) {
                console.error(err);
            }
        };

        handleSubmit();
    }



    return(
        <div className="Home">
            <header>
                <div className="home-logo">
                    <h1>codePixel</h1>
                </div>
            </header>
            <main>
                <div className="buttonZone">
                    <Button variant='contained' className="Buttons" sx={{fontSize: '30px', fontWeight: 'bold'}} onClick={handleClickOpen}>
                        <span>Login</span>
                    </Button>
                    <LoginDialog
                        open={open}
                        onClose={handleClickClose}
                        form={loginForm}
                        setForm={setloginForm} />
                    <Button variant='contained'component={Link} to='/help' className="Buttons" sx={{fontSize: '30px', fontWeight: 'bold'}}>
                        <span>Help</span>
                    </Button>
                </div>
            </main>
        </div>
    );
}