import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const AGENTS_FILE = path.join(DATA_DIR, "agents.json");
const SWIPES_FILE = path.join(DATA_DIR, "swipes.json");
const MATCHES_FILE = path.join(DATA_DIR, "matches.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJSON(file: string, data: any) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  personality: string;
  interests: string[];
  looking_for: string;
  created_at: string;
}

export interface Swipe {
  swiper_id: string;
  swiped_id: string;
  direction: "left" | "right";
}

export interface Match {
  id: number;
  agent1_id: string;
  agent2_id: string;
  created_at: string;
}

export interface Message {
  id: number;
  match_id: number;
  sender_id: string;
  content: string;
  created_at: string;
}

// Agents
export function getAgents(): Agent[] { return readJSON(AGENTS_FILE, []); }
export function saveAgents(agents: Agent[]) { writeJSON(AGENTS_FILE, agents); }
export function getAgent(id: string) { return getAgents().find((a) => a.id === id); }
export function upsertAgent(agent: Agent) {
  const agents = getAgents().filter((a) => a.id !== agent.id);
  agents.push(agent);
  saveAgents(agents);
}

// Swipes
export function getSwipes(): Swipe[] { return readJSON(SWIPES_FILE, []); }
export function saveSwipes(swipes: Swipe[]) { writeJSON(SWIPES_FILE, swipes); }
export function addSwipe(swipe: Swipe) {
  const swipes = getSwipes().filter(
    (s) => !(s.swiper_id === swipe.swiper_id && s.swiped_id === swipe.swiped_id)
  );
  swipes.push(swipe);
  saveSwipes(swipes);
}
export function hasSwipe(swiperId: string, swipedId: string, direction: string) {
  return getSwipes().some(
    (s) => s.swiper_id === swiperId && s.swiped_id === swipedId && s.direction === direction
  );
}

// Matches
export function getMatches(): Match[] { return readJSON(MATCHES_FILE, []); }
export function saveMatches(matches: Match[]) { writeJSON(MATCHES_FILE, matches); }
export function addMatch(agent1: string, agent2: string): Match {
  const matches = getMatches();
  const m: Match = {
    id: matches.length + 1,
    agent1_id: agent1,
    agent2_id: agent2,
    created_at: new Date().toISOString(),
  };
  matches.push(m);
  saveMatches(matches);
  return m;
}

// Messages
export function getMessages(): Message[] { return readJSON(MESSAGES_FILE, []); }
export function saveMessages(msgs: Message[]) { writeJSON(MESSAGES_FILE, msgs); }
export function addMessage(matchId: number, senderId: string, content: string): Message {
  const msgs = getMessages();
  const m: Message = {
    id: msgs.length + 1,
    match_id: matchId,
    sender_id: senderId,
    content,
    created_at: new Date().toISOString(),
  };
  msgs.push(m);
  saveMessages(msgs);
  return m;
}
