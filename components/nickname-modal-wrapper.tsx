"use client"
import { NicknameModal } from "@/components/nicknameModal/nickname-modal";
import { useState } from "react";

export function NicknameModalWrapper({ isOpen, score }: { isOpen: boolean; score: number }) {
  const [showModal, setShowModal] = useState(isOpen)

  return <NicknameModal isOpen={showModal} onClose={() => setShowModal(false)} score={score} />
}