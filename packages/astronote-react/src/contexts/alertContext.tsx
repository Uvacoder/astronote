import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "../components/common/button/button";

export interface Alert {
  title: string;
  message?: string;
  actions?: {
    label?: string;
    onClick?: () => void;
    style: "default" | "cancel" | "destructive";
  }[];
}

export interface AlertContext {
  isShowing: boolean;
  closeAlert: () => void;
  showAlert: (props: Alert) => Promise<void>;
}

export const alertContext = createContext<AlertContext | null>(null);

const AlertProvider: FC<PropsWithChildren> = (props) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert: AlertContext["showAlert"] = useCallback(async (alert) => {
    setAlert(alert);
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);
  return (
    <alertContext.Provider
      value={{
        showAlert,
        isShowing: !!alert,
        closeAlert,
      }}
    >
      {props.children}
      <AlertDialog.Root
        open={!!alert}
        onOpenChange={(open) => {
          if (!open) setAlert(null);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-30 bg-black/50" />
          <AlertDialog.Content className="fixed left-1/2 top-20 z-40 w-full max-w-md -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <AlertDialog.Title className="w-full pb-2 text-xl font-medium">
              {alert?.title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mb-4 text-gray-600 dark:text-gray-300">
              {alert?.message}
            </AlertDialog.Description>
            <div className="flex w-full items-center justify-end gap-2">
              {alert?.actions ? (
                alert.actions.map((action) => {
                  switch (action.style) {
                    case "cancel":
                      return (
                        <AlertDialog.Cancel asChild>
                          <Button
                            colorScheme="secondary"
                            onClick={action.onClick}
                          >
                            {action.label || "Cancel"}
                          </Button>
                        </AlertDialog.Cancel>
                      );
                    case "default":
                      return (
                        <AlertDialog.Action asChild>
                          <Button
                            colorScheme="primary"
                            onClick={action.onClick}
                          >
                            {action.label}
                          </Button>
                        </AlertDialog.Action>
                      );
                    case "destructive":
                      return (
                        <AlertDialog.Action asChild>
                          <Button colorScheme="danger" onClick={action.onClick}>
                            {action.label}
                          </Button>
                        </AlertDialog.Action>
                      );
                  }
                })
              ) : (
                <AlertDialog.Cancel className="rounded-md bg-gray-100 px-4 py-1.5 font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                  Ok
                </AlertDialog.Cancel>
              )}
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </alertContext.Provider>
  );
};

export default AlertProvider;

export function useAlert() {
  const context = useContext(alertContext);

  if (!context) {
    throw "useAlert must use inside AlertProvider";
  }

  return context;
}
