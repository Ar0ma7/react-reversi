import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardType, Stone } from '@/types/global'
import { getInitialBoard } from '@/scripts/functions'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

type PlayerState = {
  playerStone: Stone
  currentTurn: Stone
}

const playerInitialState: PlayerState = {
  playerStone: 1,
  currentTurn: 1,
}

export const playerSlice = createSlice({
  name: 'player',
  initialState: playerInitialState,
  reducers: {
    setPlayerStone(state, action: PayloadAction<Stone>) {
      state.playerStone = action.payload
    },
    setNextTurn(state, action: PayloadAction<Stone>) {
      state.currentTurn = action.payload
    },
  },
})

type BoardState = {
  boardSize: number
  board: BoardType
}

const boardInitialState: BoardState = {
  boardSize: 8,
  board: getInitialBoard(8),
}

export const boardSlice = createSlice({
  name: 'board',
  initialState: boardInitialState,
  reducers: {
    setBoardSize(state, action: PayloadAction<number>) {
      state.boardSize = action.payload
    },
    setBoard(state, action: PayloadAction<BoardType>) {
      state.board = [...action.payload]
    },
  },
})

export const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    player: playerSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
