import React from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

export type FinishModalProps = {
  show: boolean
  onHide: () => void
  playerStoneCount: number
  cpuStoneCount: number
}

export const FinishModal: React.FC<FinishModalProps> = React.memo(
  ({ show, onHide, playerStoneCount, cpuStoneCount, ...props }) => {
    const isDraw: boolean = playerStoneCount === cpuStoneCount
    const isWin: boolean = playerStoneCount > cpuStoneCount
    return (
      <Modal show={show} size='sm' centered>
        <Modal.Header closeButton>
          <Modal.Title>{isDraw ? 'Draw' : isWin ? 'You Win' : 'You Lose'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Player: {playerStoneCount}</p>
          <p>CPU: {cpuStoneCount}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  },
)
FinishModal.displayName = `FinishModal`
