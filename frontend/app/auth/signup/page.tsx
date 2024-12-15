"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Stack, TextField, Button, Snackbar, Link } from "@mui/material";
import { apiBaseUrl } from "@config";
import NextLink from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const router = useRouter();
    
    // Block access if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          router.push('/');
        }
      }, [router]);
    
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !name || !password) {
            setSnackbarMessage("All fields are required");
            setOpenSnackbar(true);
            return;
        }
        const response = await fetch(`${apiBaseUrl}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, name, password }),
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            setSnackbarMessage("Signup successful");
            setOpenSnackbar(true);

            // Redirecionar ou realizar outras ações após o signup bem-sucedido
        } else {
            setSnackbarMessage("Signup failed, please try again");
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
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button variant="contained" type="submit" className="button">
                        Sign Up
                    </Button>
                    <Link component={NextLink} href="/auth/login" className="link self-center">
                        Login
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