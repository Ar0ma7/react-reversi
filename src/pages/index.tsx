import React from 'react'
import { Board } from '@/components/Board'
import { Setting } from '@/components/Setting'
import { useAppSelector } from '@/modules'

export default function Home() {
  const board = useAppSelector((state) => state.board.board)
  const currentTurn = useAppSelector((state) => state.player.currentTurn)

  return (
    <>
      <Setting />
      <Board currentTurn={currentTurn} board={board} />
    </>
  )
}
