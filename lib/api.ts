import { TagRecord } from "@/types/tag";

export interface UploadedFile {
    id: number;
    fileName: string;
    objectKey: string;
    publicUrl: string;
}

async function request(
    url: string,
    options: RequestInit,
    fallbackMessage = "Anfrage fehlgeschlagen."
): Promise<Response> {

    const res = await fetch(url, options);

    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error ?? fallbackMessage);
    }

    return res;
}

function jsonRequest(
    url: string,
    method: string,
    body: unknown,
    fallbackMessage?: string
): Promise<Response> {

    return request(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }, fallbackMessage);
}

export async function assignTag(uploadId: number, tagId: number): Promise<void> {
    await jsonRequest(
        `/api/uploads/${uploadId}/tags`,
        "POST",
        { tagId },
        "Tag konnte nicht zugewiesen werden."
    );
}

export async function unassignTag(uploadId: number, tagId: number): Promise<void> {
    await jsonRequest(
        `/api/uploads/${uploadId}/tags`,
        "DELETE",
        { tagId },
        "Tag konnte nicht entfernt werden."
    );
}

export async function createTag(name: string): Promise<TagRecord> {
    const res = await jsonRequest(
        "/api/tags",
        "POST",
        { name },
        "Tag konnte nicht erstellt werden."
    );
    return res.json();
}

export async function deleteUpload(id: number): Promise<void> {
    await request(
        `/api/upload/${id}`,
        { method: "DELETE" },
        "Datei konnte nicht gelöscht werden."
    );
}

export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {

    const form = new FormData();

    for (const file of files) {
        form.append("files", file);
    }

    const res = await request(
        "/api/upload",
        { method: "POST", body: form },
        "Upload fehlgeschlagen."
    );

    return res.json();
}
