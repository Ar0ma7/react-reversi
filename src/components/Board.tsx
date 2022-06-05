import React, { useState } from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import { BoardType, Turn } from '@/types/global'
import { getInitialBoard, getMovableDir, getMovablePos } from '@/scripts/functions'

export type BoardProps = {
  firstTurn: Turn
  /* 盤面サイズ（偶数） */
  size: number
}

export const Board: React.FC<BoardProps> = React.memo(({ firstTurn, size }) => {
  const [currentTurn, setNextTurn] = useState<Turn>(firstTurn)
  const [board, setBoard] = useState<BoardType>(getInitialBoard(size))
  const [movableDir, setMovableDir] = useState<number[][]>(getMovableDir(board, currentTurn))
  const [movablePos, setMovablePos] = useState<boolean[][]>(getMovablePos(board, currentTurn))

  const sizes = [...Array(size + 2)].fill('50px')

  const items = board.map((y, yIdx) =>
    y.map((x, xIdx) => {
      const key = `area${yIdx}${xIdx}`
      return (
        <StyledGridItem key={key} area={key} onClick={() => handleClick(yIdx, xIdx)}>
          <Square state={x} />
        </StyledGridItem>
      )
    }),
  )

  /**
   * handleClick - 石を置く
   *
   * @param {number} y
   * @param {number} x
   */
  const handleClick = (y: number, x: number) => {
    const newBoard = [...board]
    const nextTurn: Turn = currentTurn === 1 ? -1 : 1
    if (getMovablePos(board, currentTurn)[y][x]) {
      newBoard[y][x] = currentTurn
      setNextTurn(nextTurn)
      setBoard(newBoard)
      setMovableDir(getMovableDir(newBoard, nextTurn))
      setMovablePos(getMovablePos(newBoard, nextTurn))
    }
  }

  return (
    <>
      currentTurn: {currentTurn}
      <StyledGridContainer columns={sizes} rows={sizes} areas={board.map((r, i) => r.map((c, j) => `area${i}${j}`))}>
        {items}
      </StyledGridContainer>
      {movableDir.map((r, i) => (
        <p key={i}>{r.map((c) => `　 ${c} 　`)}</p>
      ))}
      {movablePos.map((r, i) => (
        <p key={i}>{r.map((c) => `${c} 　`)}</p>
      ))}
    </>
  )
})
Board.displayName = 'Board'

const StyledGridContainer = styled.div<{
  columns: string[]
  rows: string[]
  areas: string[][]
}>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns.join(' ')};
  grid-template-rows: ${({ rows }) => rows.join(' ')};
  grid-template-areas: ${({ areas }) => areas.map((r) => `"${r.join(' ')}"`).join('\n')};
`

const StyledGridItem = styled.div<{
  area: string
}>`
  grid-area: ${({ area }) => area};
`
