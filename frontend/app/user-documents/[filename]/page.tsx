// app/documents/[filename]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiBaseUrl } from "@config";
import { CircularProgress, Snackbar } from "@mui/material";
import { isTokenValid } from "@/auth";

interface DocumentDetails {
    id: string;
    filename: string;
    filepathDownload: string;
    content: string;
    uploadDate: string;
}

interface DocumentComments {
    id: string;
    comments: string;
}

export default function DocumentDetailsPage() {
    const [document, setDocument] = useState<DocumentDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const { filename } = params;
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");  

    const fetchDocumentDetails = async (filename: any) => {
        try {
            debugger;
            const token = localStorage.getItem("auth_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            // Busca detalhes do documento a partir do nome do arquivo
            const response = await fetch(`${apiBaseUrl}/documents/get?filename=${filename}`, {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar detalhes do documento.");
            }

            const responseJson = await response.json();
            debugger;
            setDocument(responseJson.data);
            } catch (err: any) {
                
            } finally {
            setLoading(false);
            }
    };

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            setToken(token);
            const { isValid, payload } = isTokenValid(token);

            if (!isValid) {
                console.log('Token inválido!');
                router.push('/auth/login');
                return;
            }
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    useEffect(() => {
        if (filename) {
            fetchDocumentDetails(filename);
        }
    }, [filename]);

    if (loading) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <CircularProgress />
            <p>Loading document details...</p>
        </div>
        );
    }

    if (!document) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Documento não encontrado.</p>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center">
                <h1 className="title">{document.filename}</h1>
                    <button className="btn-chat link">Fale com nossa IA sobre o conteudo extraido</button>
            </div>    
            <h3 className="topic">Conteudo Extraido</h3>
            <p>{document.content || "Sem descrição"}</p>
            <a href={document.filepathDownload} download>
                <button className="btn-download link">Download</button>
            </a>
            <Snackbar
                open={openSnackbar}
                message={snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    left: "unset",
                }}
            />
        </div>
    );
}
