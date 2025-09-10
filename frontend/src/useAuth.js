import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const location = useLocation();

    useEffect(() => {
        fetch('/api/session-check', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setIsLoggedIn(data.loggedIn);
                setUserId(data.userId || "");
            });
    }, [location.pathname]);

    const logout = async () => {
        const res = await fetch('/api/logout', {
            method: "POST",
            credentials: 'include',
        })

        const data = await res.json();
        if(data.success) {
            setIsLoggedIn(false);
            setUserId('');
        }
    };

    return {isLoggedIn, setIsLoggedIn, userId, setUserId, logout};
}