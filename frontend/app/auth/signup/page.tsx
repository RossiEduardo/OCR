"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Stack, TextField, Button, Snackbar, Link } from "@mui/material";
import { isTokenValid } from "@auth";
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
    const [token, setToken] = useState("");
  
    // verifica o usuario logado
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
        });
		debugger;
        if (response.ok) {
            const data = await response.json();
            if (!data.success) {
                setSnackbarMessage(data.message || "please try again");
                setOpenSnackbar(true);
                return;
            }
            setSnackbarMessage("Signup successful");
            setOpenSnackbar(true);
			localStorage.setItem("auth_token", data.access_token);
			router.push('/user-documents/all');
        } else {
            const errorData = await response.json();
            console.error(errorData);
            setSnackbarMessage(`Signup failed: ${errorData.message || "please try again"}`);
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