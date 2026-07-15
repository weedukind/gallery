"use client";

import { useRouter } from "next/navigation";

interface Props {
    id: number;
}

export default function DeleteButton({ id }: Props) {

    const router = useRouter();

    async function remove() {

        if (!confirm("Datei wirklich löschen?"))
            return;

        const res = await fetch(`/api/upload/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            alert("Löschen fehlgeschlagen.");
            return;
        }

        router.refresh();
    }

    return (
        <button
            onClick={remove}
            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
            Löschen
        </button>
    );
}