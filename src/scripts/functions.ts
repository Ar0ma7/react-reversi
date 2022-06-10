import { BoardType, Stone } from '@/types/global'
import { direction } from '@/scripts/variables'
import { useEffect, useState } from 'react'

export const getWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  return windowSize
}

export const getInitialBoard = (size: number): BoardType => {
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

export const getMovableDir = (board: BoardType, currentTurn: Stone): number[][] => {
  return board.map((y, yIdx) =>
    y.map((value, xIdx) => checkMobility(board, yIdx, xIdx, currentTurn)),
  )
}

export const getMovablePos = (board: BoardType, currentTurn: Stone): boolean[][] => {
  return board.map((y, yIdx) =>
    y.map((value, xIdx) => {
      const dir = checkMobility(board, yIdx, xIdx, currentTurn)
      return dir !== 0
    }),
  )
}

export const checkMobility = (
  board: BoardType,
  y: number,
  x: number,
  currentTurn: number,
): number => {
  let dir = 0
  // 空マスじゃない場合
  if (board[y][x] !== 0) return dir
  // 左
  if (board[y][x - 1] === -currentTurn) {
    let xTmp = x - 2
    while (board[y][xTmp] === -currentTurn) {
      xTmp -= 1
    }
    if (board[y][xTmp] === currentTurn) dir = dir | direction.LEFT
  }
  // 左上
  if (board[y - 1][x - 1] === -currentTurn) {
    let yTmp = y - 2
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp -= 1
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === currentTurn) dir = dir | direction.UPPER_LEFT
  }
  // 上
  if (board[y - 1][x] === -currentTurn) {
    let yTemp = y - 2
    while (board[yTemp][x] === -currentTurn) {
      yTemp -= 1
    }
    if (board[yTemp][x] === currentTurn) dir = dir | direction.UPPER
  }
  // 右上
  if (board[y - 1][x + 1] === -currentTurn) {
    let yTmp = y - 2
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp -= 1
      xTmp += 1
    }
    if (board[yTmp][xTmp] === currentTurn) dir = dir | direction.UPPER_RIGHT
  }
  // 右
  if (board[y][x + 1] === -currentTurn) {
    let xTmp = x + 2
    while (board[y][xTmp] === -currentTurn) {
      xTmp += 1
    }
    if (board[y][xTmp] === currentTurn) dir = dir | direction.RIGHT
  }
  // 右下
  if (board[y + 1][x + 1] === -currentTurn) {
    let yTmp = y + 2
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp += 1
      xTmp += 1
    }
    if (board[yTmp][xTmp] === currentTurn) dir = dir | direction.LOWER_RIGHT
  }
  // 下
  if (board[y + 1][x] === -currentTurn) {
    let yTmp = y + 2
    while (board[yTmp][x] === -currentTurn) {
      yTmp += 1
    }
    if (board[yTmp][x] === currentTurn) dir = dir | direction.LOWER
  }
  // 左下
  if (board[y + 1][x - 1] === -currentTurn) {
    let yTmp = y + 2
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp += 1
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === currentTurn) dir = dir | direction.LOWER_LEFT
  }
  return dir
}

export const getFlippedBoard = ({
  board,
  x,
  y,
  dir,
  currentTurn,
}: {
  board: BoardType
  x: number
  y: number
  dir: number
  currentTurn: Stone
}): BoardType => {
  const boardTemp = [...board.map((v) => [...v])]

  boardTemp[y][x] = currentTurn

  // 左
  if (dir & direction.LEFT) {
    let xTmp = x - 1
    while (boardTemp[y][xTmp] === -currentTurn) {
      boardTemp[y][xTmp] = currentTurn
      xTmp -= 1
    }
  }
  // 左上
  if (dir & direction.UPPER_LEFT) {
    let xTmp = x - 1
    let yTmp = y - 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp -= 1
      yTmp -= 1
    }
  }
  // 上
  if (dir & direction.UPPER) {
    let yTmp = y - 1
    while (boardTemp[yTmp][x] === -currentTurn) {
      boardTemp[yTmp][x] = currentTurn
      yTmp -= 1
    }
  }
  // 右上
  if (dir & direction.UPPER_RIGHT) {
    let xTmp = x + 1
    let yTmp = y - 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp += 1
      yTmp -= 1
    }
  }
  // 右
  if (dir & direction.RIGHT) {
    let xTmp = x + 1
    while (boardTemp[y][xTmp] === -currentTurn) {
      boardTemp[y][xTmp] = currentTurn
      xTmp += 1
    }
  }
  // 右下
  if (dir & direction.LOWER_RIGHT) {
    let xTmp = x + 1
    let yTmp = y + 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp += 1
      yTmp += 1
    }
  }
  // 下
  if (dir & direction.LOWER) {
    let yTmp = y + 1
    while (boardTemp[yTmp][x] === -currentTurn) {
      boardTemp[yTmp][x] = currentTurn
      yTmp += 1
    }
  }
  // 左下
  if (dir & direction.LOWER_LEFT) {
    let xTmp = x - 1
    let yTmp = y + 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp -= 1
      yTmp += 1
    }
  }
  return boardTemp
}

export const getCpuFlippedBoard = (board: BoardType, currentTurn: Stone): BoardType => {
  const movablePos: number[][] = []
  getMovablePos(board, currentTurn).forEach((y, yIdx) => {
    y.forEach((x, xIdx) => {
      if (x) movablePos.push([yIdx, xIdx])
    })
  })
  const randomIdx: number = Math.floor(Math.random() * movablePos.length)
  const randomPos: number[] = movablePos[randomIdx]
  const newBoard = [
    ...getFlippedBoard({
      board,
      x: randomPos[1],
      y: randomPos[0],
      dir: getMovableDir(board, currentTurn)[randomPos[0]][randomPos[1]],
      currentTurn,
    }),
  ]
  return newBoard
}
