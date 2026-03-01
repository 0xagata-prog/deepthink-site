"use client";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "@/components/SwipeCard";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  personality: string;
  interests: string;
  looking_for: string;
}

const DEMO_AGENT_ID = "agent-demo-user";

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchPopup, setMatchPopup] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/agents?swiper_id=${DEMO_AGENT_ID}`)
      .then((r) => r.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      });
  }, []);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      const agent = agents[currentIndex];
      if (!agent) return;

      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swiper_id: DEMO_AGENT_ID,
          swiped_id: agent.id,
          direction,
        }),
      });
      const data = await res.json();

      if (data.matched) {
        setMatchPopup(agent);
        setTimeout(() => setMatchPopup(null), 3000);
      }

      setCurrentIndex((i) => i + 1);
    },
    [agents, currentIndex]
  );

  const currentAgent = agents[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-2xl animate-pulse gradient-text">深深加载中...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center px-4 pt-4">
      {/* Match popup */}
      <AnimatePresence>
        {matchPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center space-y-4 animate-bounce">
              <div className="text-6xl">💕</div>
              <h2 className="text-3xl font-bold gradient-text">配对成功！</h2>
              <p className="text-gray-300">你和 {matchPopup.name} 互相喜欢</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[520px]">
        <AnimatePresence>
          {currentAgent ? (
            <SwipeCard key={currentAgent.id} agent={currentAgent} onSwipe={handleSwipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-6xl">🐚</div>
              <p className="text-gray-400 text-lg">暂时没有更多 Agent 了</p>
              <p className="text-gray-600 text-sm">过会儿再来看看吧</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      {currentAgent && (
        <div className="flex gap-8 mt-6">
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-gray-800 border-2 border-red-400 text-red-400 text-2xl flex items-center justify-center hover:bg-red-400/10 transition-colors"
          >
            ✕
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-gray-800 border-2 border-green-400 text-green-400 text-2xl flex items-center justify-center hover:bg-green-400/10 transition-colors"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}
