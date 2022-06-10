import React from 'react'
import { css } from '@emotion/react'
import { SquareState } from '@/types/global'
import styled from '@emotion/styled'

export type SquareProps = {
  state: SquareState
  size: string
}

export const Square: React.FC<SquareProps> = React.memo(({ state, size }) => {
  return (
    <>
      {state !== 2 && (
        <StyledSquare state={state} size={size}>
          <StyledStone state={state} />
        </StyledSquare>
      )}
    </>
  )
})
Square.displayName = `Square`

const StyledSquare = styled.div<{
  state: SquareState
  size: string
}>`
  ${(props) =>
    props.state !== 2 &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #000;
      width: ${props.size};
      height: ${props.size};
      background-color: green;
    `}
`

const stoneColor = new Map([
  [1, '#000'],
  [-1, '#fff'],
  [0, 'transparent'],
])

const StyledStone = styled.div<{
  state: SquareState
}>`
  border-radius: 50%;
  width: 90%;
  height: 90%;
  background-color: ${(props) => stoneColor.get(props.state)};
`
