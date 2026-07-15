import {TagRecord} from "@/types/tag";

export interface UploadRecord {
    id?: number;
    name: string;
    objectKey: string;
    publicUrl: string;
    mimeType: string;
    size: number;
    created_at?: Date;
    createdAtFormatted?: string;
    tags?: TagRecord[];
}