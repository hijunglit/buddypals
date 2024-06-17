import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

interface IAuthState {
  user: {
    username: string;
    id: string;
    profileImage?: string;
    thumbnailImage?: string;
    social: boolean;
    intro: string;
  } | null;
  isAuthenticated: boolean;
}

const { persistAtom } = recoilPersist({
  key: "authState",
  storage: localStorage,
});

export const authAtom = atom<IAuthState>({
  key: "authState",
  default: {
    user: null,
    isAuthenticated: false,
  },
  effects_UNSTABLE: [persistAtom],
});
