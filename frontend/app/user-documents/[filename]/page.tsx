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
    const [documentFilename, setDocumentFilename] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openChat, setOpenChat] = useState(false);
    const [message, setMessage] = useState("");
    const [chatResponse, setChatResponse] = useState<string[]>([]);	
    const [loadingSendMessage, setLoadingSendMessage] = useState<boolean>(false);

    const fetchDocumentDetails = async (filename: any) => {
        const docName = decodeURIComponent(filename);
        try {
            const token = localStorage.getItem("auth_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            // Busca detalhes do documento a partir do nome do arquivo
            const response = await fetch(`${apiBaseUrl}/documents/get?filename=${docName}`, {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setSnackbarMessage("Erro ao buscar detalhes do documento.");
                setOpenSnackbar(true);
            }

            const responseJson = await response.json();
            setDocument(responseJson.data);
            debugger;
            } catch (err: any) {
                setSnackbarMessage("Erro ao buscar detalhes do documento.");
                setOpenSnackbar(true);
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

    const handleMessage = async () => {
        const updatedMessages = [...chatResponse];
        const response = await fetch(`${apiBaseUrl}/llm/chat`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                document_id: document?.id,
                question: message
            })
        });

        if (!response.ok) {
            setSnackbarMessage("Erro ao enviar mensagem.");
            setOpenSnackbar(true);
        }

        const responseJson = await response.json();
        console.log(responseJson.chatResponse);
        updatedMessages.push(responseJson.chatResponse);
        setChatResponse(updatedMessages);
        setMessage("");
    }

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
        <React.Fragment>
        {
                openChat ? (
                    <div className="h-screen flex flex-col items-center justify-center gap-10 container mx-auto">
                        <div className="flex flex-col gap-3 h-[75%] overflow-scroll w-full">
                            {chatResponse.map((response, index) => (
                                <div key={index} className="chat chat-response">
                                    <div className="chat-bubble">
                                        <p>{response}</p> 
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 w-[60%]">
                            <input
                                className="input w-full m-10 border border-gray-300 p-2"
                                type="text"
                                placeholder="Type your message here"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                onKeyDown={async (event) => {
                                    if(event.key === "Enter") {
                                        setLoadingSendMessage(true);
                                        await handleMessage();
                                        setLoadingSendMessage(false);
                                    }
                                }}
                            />
                            {loadingSendMessage && <CircularProgress/>}
                        </div>
                    </div>
                        ) : 
                        (   
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="title">{document.filename}</h1>
                                <button className="btn-chat link" onClick={() => setOpenChat(true)}>Fale com nossa IA sobre o conteudo extraido</button>
                        </div>
                        <h3 className="topic">Conteudo Extraido</h3>
                        <p>{document.content || "Sem descrição"}</p>
                        <a href={document.filepathDownload} download>
                            <button className="btn-download link">Download</button>
                        </a>
                    </div>
                )
            }
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
        </React.Fragment>
    );
}
