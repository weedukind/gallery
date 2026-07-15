import { NextResponse } from "next/server";
import { getTags, createTag } from "@/services/tagService";

export async function GET() {

    const tags = await getTags();

    return NextResponse.json(tags);
}

export async function POST(request: Request) {

    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
        return NextResponse.json(
            { error: "Name ist erforderlich." },
            { status: 400 }
        );
    }

    try {

        const tag = await createTag(name);

        return NextResponse.json(tag);

    } catch (err) {

        if (err instanceof Error && "code" in err && err.code === "ER_DUP_ENTRY") {
            return NextResponse.json(
                { error: "Ein Tag mit diesem Namen existiert bereits." },
                { status: 409 }
            );
        }

        throw err;
    }
}