import React, { useState } from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import { BoardType, Stone } from '@/types/global'
import { getFlippedBoard, getInitialBoard, getMovableDir, getMovablePos } from '@/scripts/functions'

export type BoardProps = {
  playerStone: Stone
  /* 盤面サイズ（偶数） */
  boardSize: number
}

export const Board: React.FC<BoardProps> = React.memo(({ playerStone, boardSize }) => {
  const [currentTurn, setNextTurn] = useState<Stone>(playerStone)
  const [board, setBoard] = useState<BoardType>(getInitialBoard(boardSize))

  const sizes = ['0', ...Array(boardSize).fill('50px'), '0']

  const items = board.map((y, yIdx) =>
    y.map((x, xIdx) => {
      const key = `area${xIdx}_${yIdx}`
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
    const nextTurn: Stone = currentTurn === 1 ? -1 : 1
    if (getMovablePos(board, currentTurn)[y][x]) {
      const newBoard = getFlippedBoard({
        board,
        x,
        y,
        dir: getMovableDir(board, currentTurn)[y][x],
        currentTurn,
      })
      setBoard([...newBoard])
      setNextTurn(nextTurn)
    }
  }

  return (
    <>
      currentTurn: {currentTurn}
      <StyledGridContainer
        columns={sizes}
        rows={sizes}
        areas={board.map((y, yIdx) => y.map((x, xIdx) => `area${xIdx}_${yIdx}`))}
      >
        {items}
      </StyledGridContainer>
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
