import React, { useState } from "react";
import { Link } from "react-router-dom";

import './Main.css';

export default function Main() {
    return (
    <div className="main">
      {/* User Console */}
      <Link to='/casual' className="main-userConsole main-rectangle">
        <p className="main-text main-title">codePixel</p>
        <div className="main-consoleLine" />
        <div className="main-monitorContainer main-rectangle no-hover">
          <p className="main-text main-userName">UserName</p>
        </div>
      </Link>

      {/* Challenge */}
      <button className="main-challenge main-rectangle">
        <p className="main-text main-menu">challenge</p>
      </button>

      {/* Casual */}
      <button className="main-casual main-rectangle">
        <p className="main-text main-menu">casual</p>
      </button>

      {/* Setting */}
      <button className="main-setting main-rectangle">
        <p className="main-text main-menu">Setting</p>
      </button>
    </div>
  );
}
