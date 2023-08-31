import { atom } from "recoil";

//--- Declare a type of authModalState atom
type AuthModalState = {
  isOpen: boolean,
  type: "login" | "register" | "forgetPassword",
};

//--- Declare an InitialAuthModalState
const initialAuthModalState: AuthModalState = {
  isOpen: false,
  type: "login"
};

//--- Export the initialAuthModalState variable as an atom
export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: initialAuthModalState
});

