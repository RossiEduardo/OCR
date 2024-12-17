export class LLMComentsDto {
    filename?: string;
    document_id: string;
    text: string;
    created_at?: Date;
}

export class LLMChatDto{
    document_id: string;
    question: string;
}