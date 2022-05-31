import React, { useState } from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import SquareState from '@/types/SquareState'

/* 最初のターン - 1: 自分, -1: 相手 */
type Turn = 1 | -1

type BoardProps = {
  firstTurn: Turn
  /* 盤面サイズ（偶数） */
  size: number
}

type BoardType = SquareState[][]

const getInitialBoard = (size: number): BoardType => {
  const includeWallSize = size + 2
  const board = [...Array(includeWallSize)].map((_, yIdx) => {
    if (yIdx === 0 || yIdx === includeWallSize - 1) {
      return [...Array(includeWallSize)].fill(2)
    } else {
      return [2, ...Array(size).fill(0), 2]
    }
  })

  board[includeWallSize / 2][includeWallSize / 2 - 1] = 1
  board[includeWallSize / 2 - 1][includeWallSize / 2] = 1
  board[includeWallSize / 2 - 1][includeWallSize / 2 - 1] = -1
  board[includeWallSize / 2][includeWallSize / 2] = -1

  return board
}

const getMovableDir = (board: BoardType, currentValue: number): number[][] => {
  return board.map((y, yIdx) => y.map((value, xIdx) => checkMobility(board, yIdx, xIdx, currentValue)))
}
const getMovablePos = (board: BoardType, currentValue: number): boolean[][] => {
  return board.map((y, yIdx) =>
    y.map((value, xIdx) => {
      const dir = checkMobility(board, yIdx, xIdx, currentValue)
      return dir !== 0
    }),
  )
}

const checkMobility = (board: BoardType, y: number, x: number, value: number): number => {
  let direction = 0
  // 空マスじゃない場合
  if (board[y][x] !== 0) return direction
  // 左
  if (board[y][x - 1] === -value) {
    const yTmp = y
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -value) {
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 1
  }
  // 左上
  if (board[y + 1][x - 1] === -value) {
    let yTmp = y + 2
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -value) {
      yTmp += 1
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 2
  }
  // 上
  if (board[y - 1][x] === -value) {
    let yTemp = y - 2
    const xTemp = x
    while (board[yTemp][xTemp] === -value) {
      yTemp -= 1
    }
    if (board[yTemp][xTemp] === value) direction = direction | 4
  }
  // 右上
  if (board[y - 1][x - 1] === -value) {
    let yTmp = y - 2
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -value) {
      yTmp -= 1
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 8
  }
  // 右
  if (board[y][x + 1] === -value) {
    const yTmp = y
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -value) {
      xTmp += 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 16
  }
  // 右下
  if (board[y + 1][x + 1] === -value) {
    let yTmp = y + 2
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -value) {
      yTmp += 1
      xTmp += 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 32
  }
  // 下
  if (board[y + 1][x] === -value) {
    let yTmp = y + 2
    const xTmp = x
    while (board[yTmp][xTmp] === -value) {
      yTmp += 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 64
  }
  // 左下
  if (board[y - 1][x + 1] === -value) {
    let yTmp = y - 2
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -value) {
      yTmp -= 1
      xTmp += 1
    }
    if (board[yTmp][xTmp] === value) direction = direction | 128
  }
  return direction
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
    if (getMovablePos(board, currentTurn)[y][x]) {
      newBoard[y][x] = currentTurn
      setNextTurn(currentTurn === 1 ? -1 : 1)
      setBoard(newBoard)
      setMovableDir(getMovableDir(newBoard, -currentTurn))
      setMovablePos(getMovablePos(newBoard, -currentTurn))
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
