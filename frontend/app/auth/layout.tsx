import { Box } from "@mui/material";

export default function AuthLayout({
    children
    }: {
        children: React.ReactNode;
    }) {
        return (
            <Box className="flex items-center justify-center h-screen">
                {children}
            </Box>
        );
    }