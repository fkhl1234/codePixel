import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import PersonIcon from '@mui/icons-material/Person';

import './Test.css'

export default function Test ({children}) {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/test");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                
                const data = await res.json();
                setMsg(data.message);
            } catch(error) {
                console.error(error);
                setMsg('Error 발생');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <header className="layout-header">
                <div className="layout-logo">
                    codePixel
                </div>
                <IconButton component={Link} to='/myPage'>
                    <PersonIcon
                        sx={{
                            scale: 2,
                            color: 'white',
                            alignSelf: 'center',
                            '&:hover': {
                                scale: 2.4,
                            }
                        }} />
                </IconButton>
            </header>
            <nav>
            </nav>
            <main>
                <h1>백엔드 응답 : {msg}</h1>
                {children}
            </main>
        </div>
    )
};