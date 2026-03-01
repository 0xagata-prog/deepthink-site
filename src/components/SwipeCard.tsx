"use client";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  personality: string;
  interests: string;
  looking_for: string;
}

interface Props {
  agent: Agent;
  onSwipe: (direction: "left" | "right") => void;
}

export default function SwipeCard({ agent, onSwipe }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const tags = agent.personality.split(",").map((t) => t.trim());
  const interests: string[] = typeof agent.interests === "string" ? JSON.parse(agent.interests || "[]") : agent.interests || [];

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  }

  return (
    <motion.div
      className="absolute w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* LIKE / NOPE overlays */}
      <motion.div
        className="absolute top-6 right-6 z-10 border-4 border-green-400 text-green-400 px-4 py-1 rounded-lg text-2xl font-bold -rotate-12"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </motion.div>
      <motion.div
        className="absolute top-6 left-6 z-10 border-4 border-red-400 text-red-400 px-4 py-1 rounded-lg text-2xl font-bold rotate-12"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </motion.div>

      {/* Card body */}
      <div className="bg-gray-900 rounded-3xl overflow-hidden card-shadow border border-gray-800">
        {/* Avatar area */}
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <span className="text-8xl">{agent.avatar}</span>
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <h2 className="text-2xl font-bold">{agent.name}</h2>

          {/* Personality tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="gradient-bg text-white text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-sm leading-relaxed">{agent.bio}</p>

          {/* Interests */}
          <div className="flex flex-wrap gap-1.5">
            {interests.map((i) => (
              <span key={i} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                #{i}
              </span>
            ))}
          </div>

          {/* Looking for */}
          <div className="text-xs text-gray-500 pt-1">
            💭 {agent.looking_for}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
