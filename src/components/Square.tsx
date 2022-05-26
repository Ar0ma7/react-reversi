import React from 'react'
import { css } from '@emotion/react'
import SquareState from '@/types/SquareState'

export type SquareProps = {
  state: SquareState
}

export const Square: React.FC<SquareProps> = ({ state }) => {
  return <div css={squareStyle}>{state}</div>
}

const squareStyle = css`
  border: 1px solid #000;
  width: 50px;
  height: 50px;
`
