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
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Função assíncrona para buscar documentos
const fetchDocuments = async (userId: string, token: string) => {
    try {
        const response = await fetch(
            `${apiBaseUrl}/documents/user-documents?userId=${userId}`,
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
        setSnackbarMessage(error.message || "Error fetching documents");
        setOpenSnackbar(true);
    }
    setLoading(false);
};

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      setToken(token);
      const { isValid, payload } = isTokenValid(token);

      if (!isValid) {
        router.push('/auth/login');
        localStorage.removeItem("auth_token");
        return;
      }

      setUsername(payload.username);
      setUserId(payload.userId);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (userId && token) {
      fetchDocuments(userId, token);
    }
  }, [userId, token]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        setSnackbarMessage('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId!);

    try {
      const response = await fetch(`${apiBaseUrl}/documents/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseJson = await response.json();

      if (response.ok) {
        handleUploadSuccess(); // Calls the callback function on success
      } else {
        setSnackbarMessage(responseJson.error);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Error uploading document:');
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

// After uploading a document, update the document list
  const handleUploadSuccess = () => {
    if (userId && token) {
      fetchDocuments(userId, token);
    }
  };

// Redirect to the document page
  const handleDocumentClick = (documentFilename: string) => {
    router.push(`/user-documents/${documentFilename}`);
  };

  if(loading){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] text-center">
        <CircularProgress className="loading" style={{ display: "block" }} />
        <p>Loading documents...</p>
      </div>
    );
  }

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
