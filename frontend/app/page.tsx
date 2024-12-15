import { Button } from "@mui/material";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] text-center">
			<h1 className="text-4xl font-bold mb-4">Bem-vindo ao Paggo OCR</h1>
			<p className="text-lg max-w-2xl mb-6">
				O Paggo OCR é uma ferramenta poderosa que utiliza tecnologia de reconhecimento óptico de caracteres (OCR) para extrair e processar texto de imagens e documentos. Nossa solução é ideal para automatizar tarefas de entrada de dados, digitalização de documentos e muito mais.
			</p>
			<Button className="button" variant="contained" href="/auth/login">
				Get Started
			</Button>
		</div>
	);
}
