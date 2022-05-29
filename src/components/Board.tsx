import React from 'react'
import { Square } from '@/components/Square'
import styled from '@emotion/styled'
import SquareState from '@/types/SquareState'

type BoardProps = {
  squares: SquareState[][]
  size: number
}

export const Board: React.FC<BoardProps> = ({ squares, size }) => {
  const items = squares.map((row, rowIdx) =>
    row.map((col, colIdx) => {
      const areaName = `area${rowIdx}_${colIdx}`
      return (
        <StyledGridItem key={areaName} area={areaName}>
          <Square state={col} />
        </StyledGridItem>
      )
    }),
  )

  const sizes = [...Array(size + 2)].fill('50px')

  return (
    <StyledGridContainer columns={sizes} rows={sizes} areas={squares.map((r, i) => r.map((c, j) => `area${i}_${j}`))}>
      {items}
    </StyledGridContainer>
  )
}

const StyledGridContainer = styled.div<{
  columns: string[]
  rows: string[]
  areas: string[][]
}>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns.join(' ')};
  grid-template-rows: ${({ rows }) => rows.join(' ')};
  grid-template-areas: ${({ areas }) => areas.map((r) => `"${r.join(' ')}"`).join('\n')};
`

const StyledGridItem = styled.div<{
  area: string
}>`
  grid-area: ${({ area }) => area};
`
