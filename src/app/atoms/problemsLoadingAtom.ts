import { atom } from "recoil"


//--- Declare a type of authModalState atom
type problemsLoadingStateType = {
  loadingProblems: boolean
}

//--- Declare an InitialAuthModalState
const initialProblemsLoadingState: problemsLoadingStateType = {
  loadingProblems: true
}

export const problemLoadingState = atom<problemsLoadingStateType>({
  key: "problemsLoadingState",
  default: initialProblemsLoadingState
})