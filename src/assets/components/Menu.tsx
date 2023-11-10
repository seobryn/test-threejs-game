import { GameState, useGameStore } from "../Store"

export const Menu = () => {
    const { startGame, state } = useGameStore(({ startGame, state }) => ({ startGame, state }))

    return (
        <div className={`menu ${state !== GameState.MENU ? 'menu--hidden' : ''}`}>
            <h1>Kana game</h1>
            <button disabled={state !== GameState.MENU} onClick={() => startGame({ mode: 'hiragana' })}>Start hiragana game</button>
            <button disabled={state !== GameState.MENU} onClick={() => startGame({ mode: 'katakana' })}>Start katakana game</button>
        </div>
    )
}