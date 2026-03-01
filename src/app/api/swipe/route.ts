import { NextRequest, NextResponse } from "next/server";
import { addSwipe, hasSwipe, getMatches, addMatch } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { swiper_id, swiped_id, direction } = await req.json();

  if (!swiper_id || !swiped_id || !direction) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  addSwipe({ swiper_id, swiped_id, direction });

  let matched = false;

  if (direction === "right") {
    if (hasSwipe(swiped_id, swiper_id, "right")) {
      const matches = getMatches();
      const exists = matches.some(
        (m) =>
          (m.agent1_id === swiper_id && m.agent2_id === swiped_id) ||
          (m.agent1_id === swiped_id && m.agent2_id === swiper_id)
      );
      if (!exists) {
        addMatch(swiper_id, swiped_id);
        matched = true;
      }
    }
  }

  return NextResponse.json({ ok: true, matched });
}
