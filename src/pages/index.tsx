import React, { useState } from 'react'
import { Board } from '@/components/Board'
import { Setting } from '@/components/Setting'
import { AppDispatch, boardSlice, playerSlice, useAppDispatch, useAppSelector } from '@/modules'
import { BoardType, Stone } from '@/types/global'
import { getCpuFlippedBoard, getMovablePos } from '@/scripts/functions'
import { css } from '@emotion/react'
import { FinishModal } from '@/components/FinishModal'
import styled from '@emotion/styled'
import { Spinner } from 'react-bootstrap'

export default function Home() {
  const dispatch: AppDispatch = useAppDispatch()
  const { setNextTurn } = playerSlice.actions
  const { setBoard } = boardSlice.actions
  const playerStone: Stone = useAppSelector((state) => state.player.playerStone)
  const currentTurn: Stone = useAppSelector((state) => state.player.currentTurn)
  const board: BoardType = useAppSelector((state) => state.board.board)

  const [finishFlag, setFinishFlag] = useState<boolean>(false)
  const [modalShow, setModalShow] = useState<boolean>(false)

  const playerName = new Map([
    [playerStone, 'Player'],
    [-playerStone, 'CPU'],
  ])
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

  let skipFlag: boolean = false

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
      skipFlag = true
      setTimeout(() => {
        skipFlag = false
        dispatch(setNextTurn(nextTurn))
      }, 1500)
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
      Current Turn:{' '}
      <StyledPlayerName currentTurn={currentTurn}>{playerName.get(currentTurn)}</StyledPlayerName>
      {currentTurn !== playerStone && <Spinner animation='border' size='sm' />}
      <div css={boardOuter}>
        <Board currentTurn={currentTurn} board={board} />
        {skipFlag && (
          <div css={boardOverlay}>
            <div css={overlayBody}>
              <p css={overlayTitle}>{playerName.get(currentTurn)} Turn Skip!</p>
              <p css={{ fontSize: 32 }}>{playerName.get(-currentTurn)} Turn &gt;&gt;</p>
            </div>
          </div>
        )}
      </div>
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

const StyledPlayerName = styled.span<{
  currentTurn: Stone
}>`
  display: inline-block;
  border: 1px solid #000;
  border-radius: 5px;
  margin-right: 10px;
  padding: 2px 10px 4px;
  line-height: 1;
  ${(props) => {
    if (props.currentTurn === 1) {
      return css`
        background-color: #000;
        color: #fff;
      `
    } else {
      return css`
        background-color: #fff;
        color: #000;
      `
    }
  }}
`

const boardOuter = css`
  width: 700px;
  height: 700px;
  position: relative;
`

const boardOverlay = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const overlayBody = css`
  text-align: center;
  font-style: italic;
`

const overlayTitle = css`
  font-size: 64px;
  font-weight: bold;
`
