import { atom } from "recoil";

export const currentTrackIdState = atom({
    key: "currentTrackIdState",
    default: null
})

export const IsPlayingState = atom({
    key: "isPlayingState",
    default: false
})