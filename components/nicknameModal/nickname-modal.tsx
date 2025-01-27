"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NicknameModalProps {
  isOpen: boolean
  onClose: () => void
  score: number
}

export function NicknameModal({ isOpen, onClose, score }: NicknameModalProps) {
  const [nickname, setNickname] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    if (nickname) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, score }),
      })
      document.cookie = `nickname=${nickname}; path=/`
      onClose()
      router.refresh()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Your Nickname</DialogTitle>
          <DialogDescription>
            Congratulations! You scored {score} points. Enter your nickname to join the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Enter nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <Button onClick={handleSubmit} disabled={!nickname}>
            Submit Score
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

