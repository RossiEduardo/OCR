export class LLMComentsDto {
    filename?: string;
    document_id: string;
    text: string;
    created_at?: Date;
}

export class LLMChatDto{
    filename: string;
    question: string;
}