"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Stack, TextField, Button, Link, Snackbar } from "@mui/material";
import NextLink from "next/link";
import { apiBaseUrl } from "@config";
import { isTokenValid } from "@auth";
import React from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const router = useRouter();
    const [token, setToken] = useState("");
      
    useEffect(() => {
        const token = localStorage.getItem("auth_token");

        if (token) {
            setToken(token);
            const { isValid, payload } = isTokenValid(token);

            if (isValid) {
                router.push('/user-documents/all');
            }
        }
    }, [router]);
    
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !password) {
            setSnackbarMessage("Username and password are required");
            setOpenSnackbar(true);
            return;
        }
        const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setSnackbarMessage("Login successful");
            setOpenSnackbar(true);
            localStorage.setItem("auth_token", data.access_token);
            router.push('/user-documents/all');
        } else {
            setSnackbarMessage("Login failed, verify your credentials");
            setOpenSnackbar(true);
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button variant="contained" type="submit" className="button">
                        LOGIN
                    </Button>
                    <Link component={NextLink} href="/auth/signup" className="link self-center">
                        Signup
                    </Link>
                </Stack>
            </form>
            <Snackbar
                open={openSnackbar}
                message={snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    left: 'unset',
                }}
            />
        </React.Fragment>
    );
}