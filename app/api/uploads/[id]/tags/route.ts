import { NextResponse } from "next/server";

import {
    assignTag,
    removeTag
} from "@/services/tagService";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    const body = await request.json();

    await assignTag(
        Number(id),
        body.tagId
    );

    return NextResponse.json({
        success: true
    });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    const body = await request.json();

    await removeTag(
        Number(id),
        body.tagId
    );

    return NextResponse.json({
        success: true
    });
}