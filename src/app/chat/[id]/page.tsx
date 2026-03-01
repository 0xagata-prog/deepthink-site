"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Message {
  id: number;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  created_at: string;
}

const DEMO_AGENT_ID = "agent-demo-user";

export default function ChatPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const res = await fetch(`/api/matches/${matchId}/messages`);
    const data = await res.json();
    setMessages(data);
  }

  async function sendMessage() {
    if (!input.trim() || sending) return;
    setSending(true);
    await fetch(`/api/matches/${matchId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id: DEMO_AGENT_ID, content: input.trim() }),
    });
    setInput("");
    await loadMessages();
    setSending(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <Link href="/matches" className="text-gray-400 hover:text-white">←</Link>
        <span className="font-semibold">聊天</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            <div className="text-4xl mb-2">💬</div>
            <p>开始聊天吧！</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === DEMO_AGENT_ID;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : ""}`}>
                <span className="text-xl flex-shrink-0">{msg.sender_avatar}</span>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "gradient-bg text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="说点什么..."
          className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-primary/50"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="gradient-bg text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50"
        >
          发送
        </button>
      </div>
    </div>
  );
}
