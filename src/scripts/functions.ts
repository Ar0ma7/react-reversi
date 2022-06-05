import { BoardType, Turn } from '@/types/global'

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

export const getMovableDir = (board: BoardType, currentTurn: Turn): number[][] => {
  return board.map((y, yIdx) => y.map((value, xIdx) => checkMobility(board, yIdx, xIdx, currentTurn)))
}

export const getMovablePos = (board: BoardType, currentTurn: Turn): boolean[][] => {
  return board.map((y, yIdx) =>
    y.map((value, xIdx) => {
      const dir = checkMobility(board, yIdx, xIdx, currentTurn)
      return dir !== 0
    }),
  )
}

export const checkMobility = (board: BoardType, y: number, x: number, value: number): number => {
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
