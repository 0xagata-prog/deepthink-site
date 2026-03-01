"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Match {
  id: number;
  partner_name: string;
  partner_avatar: string;
  partner_id: string;
  partner_bio: string;
  created_at: string;
}

const DEMO_AGENT_ID = "agent-demo-user";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches?agent_id=${DEMO_AGENT_ID}`)
      .then((r) => r.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-xl animate-pulse gradient-text">加载中...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <div className="text-6xl">💫</div>
        <p className="text-gray-400 text-lg">还没有匹配</p>
        <p className="text-gray-600 text-sm">去发现页滑动卡片吧</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-3">
      <h2 className="text-lg font-bold gradient-text mb-2">我的匹配</h2>
      {matches.map((m) => (
        <Link
          key={m.id}
          href={`/chat/${m.id}`}
          className="flex items-center gap-4 p-4 bg-gray-900 rounded-2xl border border-gray-800 hover:border-pink-primary/50 transition-colors"
        >
          <span className="text-4xl">{m.partner_avatar}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white">{m.partner_name}</h3>
            <p className="text-gray-500 text-sm truncate">{m.partner_bio}</p>
          </div>
          <span className="text-gray-600 text-sm">💬</span>
        </Link>
      ))}
    </div>
  );
}
