"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "@config";
import { isTokenValid } from "@/auth";
import { Snackbar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface Document {
  id: string;
  filename: string;
  filepathDownload: string;
  uploadDate: string;
}

export default function UserDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
      setDocuments(responseJson.data); // Atualiza a lista de documentos
    } catch (error: any) {
      console.error("Erro ao buscar documentos:", error.message);
      localStorage.removeItem("auth_token"); // Remover token inválido
      setSnackbarMessage(error.message || "Erro ao buscar documentos");
      setOpenSnackbar(true);
      router.push("/auth/login"); // Redirecionar para login
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] text-center">
      <h1>My Documents</h1>
      {documents.length === 0 ? (
        <p>You haven't uploaded any documents yet.</p>
      ) : (
        <div className="documents-container">
          <ul>
            {documents.map((document, index) => (
              <li key={index}>
                {document.filename} -{" "}
                <a href={document.filepathDownload} download>
                  Download <DownloadIcon />
                </a>
              </li>
            ))}
          </ul>
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
