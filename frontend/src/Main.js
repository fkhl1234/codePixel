import React, { useState } from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";

import { useAuth } from "./useAuth";
import './Main.css';

export default function Main() {
    const { userId } = useAuth(); // 세션에서 불러오기
    const [userName, setUserName] = useState('GUEST');

    return (
    <div className="main">
      {/* User Console */}
      <div className="main-userConsole main-rectangle">
        <p className="main-text main-title">codePixel</p>
        <div className="main-consoleLine" />
        <div className="main-monitorContainer main-rectangle no-hover">
          <p className="main-text main-userName">{userId || "GUEST"}</p>
        </div>
        { userId ? null :(
            <Button variant="contained" component={Link} to='/login' disableElevation>Login</Button>
          ) }
      </div>

      {/* Challenge */}
      <button className="main-challenge main-rectangle">
        <p className="main-text main-menu">challenge</p>
      </button>

      {/* Casual */}
      <Link to='/casual' className="main-casual main-rectangle">
        <p className="main-text main-menu">casual</p>
      </Link>

      {/* Setting */}
      <button className="main-setting main-rectangle">
        <p className="main-text main-menu">Setting</p>
      </button>
    </div>
  );
}
