import React from "react";
import { Link } from "react-router-dom";
import { withTheme } from "@emotion/react";

import IconButton from "@mui/material/IconButton";
import PersonIcon from '@mui/icons-material/Person';

import './Test.css'

export default function Test ({children}) {
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
                {children}
            </main>
        </div>
    )
};