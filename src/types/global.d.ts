/* 0:空, -1:白, 1:黒, 2:壁 */
export type SquareState = 0 | -1 | 1 | 2

export type BoardType = SquareState[][]

/* 最初のターン - 1: 自分, -1: 相手 */
export type Turn = 1 | -1
