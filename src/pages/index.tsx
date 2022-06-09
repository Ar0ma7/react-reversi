import React from 'react'
import { Board } from '@/components/Board'
import { Setting } from '@/components/Setting'
import { AppDispatch, boardSlice, playerSlice, useAppDispatch, useAppSelector } from '@/modules'
import { BoardType, Stone } from '@/types/global'
import { getCpuFlippedBoard } from '@/scripts/functions'

export default function Home() {
  console.log('render home')
  const dispatch: AppDispatch = useAppDispatch()
  const { setNextTurn } = playerSlice.actions
  const { setBoard } = boardSlice.actions
  const board: BoardType = useAppSelector((state) => state.board.board)
  const playerStone: Stone = useAppSelector((state) => state.player.playerStone)
  const currentTurn: Stone = useAppSelector((state) => state.player.currentTurn)

  if (currentTurn !== playerStone) {
    setTimeout(() => {
      dispatch(setBoard([...getCpuFlippedBoard(board, currentTurn)]))
      dispatch(setNextTurn(currentTurn === 1 ? -1 : 1))
    }, 1000)
  }

  return (
    <>
      <Setting />
      <Board currentTurn={currentTurn} board={board} />
    </>
  )
}
