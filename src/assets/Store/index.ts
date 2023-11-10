import { KanasType, kanas } from "../../Constants"
import { create } from "zustand"
import { Nullable } from "../shared/types"
import { subscribeWithSelector } from "zustand/middleware"

type GameMode = "hiragana" | 'katakana'

interface GameStore {
    level: Nullable<Array<KanasType[]>>
    currentKana: Nullable<KanasType>
    currentStage: number
    mode: GameMode
    state: GameState
    wrongAnswers: number
    startGame: ({mode}: {mode: GameMode})=> void
    nextStage: ()=> void
    kanaTouched: (kana: KanasType)=> void
}

export enum GameState  {
    MENU= "Menu",
    GAME= "Game",
    GAME_OVER= "GameOver",
}

export const playAudio = (path:string)=>{
    const audio = new Audio(`./sounds/${path}.mp3`)
    audio.play()
}

export const generateGameLevel = ({stageNum}: {stageNum: number}) => {
    const level:Array<KanasType[]> = []

    for (let i=0;i<stageNum; i+=1){
        const stage: KanasType [] = []
        const optionNum = 3 + i
        for(let j=0; j < optionNum; j+=1){
            let kana = null
            while(!kana || stage.includes(kana) ){
                kana = kanas[Math.floor(Math.random() * kanas.length)]
            }
            stage.push(kana)
        }
        stage[Math.floor(Math.random() * stage.length)].correct = true
        level.push(stage)
    }
    return level
}

export const useGameStore = create(subscribeWithSelector<GameStore>((set, get)=> ({
    level: null,
    currentStage: 0,
    currentKana: null,
    mode: "hiragana",
    state: GameState.MENU,
    wrongAnswers: 0,
    startGame: ({mode})=>{
        const level = generateGameLevel({stageNum: 5})
        const currentKana = level[0].find((k)=> k.correct)
        playAudio(`kanas/${currentKana?.name}`)
        set({level, currentKana, state: GameState.GAME, mode})
    },
    nextStage: ()=>{
        set((state)=>{
            if(state.level){
                const nextStage = state.currentStage + 1
                const nextKana = state.level[nextStage].find((kana)=>kana.correct)
                return { currentStage: nextStage, currentKana: nextKana}
            }
            return state

        })
    },
    kanaTouched: (kana): void =>{
        const currentKana = get().currentKana
        if(kana.name === currentKana?.name) {
            get().nextStage()
        } else {
            playAudio(`kanas/${currentKana?.name}`)
            set((state)=> ({wrongAnswers: state.wrongAnswers + 1}))
        }
    }
})))