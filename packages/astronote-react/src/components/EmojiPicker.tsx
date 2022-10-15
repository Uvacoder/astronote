import * as Popover from "@radix-ui/react-popover";
import EmojiPickerReact, { EmojiClickData, Theme } from "emoji-picker-react";
import { ReactNode, FC, useState } from "react";
import { useTheme, ColorMode } from "../contexts/themeContext";

export interface EmojiPickerProps {
  children: ReactNode;
  onSelect?: (value?: EmojiClickData) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const { children, onSelect } = props;
  const { mode } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} className="z-40">
          <EmojiPickerReact
            autoFocusSearch
            width={320}
            height={420}
            theme={
              mode === ColorMode.Auto
                ? Theme.AUTO
                : mode === ColorMode.Light
                ? Theme.LIGHT
                : Theme.DARK
            }
            onEmojiClick={(emoji) => {
              onSelect && onSelect(emoji);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default EmojiPicker;
