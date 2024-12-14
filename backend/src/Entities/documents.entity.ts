import { UserEntity } from './user.entity';

export class DocumentsEntity {
    id: string;
    filename: string;
    filepath: string;
    user: UserEntity;
    user_id: string;
    content: string;
}  