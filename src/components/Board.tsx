import React, { useState } from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import SquareState from '@/types/SquareState'

type BoardProps = {
  /* 最初のターン - 0: 自分, 1: 相手 */
  firstTurn: number
  /* 盤面サイズ（偶数） */
  size: number
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

const getMovableDir = (board: BoardType, currentValue: number): number[][] => {
  return board.map((row, rowIdx) => row.map((value, colIdx) => checkMobility(board, rowIdx, colIdx, currentValue)))
}
const getMovablePos = (board: BoardType, currentValue: number): boolean[][] => {
  return board.map((row, rowIdx) =>
    row.map((value, colIdx) => {
      const dir = checkMobility(board, rowIdx, colIdx, currentValue)
      return dir !== 0 ? true : false
    }),
  )
}

const checkMobility = (board: BoardType, row: number, col: number, value: number): number => {
  let direction = 0
  // 既に石があるか
  if (board[row][col] !== 0) return direction
  // 左
  if (board[row - 1][col] === -value) {
    let rowTemp = row - 2
    const colTemp = col
    while (board[rowTemp][colTemp] === -value) {
      rowTemp -= 1
    }
    if (board[rowTemp][colTemp] === value) direction = direction | 1
  }
  // 左上
  if (board[row - 1][col - 1] === -value) {
    let rowTmp = row - 2
    let colTmp = col - 2
    while (board[rowTmp][colTmp] === -value) {
      rowTmp -= 1
      colTmp -= 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 2
  }
  // 上
  if (board[row][col - 1] === -value) {
    const rowTmp = row
    let colTmp = col - 2
    while (board[rowTmp][colTmp] === -value) {
      colTmp -= 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 4
  }
  // 右上
  if (board[row + 1][col - 1] === -value) {
    let rowTmp = row + 2
    let colTmp = col - 2
    while (board[rowTmp][colTmp] === -value) {
      rowTmp += 1
      colTmp -= 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 8
  }
  // 右
  if (board[row + 1][col] === -value) {
    let rowTmp = row + 2
    const colTmp = col
    while (board[rowTmp][colTmp] === -value) {
      rowTmp += 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 16
  }
  // 右下
  if (board[row + 1][col + 1] === -value) {
    let rowTmp = row + 2
    let colTmp = col + 2
    while (board[rowTmp][colTmp] === -value) {
      rowTmp += 1
      colTmp += 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 32
  }
  // 下
  if (board[row][col + 1] === -value) {
    const rowTmp = row
    let colTmp = col + 2
    while (board[rowTmp][colTmp] === -value) {
      colTmp += 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 64
  }
  // 左下
  if (board[row - 1][col + 1] === -value) {
    let rowTmp = row - 2
    let colTmp = col + 2
    while (board[rowTmp][colTmp] === -value) {
      rowTmp -= 1
      colTmp += 1
    }
    if (board[rowTmp][colTmp] === value) direction = direction | 128
  }
  return direction
}

export const Board: React.FC<BoardProps> = React.memo(({ firstTurn, size }) => {
  const [turn, setTurn] = useState<number>(firstTurn)
  const [board, setBoard] = useState<BoardType>(getInitializedBoard(size))
  const [movableDir, setMovableDir] = useState<number[][]>(getMovableDir(board, turn % 2 === 0 ? 1 : -1))
  const [movablePos, setMovablePos] = useState<boolean[][]>(getMovablePos(board, turn % 2 === 0 ? 1 : -1))

  const sizes = [...Array(size + 2)].fill('50px')

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

  const useForceUpdate = (): (() => void) => {
    const [value, setValue] = useState(0) // eslint-disable-line no-unused-vars
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
    const newBoard = board
    const nextStone = turn % 2 === 0 ? 1 : -1
    if (getMovablePos(board, nextStone)[row][col]) {
      newBoard[row][col] = nextStone
      setTurn(turn + 1)
      setBoard(newBoard)
      setMovableDir(getMovableDir(newBoard, -nextStone))
      setMovablePos(getMovablePos(newBoard, -nextStone))
      forceUpdate()
    }
  }

  return (
    <>
      next: {turn % 2 === 0 ? 1 : -1}
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
