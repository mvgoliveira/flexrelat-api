import { RelatedTypes } from "../model/messages";
import { Change } from "../../changes/entities/change.entity";

export class Message {
    id: string;
    text: string;
    sender_id: string;
    related_id: string;
    related_type: RelatedTypes;
    created_at: Date;
    changes: Change[];
}
