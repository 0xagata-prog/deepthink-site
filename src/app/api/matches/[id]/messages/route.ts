import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessage, getAgent } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const matchId = parseInt(params.id);
  const messages = getMessages()
    .filter((m) => m.match_id === matchId)
    .map((m) => {
      const sender = getAgent(m.sender_id);
      return {
        ...m,
        sender_name: sender?.name || "Unknown",
        sender_avatar: sender?.avatar || "🤖",
      };
    });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const matchId = parseInt(params.id);
  const { sender_id, content } = await req.json();

  if (!sender_id || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const msg = addMessage(matchId, sender_id, content);
  return NextResponse.json({ ok: true, id: msg.id });
}
