export class DocumentsDto {
    filename: string;
    filepath: string;
    filepathDownload: string;
    user_id: string;
    content: string;

    constructor(doc: DocumentsDto) {
        this.filename = doc.filename;
        this.filepath = doc.filepath;
        this.filepathDownload = doc.filepathDownload;
    }
}