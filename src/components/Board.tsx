import React, { useState } from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import SquareState from '@/types/SquareState'

type BoardProps = {
  /* 偶数 */
  size: number
  /* 最初のターン - 0: 自分, 1: 相手 */
  firstTurn: number
}

type BoardType = SquareState[][]

const getInitializedBoard = (size: number): BoardType => {
  const includeWallSize = size + 2
  const board = [...Array(includeWallSize)].map((_, rowIdx) => {
    if (rowIdx === 0 || rowIdx === includeWallSize - 1) {
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

export const Board: React.FC<BoardProps> = React.memo(({ size, firstTurn }) => {
  const [board, setBoard] = useState<BoardType>(getInitializedBoard(size))
  const [turn, setTurn] = useState<number>(firstTurn)

  const items = board.map((row, rowIdx) =>
    row.map((col, colIdx) => {
      const key = `area${rowIdx}${colIdx}`
      return (
        <StyledGridItem key={key} area={key} onClick={() => handleClick(rowIdx, colIdx)}>
          <Square state={col} />
        </StyledGridItem>
      )
    }),
  )

  const sizes = [...Array(size + 2)].fill('50px')

  const useForceUpdate = (): (() => void) => {
    const [value, setValue] = useState(0)
    return () => setValue((value) => value + 1)
  }

  const forceUpdate = useForceUpdate()

  /**
   * handleClick - 石を置く
   *
   * @param {number} row
   * @param {number} col
   */
  const handleClick = (row: number, col: number) => {
    if (board[row][col] === 0) {
      const newBoard = board
      newBoard[row][col] = turn % 2 === 0 ? 1 : -1
      setBoard(newBoard)
      setTurn(turn + 1)
      forceUpdate()
    }
  }

  return (
    <StyledGridContainer columns={sizes} rows={sizes} areas={board.map((r, i) => r.map((c, j) => `area${i}${j}`))}>
      {items}
    </StyledGridContainer>
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
