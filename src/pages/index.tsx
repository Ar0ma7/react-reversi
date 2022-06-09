import React from 'react'
import { Board } from '@/components/Board'
import { Setting } from '@/components/Setting'
import { AppDispatch, boardSlice, playerSlice, useAppDispatch, useAppSelector } from '@/modules'
import { BoardType, Stone } from '@/types/global'
import { getCpuFlippedBoard, getMovablePos } from '@/scripts/functions'
import { css } from '@emotion/react'

export default function Home() {
  console.log('render home')
  const dispatch: AppDispatch = useAppDispatch()
  const { setNextTurn } = playerSlice.actions
  const { setBoard } = boardSlice.actions
  const playerStone: Stone = useAppSelector((state) => state.player.playerStone)
  const currentTurn: Stone = useAppSelector((state) => state.player.currentTurn)
  const board: BoardType = useAppSelector((state) => state.board.board)

  const nextTurn = currentTurn === 1 ? -1 : 1
  const movablePosCount = {
    black: 0,
    white: 0,
  }

  let emptyCount: number = 0
  let finishFlag: boolean = false

  board.forEach((y) => {
    y.forEach((x) => {
      if (x === 0) emptyCount++
    })
  })

  getMovablePos(board, 1).forEach((y) => {
    y.forEach((x) => {
      if (x) movablePosCount.black++
    })
  })

  getMovablePos(board, -1).forEach((y) => {
    y.forEach((x) => {
      if (x) movablePosCount.white++
    })
  })

  // 終了判定
  if (
    !finishFlag &&
    (emptyCount === 0 || (movablePosCount.black === 0 && movablePosCount.white === 0))
  ) {
    finishFlag = true
    console.log('finish')
  }

  if (!finishFlag) {
    // スキップ判定
    if (
      (currentTurn === 1 && movablePosCount.black === 0) ||
      (currentTurn === -1 && movablePosCount.white === 0)
    ) {
      console.log('skip')
      setTimeout(() => {
        dispatch(setNextTurn(nextTurn))
      }, 1000)
    } else if (currentTurn !== playerStone) {
      // CPU の行動
      setTimeout(() => {
        dispatch(setBoard([...getCpuFlippedBoard(board, currentTurn)]))
        dispatch(setNextTurn(nextTurn))
      }, 1000)
    }
  }

  return (
    <div css={container}>
      <div css={{ marginBottom: 20 }}>
        <h1 css={heading1}>React Reversi</h1>
        <Setting />
      </div>
      <Board currentTurn={currentTurn} board={board} />
    </div>
  )
}

const container = css`
  padding: 20px 40px;
`

const heading1 = css`
  display: inline-block;
  margin: 0 40px 0 0;
  font-size: 32px;
`
