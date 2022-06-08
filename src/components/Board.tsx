import React from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import { BoardType, Stone } from '@/types/global'
import { getFlippedBoard, getMovableDir, getMovablePos } from '@/scripts/functions'
import { boardSlice, playerSlice, useAppDispatch, useAppSelector } from '@/modules'

export type BoardProps = {
  currentTurn: Stone
  board: BoardType
}

export const Board: React.FC<BoardProps> = ({ board }) => {
  console.log('render Board')
  const dispatch = useAppDispatch()
  const { setCurrentTurn } = playerSlice.actions
  const { setBoard } = boardSlice.actions
  const boardSize = useAppSelector((state) => state.board.boardSize)
  const currentTurn = useAppSelector((state) => state.player.currentTurn)

  const sizes = ['0', ...Array(boardSize).fill('50px'), '0'].join(' ')
  const areas = board.map((y, yIdx) => `"${y.map((x, xIdx) => `area${xIdx}_${yIdx}`).join(' ')}"`).join('\n')

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

  const handleClick = (y: number, x: number) => {
    const nextTurn: Stone = currentTurn === 1 ? -1 : 1
    if (getMovablePos(board, currentTurn)[y][x]) {
      const newBoard = [
        ...getFlippedBoard({
          board,
          x,
          y,
          dir: getMovableDir(board, currentTurn)[y][x],
          currentTurn,
        }),
      ]
      dispatch(setBoard([...newBoard]))
      dispatch(setCurrentTurn(nextTurn))
    }
  }

  return (
    <>
      currentTurn: {currentTurn}
      <StyledGridContainer columns={sizes} rows={sizes} areas={areas}>
        {items}
      </StyledGridContainer>
    </>
  )
}
Board.displayName = 'Board'

const StyledGridContainer = styled.div<{
  columns: string
  rows: string
  areas: string
}>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  grid-template-rows: ${({ rows }) => rows};
  grid-template-areas: ${({ areas }) => areas};
`

const StyledGridItem = styled.div<{
  area: string
}>`
  grid-area: ${({ area }) => area};
`
