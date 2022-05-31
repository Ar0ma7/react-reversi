import React from 'react'
import { Board } from '@/components/Board'

export default function Home() {
  const size = 8
  return (
    <>
      <Board size={size} firstTurn={1} />
    </>
  )
}
