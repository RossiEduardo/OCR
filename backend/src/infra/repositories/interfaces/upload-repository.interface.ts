export interface IUploadRepository {
    uploadFile(file: Express.Multer.File): Promise<string>;
}