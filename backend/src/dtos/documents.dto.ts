export class DocumentsDto {
    filename: string;
    filepath: string;
    user_id: string;
    content: string;

    constructor(doc: DocumentsDto) {
        this.filename = doc.filename;
        this.filepath = doc.filepath;
    }
}