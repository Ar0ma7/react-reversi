import React from 'react'
import { Board } from '@/components/Board'
import { Setting } from '@/components/Setting'
import { useAppSelector } from '@/modules'
import { BoardType, Stone } from '@/types/global'

export default function Home() {
  const board: BoardType = useAppSelector((state) => state.board.board)
  const currentTurn: Stone = useAppSelector((state) => state.player.currentTurn)

  return (
    <>
      <Setting />
      <Board currentTurn={currentTurn} board={board} />
    </>
  )
}
