import React, { useState } from 'react'
import { Stone } from '@/types/global'
import { playerSlice, boardSlice, useAppDispatch, AppDispatch } from '@/modules'
import { getInitialBoard } from '@/scripts/functions'
import { Button, Form, InputGroup, Offcanvas } from 'react-bootstrap'
import { css } from '@emotion/react'

export const Setting: React.FC = React.memo(() => {
  const dispatch: AppDispatch = useAppDispatch()
  const { setBoardSize, setBoard } = boardSlice.actions
  const { setPlayerStone, setNextTurn } = playerSlice.actions

  const [offCanvasShow, setOffCanvasShow] = useState<boolean>(false)
  const [errorFlag, setErrorFlag] = useState<boolean>(false)
  const [size, setSize] = useState<number>(8)

  let playerStone: Stone = 1

  const handleClick = () => {
    dispatch(setPlayerStone(playerStone))
    dispatch(setNextTurn(1))
    dispatch(setBoardSize(size))
    dispatch(setBoard(getInitialBoard(size)))
  }

  return (
    <div
      css={css`
        display: inline-block;
      `}
    >
      <Button
        variant='secondary'
        size='sm'
        onClick={() => setOffCanvasShow(true)}
        css={css`
          vertical-align: bottom;
        `}
      >
        Settings
      </Button>
      <Offcanvas show={offCanvasShow} onHide={() => setOffCanvasShow(false)} css={{ width: 300 }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form.Group>
            <Form.Label>Player Color</Form.Label>
            <div>
              <Form.Check
                type='radio'
                name='stone'
                id='Black'
                label='Black'
                value='Black'
                inline
                defaultChecked
                onChange={() => {
                  playerStone = 1
                }}
              />
              <Form.Check
                type='radio'
                name='stone'
                id='White'
                label='White'
                value='White'
                inline
                onChange={() => {
                  playerStone = -1
                }}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Board Size 4~30 (Default: 8)</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type='number'
                value={size}
                placeholder='ボードサイズを入力（偶数）'
                size='sm'
                isInvalid={errorFlag}
                css={nonAppearance}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setSize(value)
                  if (value % 2 === 1 || value < 4 || value > 30) {
                    setErrorFlag(true)
                  } else {
                    setErrorFlag(false)
                  }
                }}
              />
              <Button
                variant='outline-secondary'
                disabled={size <= 4}
                onClick={() => {
                  const nextSize = size - 2
                  setSize(nextSize)
                  if (nextSize < 4) setErrorFlag(true)
                  else setErrorFlag(false)
                }}
              >
                -
              </Button>
              <Button
                variant='outline-secondary'
                disabled={size >= 30}
                onClick={() => {
                  const nextSize = size + 2
                  setSize(nextSize)
                  if (nextSize > 30) setErrorFlag(true)
                  else setErrorFlag(false)
                }}
              >
                +
              </Button>
              <Form.Control.Feedback type='invalid'>
                4以上、30以下の偶数を入力してください
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div css={buttonOuter}>
            <Button
              variant='primary'
              onClick={() => {
                if (!errorFlag) {
                  handleClick()
                  setOffCanvasShow(false)
                }
              }}
              css={{ width: 100 }}
            >
              Start
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
})
Setting.displayName = `Setting`

const buttonOuter = css`
  margin-top: 20px;
  text-align: center;
`

const nonAppearance = css`
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
