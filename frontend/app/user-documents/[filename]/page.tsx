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
    text: string;
}

interface ChatMessages {
    role: string;
    content: string;
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
    const [userMessage, setUserMessage] = useState("");
    const [chatResponse, setChatResponse] = useState<string[]>([]);	// AI
    const [chatMessages, setChatMessages] = useState<ChatMessages[]>([]); // User e AI
    const [loadingSendMessage, setLoadingSendMessage] = useState<boolean>(false);
    const [openHistory, setOpenHistory] = useState(false);
    const [allComments, setAllComments] = useState<DocumentComments[]>([]);

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
        const updatedMessages = [...chatMessages, {role: "user", content: userMessage}];
        // atualiza o chat com a mensagem do usuário
        setChatMessages(updatedMessages);
        setUserMessage("");

        const response = await fetch(`${apiBaseUrl}/llm/chat`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                document_id: document?.id,
                question: userMessage
            })
        });

        if (!response.ok) {
            setSnackbarMessage("Erro ao enviar mensagem.");
            setOpenSnackbar(true);
        }

        // atualiza o chat com a resposta da AI
        const responseJson = await response.json();
        setChatMessages([...updatedMessages, responseJson]);
    }

    const getChatHistory = async () => {
        setOpenHistory(true);
        const response = await fetch(`${apiBaseUrl}/llm/get-chat-history?documentId=${document?.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            setSnackbarMessage("Erro ao enviar mensagem.");
            setOpenSnackbar(true);
        }

        const responseJson = await response.json();
        setAllComments(responseJson.data);
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

    if (openHistory) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-10 container mx-auto">
                <h3 className="topic">Chat History of {document.filename}</h3>
                <div className="flex flex-col gap-3 h-[75%] overflow-scroll w-full scrollbar-hide">
                    {allComments.map((comments, index) => (
                        <div key={index} className="w-full">
                            <div className="chat-bubble">
                                <p>{comments.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (openChat) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-10 container mx-auto">
                <h3 className="topic">Chat with AI about {document.filename}</h3>
                <div className="flex flex-col gap-3 h-[75%] overflow-auto w-full">
                    {chatMessages.map((message, index) => (
                        <div key={index} className={message.role === "user" ? "chat chat-end" : "chat chat-start"}>
                            <div className={message.role === "user" ? "chat-bubble bg-blue-500" : "chat-bubble bg-gray-700"}>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 w-[60%]">
                    <input
                        className="input w-full m-10 border border-gray-400 p-2"
                        type="text"
                        placeholder="Type your userMessage here"
                        value={userMessage}
                        onChange={(event) => setUserMessage(event.target.value)}
                        onKeyDown={async (event) => {
                            if (event.key === "Enter") {
                                setLoadingSendMessage(true);
                                await handleMessage();
                                setLoadingSendMessage(false);
                            }
                        }}
                    />
                    {loadingSendMessage && <CircularProgress />}
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
        {
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="title">{document.filename}</h1>
                            <div>
                                <button className="btn-chat link" onClick={() => setOpenChat(true)}>Talk with AI about the text</button>
                                <button className="btn-chat link" onClick={() => getChatHistory()}>Chat History</button>
                                
                            </div>
                        </div>
                        <h3 className="topic">Extracted Content</h3>
                        <p>{document.content || "Sem descrição"}</p>
                        <a href={document.filepathDownload} download>
                            <button className="btn-download link">Download</button>
                        </a>
                    </div>
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
