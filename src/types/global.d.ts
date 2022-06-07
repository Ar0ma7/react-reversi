/* 0:空, -1:白, 1:黒, 2:壁 */
export type SquareState = 0 | -1 | 1 | 2

export type BoardType = SquareState[][]

/* 1: 黒, -1: 白 */
export type Stone = 1 | -1