export class Document {
    id: string;
    userId?: string;
    name: string;
    isPublic: boolean;
    content?: string;
    publicCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UpdatedDocument {
    id: string;
    content: string;
    name: string;
    updatedAt: Date;
}
