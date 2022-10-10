import * as Popover from "@radix-ui/react-popover";
import { ReactNode, FC } from "react";
import { ChromePicker } from "react-color";

export interface ColorPickerProps {
  children: ReactNode;
  color?: string;
  onChange?: (color: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = (props) => {
  const { children, color, onChange } = props;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content
        sideOffset={4}
        side="bottom"
        align="start"
        className="z-40"
      >
        <ChromePicker
          color={color}
          onChange={(value) => {
            onChange && onChange(value.hex);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
};

export default ColorPicker;
