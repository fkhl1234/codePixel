import React, { useState } from "react";
import { Link } from "react-router-dom";

import './Main.css';

export default function Main() {
    return (
    <div className="main">
      {/* User Console */}
      <div className="user-console">
        <div className="console rectangle" >
          <p className="text text-1">codePixel</p>
          <div className="console-line" />
          <div className="monitor-container">
            <div className="monitor rectangle" />
            <p className="text text-2">UserName</p>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div className="group challenge">
        <div className="rectangle challenge-box" />
        <p className="text text-3">challenge</p>
      </div>

      {/* Casual */}
      <div className="group casual">
        <div className="rectangle casual-box" />
        <p className="text text-4">casual</p>
      </div>

      {/* Setting */}
      <div className="group setting">
        <div className="rectangle setting-box" />
        <p className="text text-5">Setting</p>
      </div>
    </div>
  );
}
