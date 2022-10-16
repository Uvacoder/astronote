import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import * as DialogPremitives from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";
import IconButton from "../components/common/button/icon-button";

export interface Dialog {
  title: string;
  content: ReactNode;
}

export interface DialogsContext {
  isShowing: boolean;
  closeAllDialogs: () => void;
  showDialog: (props: Dialog) => Promise<void>;
}

export const dialogsContext = createContext<DialogsContext | null>(null);

const DialogsProvider: FC<PropsWithChildren> = (props) => {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);

  const showDialog: DialogsContext["showDialog"] = useCallback(
    async (dialog) => {
      setDialogs((dialogs) => [...dialogs, dialog]);
    },
    [setDialogs]
  );

  const closeAllDialogs = useCallback(() => {
    setDialogs([]);
  }, [setDialogs]);

  return (
    <dialogsContext.Provider
      value={{
        showDialog,
        isShowing: !!alert,
        closeAllDialogs,
      }}
    >
      {props.children}
      {dialogs.map((dialog, i) => (
        <DialogPremitives.Root
          onOpenChange={(open) => {
            if (!open) {
              setDialogs((dialogs) => dialogs.filter((_, j) => j !== i));
            }
          }}
          defaultOpen
        >
          <DialogPremitives.Portal>
            <DialogPremitives.Overlay className="fixed inset-0 z-30 bg-black/50" />
            <DialogPremitives.Content className="fixed left-1/2 top-24 z-40 -translate-x-1/2 rounded-xl border border-gray-200 bg-white shadow-2xl shadow-black/50 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-200 py-2 pl-4 pr-2 dark:border-gray-700">
                <DialogPremitives.Title className="flex-1 text-xl font-medium">
                  {dialog.title}
                </DialogPremitives.Title>
                <DialogPremitives.Close asChild>
                  <IconButton>
                    <FiX />
                  </IconButton>
                </DialogPremitives.Close>
              </div>
              {dialog.content}
            </DialogPremitives.Content>
          </DialogPremitives.Portal>
        </DialogPremitives.Root>
      ))}
    </dialogsContext.Provider>
  );
};

export default DialogsProvider;

export function useDialogs() {
  const context = useContext(dialogsContext);

  if (!context) {
    throw "useAlert must use inside AlertProvider";
  }

  return context;
}
