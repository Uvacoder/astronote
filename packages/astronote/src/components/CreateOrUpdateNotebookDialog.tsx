import { FC, useCallback, useEffect } from "react";
import InputField from "./common/InputField";
import SubmitButton from "./common/SubmitButton";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateNotebookInputs } from "../types/forms";
import { FiSmile, FiX } from "react-icons/fi";
import EmojiPicker from "./EmojiPicker";
import { useNavigate } from "@tanstack/react-location";
import useNotebooks from "../store/useNotebooks";
import { useDialogs } from "../contexts/dialogContext";
import Notebook from "../types/notebook";

export interface CreateNotebookDialogProps {
  type: "create";
  workspaceId: string;
  parentId?: string;
}
export interface UpdateNotebookDialogProps {
  type: "update";
  notebook: Notebook;
}

const createNotebookSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Notebook Name"),
  })
  .required();

const CreateOrUpdateNotebookDialog: FC<
  CreateNotebookDialogProps | UpdateNotebookDialogProps
> = (props) => {
  const navigate = useNavigate();
  const createNotebook = useNotebooks((state) => state.createNotebook);
  const updateNotebook = useNotebooks((state) => state.updateNotebook);
  const dialog = useDialogs();

  const form = useForm<CreateNotebookInputs>({
    resolver: yupResolver(createNotebookSchema),
  });

  const onSubmit = useCallback(
    async (value: CreateNotebookInputs) => {
      if (props.type === "create") {
        const { workspaceId, parentId } = props;
        const notebook = await createNotebook({
          ...value,
          workspaceId,
          parentId,
        });
        navigate({
          to: `/${workspaceId}/notebooks/${notebook.id}`,
        });
      } else {
        const { notebook } = props;
        await updateNotebook(notebook.id, value);
      }
      form.reset();
      dialog.closeAllDialogs();
    },
    [props, navigate, createNotebook, updateNotebook, dialog]
  );

  useEffect(() => {
    if (props.type === "update") {
      form.setValue("name", props.notebook.name);
      form.setValue("emoji", props.notebook.emoji);
      form.setValue("description", props.notebook.description);
    }
  }, [props]);

  return (
    <form className="w-92 block p-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                onClick={() => form.setValue("emoji", null)}
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
        {props.type === "create" ? "Create Notebook" : "Update Notebook"}
      </SubmitButton>
    </form>
  );
};

export default CreateOrUpdateNotebookDialog;
