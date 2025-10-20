import { RelatedTypes } from "../model/messages";

export class Message {
    id: string;
    senderId: string;
    relatedId: string;
    relatedType: RelatedTypes;
    text: string;
    createdAt: Date;
}
