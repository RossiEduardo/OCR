"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "@config";
import { isTokenValid } from "@/auth";
import { CircularProgress, Snackbar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface Document {
  id: string;
  filename: string;
  filepathDownload: string;
}

export default function UserDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Função assíncrona para buscar documentos
  const fetchDocuments = async (username: string, token: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/documents/user-documents?username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseJson = await response.json();
      setDocuments(responseJson.data);
    } catch (error: any) {
      console.error("Erro ao buscar documentos:", error.message);
      localStorage.removeItem("auth_token"); // Remover token inválido
      setSnackbarMessage(error.message || "Erro ao buscar documentos");
      setOpenSnackbar(true);
      router.push("/auth/login");
    }
    setLoading(false);
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

      setUsername(payload.username);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (username && token) {
      fetchDocuments(username, token);
    }
  }, [username, token]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, envie um arquivo PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username!); // Como `username` já foi validado, podemos garantir que ele existe
    console.log(formData);

    try {
      const response = await fetch(`${apiBaseUrl}/documents/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseJson = await response.json();
      console.log(responseJson);

      if (response.ok) {
        handleUploadSuccess(); // Chama a função de callback quando eh sucesso
      } else {
        setSnackbarMessage(responseJson.error);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setSnackbarMessage('Erro ao enviar o documento.');
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  // Após o upload de um documento, atualiza a lista de documentos
  const handleUploadSuccess = () => {
    if (username && token) {
      fetchDocuments(username, token); // Atualiza os documentos após o upload
    }
  };

  // Redirecionar para a página do documento
  const handleDocumentClick = (documentFilename: string) => {
    router.push(`/user-documents/${documentFilename}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] text-center">
      <h1 className="title">{username} Documents</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />

      {documents.length === 0 ? (
        <p>You haven't uploaded any documents yet.</p>
      ) : (
        <div className="documents-container">
          {loading ? (
            <div className="loading-container flex flex-col items-center justify-center">
              <CircularProgress className="loading" style={{ display: "block" }} />
              <p>Loading documents...</p>
            </div>
          ) : (
            <ul>
              {documents.map((document, index) => (
                <li key={index}>
                  <span 
                    onClick={() => handleDocumentClick(document.filename)}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    {document.filename}
                  </span>{" "}
                  <a href={document.filepathDownload} download>
                    Download <DownloadIcon />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
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
