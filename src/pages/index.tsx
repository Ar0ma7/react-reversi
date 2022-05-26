import React from 'react'
import { Board } from '@/components/Board'
import SquareState from '@/types/SquareState'

const getBoardArray = (size: number): SquareState[][] => {
  const board = [...Array(size)].map((_, index) => {
    if (index === 0 || index === size - 1) {
      return [...Array(size)].fill(2)
    } else {
      return [2, ...Array(size - 2).fill(0), 2]
    }
  })

  board[size / 2 - 1][size / 2 - 1] = 1
  board[size / 2][size / 2] = 1
  board[size / 2 - 1][size / 2] = -1
  board[size / 2][size / 2 - 1] = -1

  return board
}

export default function Home() {
  const size = 8
  return <Board squares={getBoardArray(size)} size={size} />
}
