import React from 'react'
import { Board } from '@/components/Board'
import SquareState from '@/types/SquareState'

const getBoardArray = (size: number): SquareState[][] => {
  const includeWallSize = size + 2
  const board = [...Array(includeWallSize)].map((_, index) => {
    if (index === 0 || index === includeWallSize - 1) {
      return [...Array(includeWallSize)].fill(2)
    } else {
      return [2, ...Array(size).fill(0), 2]
    }
  })

  board[includeWallSize / 2 - 1][includeWallSize / 2 - 1] = 1
  board[includeWallSize / 2][includeWallSize / 2] = 1
  board[includeWallSize / 2 - 1][includeWallSize / 2] = -1
  board[includeWallSize / 2][includeWallSize / 2 - 1] = -1

  return board
}

export default function Home() {
  const size = 8
  return <Board squares={getBoardArray(size)} size={size} />
}
