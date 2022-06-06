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

export const checkMobility = (board: BoardType, y: number, x: number, currentTurn: number): number => {
  let direction = 0
  // 空マスじゃない場合
  if (board[y][x] !== 0) return direction
  // 左
  if (board[y][x - 1] === -currentTurn) {
    const yTmp = y
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -currentTurn) {
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 1
  }
  // 左上
  if (board[y + 1][x - 1] === -currentTurn) {
    let yTmp = y + 2
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp += 1
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 2
  }
  // 上
  if (board[y - 1][x] === -currentTurn) {
    let yTemp = y - 2
    const xTemp = x
    while (board[yTemp][xTemp] === -currentTurn) {
      yTemp -= 1
    }
    if (board[yTemp][xTemp] === currentTurn) direction = direction | 4
  }
  // 右上
  if (board[y - 1][x - 1] === -currentTurn) {
    let yTmp = y - 2
    let xTmp = x - 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp -= 1
      xTmp -= 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 8
  }
  // 右
  if (board[y][x + 1] === -currentTurn) {
    const yTmp = y
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -currentTurn) {
      xTmp += 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 16
  }
  // 右下
  if (board[y + 1][x + 1] === -currentTurn) {
    let yTmp = y + 2
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp += 1
      xTmp += 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 32
  }
  // 下
  if (board[y + 1][x] === -currentTurn) {
    let yTmp = y + 2
    const xTmp = x
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp += 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 64
  }
  // 左下
  if (board[y - 1][x + 1] === -currentTurn) {
    let yTmp = y - 2
    let xTmp = x + 2
    while (board[yTmp][xTmp] === -currentTurn) {
      yTmp -= 1
      xTmp += 1
    }
    if (board[yTmp][xTmp] === currentTurn) direction = direction | 128
  }
  return direction
}

export const getFlippedBoard = ({
  board,
  x,
  y,
  dir,
  currentTurn,
} : {
  board: BoardType
  x: number
  y: number
  dir: number
  currentTurn: Turn
}): BoardType => {
  const boardTemp = [...board]

  boardTemp[y][x] = currentTurn

  // 左
  if (dir & 1) {
    let xTmp = x - 1
    while (boardTemp[y][xTmp] === -currentTurn) {
      boardTemp[y][xTmp] = currentTurn
      xTmp -= 1
    }
  }
  // 左上
  if (dir & 2) {
    let xTmp = x - 1
    let yTmp = y - 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp -= 1
      yTmp -= 1
    }
  }
  // 上
  if (dir & 4) {
    let yTmp = y - 1
    while (boardTemp[yTmp][x] === -currentTurn) {
      boardTemp[yTmp][x] = currentTurn
      yTmp -= 1
    }
  }
  // 右上
  if (dir & 8) {
    let xTmp = x + 1
    let yTmp = y - 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp += 1
      yTmp -= 1
    }
  }
  // 右
  if (dir & 16) {
    let xTmp = x + 1
    while (boardTemp[y][xTmp] === -currentTurn) {
      boardTemp[y][xTmp] = currentTurn
      xTmp += 1
    }
  }
  // 右下
  if (dir & 32) {
    let xTmp = x + 1
    let yTmp = y + 1
    while (boardTemp[yTmp][xTmp] === -currentTurn) {
      boardTemp[yTmp][xTmp] = currentTurn
      xTmp += 1
      yTmp += 1
    }
  }
  // 下
  if (dir & 64) {
    let yTmp = y + 1
    while (boardTemp[yTmp][x] === -currentTurn) {
      boardTemp[yTmp][x] = currentTurn
      yTmp += 1
    }
  }
  // 左下
  if (dir & 128) {
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
