import { ResultSetHeader } from "mysql2";
import db from "@/lib/db";
import { TagRecord } from "@/types/tag";

export async function getTags(): Promise<TagRecord[]> {

    const [rows] = await db.query(
        `SELECT
            id,
            name,
            color
         FROM tags
         ORDER BY name`
    );

    return rows as TagRecord[];
}

export async function getTagByName(name: string): Promise<TagRecord | null> {

    const [rows] = await db.query(
        `SELECT
            id,
            name,
            color
         FROM tags
         WHERE name = ?`,
        [name]
    );

    const tags = rows as TagRecord[];

    return tags.length > 0 ? tags[0] : null;
}

export async function createTag(
    name: string,
    color = "#3b82f6"
): Promise<TagRecord> {

    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO tags (name, color)
         VALUES (?, ?)`,
        [name, color]
    );

    return {
        id: result.insertId,
        name,
        color
    };
}

export async function getTagsForUploads(): Promise<Map<number, TagRecord[]>> {

    const [rows] = await db.query(
        `SELECT
            ut.upload_id,
            t.id,
            t.name,
            t.color
         FROM upload_tags ut
         JOIN tags t
           ON t.id = ut.tag_id
         ORDER BY t.name`
    );

    const map = new Map<number, TagRecord[]>();

    for (const row of rows as any[]) {

        if (!map.has(row.upload_id)) {
            map.set(row.upload_id, []);
        }

        map.get(row.upload_id)!.push({
            id: row.id,
            name: row.name,
            color: row.color
        });
    }

    return map;
}

export async function assignTag(
    uploadId: number,
    tagId: number
): Promise<void> {

    await db.execute(
        `INSERT IGNORE INTO upload_tags
            (upload_id, tag_id)
         VALUES (?, ?)`,
        [uploadId, tagId]
    );
}

export async function removeTag(
    uploadId: number,
    tagId: number
): Promise<void> {

    await db.execute(
        `DELETE FROM upload_tags
         WHERE upload_id = ?
           AND tag_id = ?`,
        [uploadId, tagId]
    );
}