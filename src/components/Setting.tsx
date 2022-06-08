import React from 'react'
import { Stone } from '@/types/global'
import { playerSlice, boardSlice, useAppDispatch, AppDispatch } from '@/modules'
import { getInitialBoard } from '@/scripts/functions'

export const Setting: React.FC = React.memo(() => {
  console.log('render Setting')
  const dispatch: AppDispatch = useAppDispatch()
  const { setBoardSize, setBoard } = boardSlice.actions
  const { setPlayerStone, setCurrentTurn } = playerSlice.actions
  let playerStone: Stone = 1
  let boardSize: number = 8

  const handleChange = (value: string): void => {
    const size = Number(value)
    if (size % 2 === 0) {
      boardSize = size
    }
  }

  const handleClick = () => {
    dispatch(setPlayerStone(playerStone))
    dispatch(setCurrentTurn(playerStone))
    dispatch(setBoardSize(boardSize))
    dispatch(setBoard(getInitialBoard(boardSize)))
  }

  return (
    <div>
      <label>
        <input
          type='radio'
          name='stone'
          value='Black'
          defaultChecked
          onChange={() => {
            playerStone = 1
          }}
        />
        Black
      </label>
      <label>
        <input
          type='radio'
          name='stone'
          value='White'
          onChange={() => {
            playerStone = -1
          }}
        />
        White
      </label>
      <input type='number' name='size' id='' defaultValue={boardSize} onChange={(e) => handleChange(e.target.value)} />
      <button
        onClick={() => {
          handleClick()
        }}
      >
        Start
      </button>
    </div>
  )
})
Setting.displayName = `Setting`
