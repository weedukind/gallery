import db from "@/lib/db";

export interface UploadRecord {
    id?: number;
    name: string;
    objectKey: string;
    publicUrl: string;
    mimeType: string;
    size: number;
    created_at?: Date;
}

export async function insertUpload(upload: UploadRecord): Promise<void> {

    await db.execute(
        `INSERT INTO uploads
            (name, object_key, public_url, mime_type, size)
         VALUES (?, ?, ?, ?, ?)`,
        [
            upload.name,
            upload.objectKey,
            upload.publicUrl,
            upload.mimeType,
            upload.size
        ]
    );
}

export async function getUploads(): Promise<UploadRecord[]> {

    const [rows] = await db.query(
        `SELECT
            id,
            name,
            object_key AS objectKey,
            public_url AS publicUrl,
            mime_type AS mimeType,
            size,
            created_at
         FROM uploads
         ORDER BY created_at DESC`
    );

    return rows as UploadRecord[];
}

export async function getUpload(id: number): Promise<UploadRecord | null> {

    const [rows] = await db.query(
        `SELECT
            id,
            name,
            object_key AS objectKey,
            public_url AS publicUrl,
            mime_type AS mimeType,
            size,
            created_at
         FROM uploads
         WHERE id = ?`,
        [id]
    );

    const uploads = rows as UploadRecord[];

    return uploads.length > 0 ? uploads[0] : null;
}

export async function deleteUpload(id: number): Promise<void> {

    await db.execute(
        `DELETE FROM uploads
         WHERE id = ?`,
        [id]
    );
}