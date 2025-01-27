import { NextResponse } from "next/server"

// In a real app, this would be in a database
let leaderboard = [
  { id: 1, nickname: "Naruto", score: 1470, avatar: "naruto.png", change: 0 },
  { id: 2, nickname: "One Piece", score: 1340, avatar: "one-piece.png", change: 1 },
  { id: 3, nickname: "Dragon Ball", score: 1202, avatar: "dragon-ball.png", change: -1 },
  { id: 4, nickname: "Demon Slayer", score: 1007, avatar: "demon-slayer.png", change: 1 },
  { id: 5, nickname: "Bleach", score: 990, avatar: "bleach.png", change: 1 },
  { id: 6, nickname: "Hunter X Hunter", score: 958, avatar: "hunter.png", change: -1 },
]

export async function GET() {
  return NextResponse.json({ leaderboard })
}

export async function POST(req: Request) {
  const { nickname, score } = await req.json()

  // Add new score and sort leaderboard
  leaderboard.push({
    id: leaderboard.length + 1,
    nickname,
    score,
    avatar: "new-player.png",
    change: 0,
  })

  leaderboard.sort((a, b) => b.score - a.score)

  // Keep only top 10 scores
  leaderboard = leaderboard.slice(0, 10)

  return NextResponse.json({ success: true })
}

