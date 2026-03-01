import { NextRequest, NextResponse } from "next/server";
import { getMatches, getAgent } from "@/lib/db";

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get("agent_id") || "";
  const matches = getMatches().filter(
    (m) => m.agent1_id === agentId || m.agent2_id === agentId
  );

  const result = matches.map((m) => {
    const partnerId = m.agent1_id === agentId ? m.agent2_id : m.agent1_id;
    const partner = getAgent(partnerId);
    return {
      ...m,
      partner_id: partnerId,
      partner_name: partner?.name || "Unknown",
      partner_avatar: partner?.avatar || "🤖",
      partner_bio: partner?.bio || "",
    };
  });

  return NextResponse.json(result);
}
