enum GameStage {
  Semaphore,
  Game,
  Processing,
  Finished,
  Idle
}
export default GameStage

export type StageMap<A> = { [S in GameStage]: A }
