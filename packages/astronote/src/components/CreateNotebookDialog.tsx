import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import InputField from "./common/InputField";
import SubmitButton from "./common/SubmitButton";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateNotebookInputs } from "../types/forms";
import { FiSmile, FiX } from "react-icons/fi";
import EmojiPicker from "./EmojiPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotebookAsync } from "../api/notebookApi";

interface CreateNotebookDialogProps {
  children: ReactNode;
  parentId?: string;
  workspaceId: string;
}

const createNotebookSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Notebook Name"),
  })
  .required();

const CreateNotebookDialog: FC<CreateNotebookDialogProps> = (props) => {
  const { children, parentId, workspaceId } = props;
  const [open, setOpen] = useState(false);

  const form = useForm<CreateNotebookInputs>({
    resolver: yupResolver(createNotebookSchema),
  });

  const createNotebookMut = useMutation(createNotebookAsync);
  const queryClient = useQueryClient();

  const onSubmit = useCallback(
    async (value: CreateNotebookInputs) => {
      await createNotebookMut.mutateAsync({
        ...value,
        workspaceId,
        parentId,
      });
      queryClient.invalidateQueries(["notebooks", workspaceId]);
      setOpen(false);
    },
    [createNotebookMut, workspaceId, parentId]
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
        <Dialog.Content className="fixed left-1/2 top-20 w-screen max-w-[380px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <header className="flex h-14 w-full items-center gap-2 border-b border-gray-100 px-4 dark:border-gray-800">
            <Dialog.Title className="flex-1 truncate text-lg font-medium">
              Create Notebook
            </Dialog.Title>
            <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiX />
            </Dialog.Close>
          </header>
          <form className="p-4" onSubmit={form.handleSubmit(onSubmit)}>
            <InputField
              label="Notebook Name"
              placeholder="My Notebook"
              {...form.register("name")}
              errorText={form.formState.errors.name?.message}
              autoFocus
            />
            <div className="mb-4 flex gap-4">
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
                    <button className="flex h-10 w-full items-center gap-2 rounded-md border border-gray-100 bg-gray-50 px-2 text-left dark:border-gray-700 dark:bg-gray-800">
                      <span className="text-2xl">
                        {form.watch("emoji") || <FiSmile />}
                      </span>
                      <p>Pick Emoji</p>
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
              Create Notebook
            </SubmitButton>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateNotebookDialog;
