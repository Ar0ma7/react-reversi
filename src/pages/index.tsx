import React, { useState } from 'react'
import { Board } from '@/components/Board'

export default function Home() {
  const [boardSize, setBoardSize] = useState<number>(8)

  return <Board boardSize={boardSize} playerStone={1} />
}
