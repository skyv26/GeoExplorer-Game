import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft, MoreVertical, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/utils/get-initials"
import { NicknameModalWrapper } from "@/components/nickname-modal-wrapper"

interface LeaderboardEntry {
  change: number
  nickname: string
  score: number
}

async function getLeaderboard() {
  const res = await fetch(`/api/leaderboard`, {
    cache: "no-store",
  })
  const data = await res.json()
  return data.leaderboard as LeaderboardEntry[]
}

export default async function GameOver() {
  const cookieStore = await cookies()
  const score = Number.parseInt(cookieStore.get("userScore")?.value || "0")
  const nickname = cookieStore.get("nickname")?.value
  const leaderboard = await getLeaderboard()
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-500 to-sky-300 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          <Button variant="ghost" className="text-white">
            <MoreVertical className="h-6 w-6" />
          </Button>
        </header>

        <div className="mb-8 text-center">
          <Link href="/game">
            <Button size="lg">Start Again</Button>
          </Link>
        </div>

        {/* Podium Section */}
        <div className="relative h-[400px] mb-8">
          {/* Second Place */}
          <div className="absolute left-0 bottom-20 w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-orange-400 flex items-center justify-center mb-4 text-4xl font-bold text-white">
                {top3[1] ? getInitials(top3[1].nickname) : ""}
              </div>
              <div className="bg-orange-400 w-full py-16 px-4 text-center rounded-t-lg">
                <h3 className="text-white font-bold">{top3[1]?.nickname}</h3>
                <p className="text-white">{top3[1]?.score} Pts</p>
                <div className="text-6xl font-bold text-white mt-4">2</div>
              </div>
            </div>
          </div>

          {/* First Place */}
          <div className="absolute left-1/4 bottom-20 w-1/2">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-red-500 flex items-center justify-center mb-4 text-5xl font-bold text-white">
                {top3[0] ? getInitials(top3[0].nickname) : ""}
              </div>
              <div className="bg-red-500 w-full py-20 px-4 text-center rounded-t-lg">
                <h3 className="text-white font-bold">{top3[0]?.nickname}</h3>
                <p className="text-white">{top3[0]?.score} Pts</p>
                <div className="text-6xl font-bold text-white mt-4">1</div>
              </div>
            </div>
          </div>

          {/* Third Place */}
          <div className="absolute right-0 bottom-20 w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-teal-400 flex items-center justify-center mb-4 text-4xl font-bold text-white">
                {top3[2] ? getInitials(top3[2].nickname) : ""}
              </div>
              <div className="bg-teal-400 w-full py-12 px-4 text-center rounded-t-lg">
                <h3 className="text-white font-bold">{top3[2]?.nickname}</h3>
                <p className="text-white">{top3[2]?.score} Pts</p>
                <div className="text-6xl font-bold text-white mt-4">3</div>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-t-3xl p-6">
          <div className="flex justify-between text-gray-500 mb-4">
            <div>Player</div>
            <div>Pts</div>
          </div>
          {rest.map((item, index) => (
            <div key={item.nickname} className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center gap-4">
                <div className="w-8 text-gray-500">{index + 4}</div>
                {item.change > 0 && <ArrowUp className="w-4 h-4 text-green-500" />}
                {item.change < 0 && <ArrowDown className="w-4 h-4 text-red-500" />}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-600">
                  {getInitials(item.nickname)}
                </div>
                <div className="font-medium">{item.nickname}</div>
              </div>
              <div className="font-bold">{item.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Client-side Modal */}
      <NicknameModalWrapper isOpen={!nickname} score={score} />
    </div>
  )
}
