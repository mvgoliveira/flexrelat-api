export interface ChangeContent {
    id: string;
    html: string;
}

export class Change {
    id?: string;
    message_id?: string;
    status: "pending" | "approved" | "rejected";
    type: "create" | "update" | "delete";
    text: string;
    old_content: ChangeContent;
    new_content: ChangeContent;
}
