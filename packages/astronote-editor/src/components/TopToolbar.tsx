import { useActive, useChainedCommands, useCommands } from "@remirror/react";
import {
  MdUndo,
  MdRedo,
  MdContentCut,
  MdContentCopy,
  MdContentPaste,
  MdVideocam,
} from "react-icons/md";
import { FC, forwardRef, PropsWithChildren } from "react";
import clsx from "clsx";

export const TopToolbar: FC = () => {
  const commands = useCommands();
  const active = useActive();
  const chain = useChainedCommands();

  return (
    <div className="flex h-12 items-center gap-4 border-b border-gray-100 px-4 dark:border-gray-800">
      <ButtonGroup>
        <IconButton
          onClick={() => {
            commands.undo();
            commands.focus();
          }}
          disabled={commands.undo.enabled() === false}
        >
          <MdUndo />
        </IconButton>
        <IconButton
          onClick={() => {
            commands.redo();
            commands.focus();
          }}
          disabled={commands.redo.enabled() === false}
        >
          <MdRedo />
        </IconButton>
      </ButtonGroup>
      <ButtonGroup>
        <IconButton
          onClick={() => {
            chain.copy().focus().run();
          }}
          disabled={commands.copy.enabled() === false}
        >
          <MdContentCopy />
        </IconButton>
        <IconButton
          onClick={() => {
            chain.cut().focus().run();
          }}
          disabled={commands.cut.enabled() === false}
        >
          <MdContentCut />
        </IconButton>
        <IconButton
          onClick={() => {
            chain.paste().focus().run();
          }}
          disabled={commands.paste.enabled() === false}
        >
          <MdContentPaste />
        </IconButton>
      </ButtonGroup>
      <ButtonGroup>
        <IconButton
          onClick={() => {
            chain
              .toggleHeading({
                level: 1,
              })
              .focus()
              .run();
          }}
          disabled={commands.toggleHeading.enabled({ level: 1 }) === false}
          active={active.heading({ level: 1 })}
        >
          h1
        </IconButton>
        <IconButton
          onClick={() => {
            chain
              .toggleHeading({
                level: 2,
              })
              .focus()
              .run();
          }}
          disabled={commands.toggleHeading.enabled({ level: 2 }) === false}
          active={active.heading({ level: 2 })}
        >
          h2
        </IconButton>
        <IconButton
          onClick={() => {
            chain
              .toggleHeading({
                level: 3,
              })
              .focus()
              .run();
          }}
          disabled={commands.toggleHeading.enabled({ level: 3 }) === false}
          active={active.heading({ level: 3 })}
        >
          h3
        </IconButton>
      </ButtonGroup>
      <ButtonGroup>
        <IconButton
          onClick={() => {
            chain
              .addYouTubeVideo({
                video: "https://www.youtube.com/watch?v=XhUAIVJ62dQ",
              })
              .focus()
              .run();
          }}
          disabled={commands.toggleHeading.enabled({ level: 3 }) === false}
          active={active.heading({ level: 3 })}
        >
          <MdVideocam />
        </IconButton>
      </ButtonGroup>
    </div>
  );
};

interface IconButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { ref: _, active, disabled, className, ...rest } = props;
    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled}
        className={clsx("flex h-9 w-9 items-center justify-center text-xl", {
          "bg-gray-200 dark:bg-gray-700": active && !disabled,
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50":
            !active && !disabled,
          "text-gray-300 dark:text-gray-600": disabled,
        })}
      />
    );
  }
);

const ButtonGroup: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex items-center overflow-hidden rounded-md border border-gray-100 dark:border-gray-800">
      {children}
    </div>
  );
};
