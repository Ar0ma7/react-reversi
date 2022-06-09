import React, { useState } from 'react'
import { Board } from '@/components/Board'
import { Setting } from '@/components/Setting'
import { AppDispatch, boardSlice, playerSlice, useAppDispatch, useAppSelector } from '@/modules'
import { BoardType, Stone } from '@/types/global'
import { getCpuFlippedBoard, getMovablePos } from '@/scripts/functions'
import { css } from '@emotion/react'
import { FinishModal } from '@/components/FinishModal'

export default function Home() {
  console.log('render home')
  const dispatch: AppDispatch = useAppDispatch()
  const { setNextTurn } = playerSlice.actions
  const { setBoard } = boardSlice.actions
  const playerStone: Stone = useAppSelector((state) => state.player.playerStone)
  const currentTurn: Stone = useAppSelector((state) => state.player.currentTurn)
  const board: BoardType = useAppSelector((state) => state.board.board)

  const [finishFlag, setFinishFlag] = useState<boolean>(false)
  const [modalShow, setModalShow] = useState<boolean>(false)

  const nextTurn = currentTurn === 1 ? -1 : 1
  const movablePosCount = {
    black: 0,
    white: 0,
  }
  const stoneCount = {
    black: 0,
    white: 0,
    empty: 0,
  }

  board.forEach((y) => {
    y.forEach((x) => {
      if (x === 0) stoneCount.empty++
      if (x === 1) stoneCount.black++
      if (x === -1) stoneCount.white++
    })
  })

  // 黒が置けるマスをカウント
  getMovablePos(board, 1).forEach((y) => {
    y.forEach((x) => {
      if (x) movablePosCount.black++
    })
  })

  // 白が置けるマスをカウント
  getMovablePos(board, -1).forEach((y) => {
    y.forEach((x) => {
      if (x) movablePosCount.white++
    })
  })

  // 終了判定
  if (
    !finishFlag &&
    (stoneCount.empty === 0 || (movablePosCount.black === 0 && movablePosCount.white === 0))
  ) {
    setFinishFlag(true)
    setModalShow(true)
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
      <FinishModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        playerStoneCount={playerStone === 1 ? stoneCount.black : stoneCount.white}
        cpuStoneCount={playerStone === 1 ? stoneCount.white : stoneCount.black}
      />
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
