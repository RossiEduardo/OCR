# OCR

This project aims to design and implement a system using **Next.js** and **Nest.js** that enables users to upload documents, extract text using Optical Character Recognition (OCR), and interact with the extracted data through a Language Model (LLM) for contextual explanations.

 ### System Features:
- **PDF Upload:** Upload PDF files for analysis.
- **Content Extraction:** Automatically extract text from PDFs.
- **AI Interaction:** Chat with AI about the document's content.
- **Document Management:** View a list of all uploaded documents.
- **Response History:** Access a full history of AI responses.
- **Download:** Download processed files.

### Technologies required to run
- Node.js: v22.12.0
- Nest.jS: Backend framework for building modular and maintainable APIs.
- Next.js: Frontend framework for server-side rendering and React-based development.
- Docker: Containerization for running the PostgreSQL database.
- OpenAI LLM: Integration with OpenAI's Large Language Models for advanced AI interactions.

### Run
To run the application, you will need to use three terminal:

1. Backend
In the first terminal, navigate to the backend directory and run the following command:
```
OCR/backend$ npm run start:dev
```

2. Database
In the second terminal, navigate to the backend directory and run Docker to start the PostgreSQL database:
```
OCR/backend$ docker compose up
```

3. Frontend
In the third terminal, navigate to the frontend directory and run the following command:
```
OCR/frontend$ npm run dev
```



### Environment Variables
The application requires two .env files for configuration:

1. Backend .env
Place this file in the root directory of the **backend**.

```env
PORT=3001  
DATABASE_USERNAME=your_database_username  
DATABASE_PASSWORD=your_database_password  
DATABASE_NAME=your_database_name  
DATABASE_PORT=5432  
JWT_SECRET=your_jwt_secret  
OPENAI_API_KEY=your_openai_api_key  
UPLOAD_PATH=http://localhost:3001/uploads/  
FRONTEND_URL=http://localhost:3000  

# Prisma connection string  
DATABASE_URL="postgresql://your_database_username:your_database_password@localhost:5432/your_database_name"  
```

2. Frontend .env
Place this file in the root directory of the **frontend**.
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  
JWT_SECRET=your_jwt_secret  
```
Remember to replace placeholders like your_database_username, your_database_password, your_jwt_secret, and your_openai_api_key with actual secure values.

**OBS** Logout no implemented yet.
To log out it is necessary to delete cookies and site data
