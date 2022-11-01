import create from "zustand";

export interface AppStore {
  sidebarHidden?: boolean;
  setSidebarHidden: (isHidden: boolean) => void;
  toggleSidebarHidden: () => void;
}

const useApp = create<AppStore>((set, get) => ({
  sidebarHidden: false,
  setSidebarHidden: (isHidden: boolean) => {
    set((state) => ({
      ...state,
      sidebarHidden: isHidden,
    }));
  },
  toggleSidebarHidden: () => {
    set((state) => ({
      ...state,
      sidebarHidden: !state.sidebarHidden,
    }));
  },
}));

export default useApp;
