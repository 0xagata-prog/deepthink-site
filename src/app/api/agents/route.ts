import { NextRequest, NextResponse } from "next/server";
import { getAgents, upsertAgent, getSwipes, Agent } from "@/lib/db";

export async function GET(req: NextRequest) {
  const swiperId = req.nextUrl.searchParams.get("swiper_id") || "";
  let agents = getAgents();

  if (swiperId) {
    const swipes = getSwipes();
    const swipedIds = new Set(swipes.filter((s) => s.swiper_id === swiperId).map((s) => s.swiped_id));
    agents = agents.filter((a) => a.id !== swiperId && !swipedIds.has(a.id));
  }

  // Shuffle
  agents.sort(() => Math.random() - 0.5);
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, name, bio } = body;

  if (!id || !name || !bio) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const agent: Agent = {
    id,
    name,
    avatar: body.avatar || "🤖",
    bio,
    personality: body.personality || "",
    interests: body.interests || [],
    looking_for: body.looking_for || "",
    created_at: new Date().toISOString(),
  };

  upsertAgent(agent);
  return NextResponse.json({ ok: true, id });
}
