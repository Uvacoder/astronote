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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceAsync } from "../api/workspaceApi";

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
  const createWorkspaceMut = useMutation(createWorkspaceAsync);
  const queryClient = useQueryClient();
  const color = form.watch("color");

  const onSubmit = useCallback(
    async (value: CreateWorkspaceInputs) => {
      await createWorkspaceMut.mutateAsync(value);
      queryClient.invalidateQueries(["workspaces"]);
      setOpen(false);
    },
    [createWorkspaceMut]
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 fixed left-1/2 top-20 shadow-2xl rounded-xl max-w-[380px] w-screen -translate-x-1/2">
          <header className="px-4 h-14 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 w-full">
            <Dialog.Title className="text-lg font-medium flex-1 truncate">
              Create Workspace
            </Dialog.Title>
            <Dialog.Close className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xl w-8 h-8 rounded-md">
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
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="text-gray-600 dark:text-gray-300 mb-2 inline-block">
                  Color
                </label>
                <ColorPicker
                  color={color}
                  onChange={(c) => form.setValue("color", c)}
                >
                  <button className="w-full h-10 rounded-md bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 border text-left px-2 flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md"
                      style={{
                        backgroundColor: color,
                      }}
                    ></div>
                    <p>{color}</p>
                  </button>
                </ColorPicker>
              </div>
              <div className="flex-1">
                <label className="text-gray-600 dark:text-gray-300 mb-2 inline-block">
                  Emoji
                </label>
                <div className="relative">
                  <EmojiPicker
                    onSelect={(emoji) => {
                      if (emoji) form.setValue("emoji", emoji.emoji);
                    }}
                  >
                    <button className="w-full h-10 rounded-md bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 border text-left px-2 text-2xl">
                      {form.watch("emoji") || <FiSmile />}
                    </button>
                  </EmojiPicker>
                  {form.watch("emoji") && (
                    <button
                      className="absolute top-1/2 right-2 -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
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
