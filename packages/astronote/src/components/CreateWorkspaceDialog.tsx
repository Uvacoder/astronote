import { FC, ReactNode, useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import InputField from "./common/InputField";
import SubmitButton from "./common/SubmitButton";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateWorkspaceInputs } from "../types/forms";
import { FiSmile, FiX } from "react-icons/fi";
import EmojiPicker from "./EmojiPicker";
import ColorPicker from "./ColorPicker";
import useWroksapces from "../store/useWorkspaces";
import { useNavigate } from "@tanstack/react-location";

interface CreateWorkspaceDialogProps {
  children: ReactNode;
}

const createWorkspaceSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Workspace Name"),
    emoji: yup.string().notRequired().label("Emoji"),
    color: yup.string().notRequired().label("Color"),
  })
  .required();

const CreateWorkspaceDialog: FC<CreateWorkspaceDialogProps> = (props) => {
  const { children } = props;
  const [open, setOpen] = useState(false);

  const form = useForm<CreateWorkspaceInputs>({
    resolver: yupResolver(createWorkspaceSchema),
    defaultValues: {
      color: "#6366f1",
    },
  });
  const addWorkspace = useWroksapces((state) => state.createWrokspace);
  const navigate = useNavigate();
  const color = form.watch("color");

  const onSubmit = useCallback(
    async (value: CreateWorkspaceInputs) => {
      const worksapce = await addWorkspace(value);
      setOpen(false);
      form.reset();
      navigate({
        to: `/${worksapce.id}`,
      });
    },
    [addWorkspace, navigate]
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        form.reset();
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-20 z-40 w-screen max-w-[380px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <header className="flex h-14 w-full items-center gap-2 border-b border-gray-100 px-4 dark:border-gray-800">
            <Dialog.Title className="flex-1 truncate text-lg font-medium">
              Create Workspace
            </Dialog.Title>
            <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiX />
            </Dialog.Close>
          </header>
          <form className="p-4" onSubmit={form.handleSubmit(onSubmit)}>
            <InputField
              label="Workspace Name"
              placeholder="My Workspace"
              {...form.register("name")}
              errorText={form.formState.errors.name?.message}
              autoFocus
            />
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label className="mb-2 inline-block text-gray-600 dark:text-gray-300">
                  Color
                </label>
                <ColorPicker
                  color={color}
                  onChange={(c) => form.setValue("color", c)}
                >
                  <button className="flex h-10 w-full items-center gap-2 rounded-md border border-gray-100 bg-gray-50 px-2 text-left dark:border-gray-700 dark:bg-gray-800">
                    <div
                      className="h-6 w-6 rounded-md"
                      style={{
                        backgroundColor: color,
                      }}
                    ></div>
                    <p>{color}</p>
                  </button>
                </ColorPicker>
              </div>
              <div className="flex-1">
                <label className="mb-2 inline-block text-gray-600 dark:text-gray-300">
                  Emoji
                </label>
                <div className="relative">
                  <EmojiPicker
                    onSelect={(emoji) => {
                      if (emoji) form.setValue("emoji", emoji.emoji);
                    }}
                  >
                    <button className="h-10 w-full rounded-md border border-gray-100 bg-gray-50 px-2 text-left text-2xl dark:border-gray-700 dark:bg-gray-800">
                      {form.watch("emoji") || <FiSmile />}
                    </button>
                  </EmojiPicker>
                  {form.watch("emoji") && (
                    <button
                      className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => form.setValue("emoji", undefined)}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <SubmitButton
              loading={form.formState.isSubmitting}
              className="mb-0 w-full text-center"
            >
              Create Workspace
            </SubmitButton>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateWorkspaceDialog;
