import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { IdentifierSchemaAttributes, CreateEditorStateProps } from "remirror";
import {
  BulletListExtension,
  EmojiExtension,
  MarkdownExtension,
  MentionAtomExtension,
  MentionAtomNodeAttributes,
  OrderedListExtension,
  PlaceholderExtension,
  TaskListExtension,
  wysiwygPreset,
} from "remirror/extensions";
import { TableExtension } from "@remirror/extension-react-tables";
import data from "svgmoji/emoji.json";
import {
  EditorComponent,
  MentionAtomPopupComponent,
  MentionAtomState,
  Remirror,
  TableComponents,
  useRemirror,
  RemirrorProps,
  EmojiPopupComponent,
  ThemeProvider,
} from "@remirror/react";
import { BubbleMenu } from "./components/BubbleMenu";
import { AllStyledComponent, themeStyledCss } from "@remirror/styles/emotion";
import "./index.css";

const extraAttributes: IdentifierSchemaAttributes[] = [
  {
    identifiers: ["mention", "emoji"],
    attributes: { role: { default: "presentation" } },
  },
  { identifiers: ["mention"], attributes: { href: { default: null } } },
];

export interface ReactEditorProps
  extends Pick<CreateEditorStateProps, "stringHandler">,
    Pick<RemirrorProps, "initialContent" | "editable" | "autoFocus" | "hooks"> {
  placeholder?: string;
}

interface MentionComponentProps<
  UserData extends MentionAtomNodeAttributes = MentionAtomNodeAttributes
> {
  users?: UserData[];
  tags?: string[];
}

function MentionComponent({ users, tags }: MentionComponentProps) {
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const tagItems = useMemo(
    () => (tags ?? []).map((tag) => ({ id: tag, label: `#${tag}` })),
    [tags]
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const allItems = mentionState.name === "at" ? users : tagItems;

    if (!allItems) {
      return [];
    }

    const query = mentionState.query.full.toLowerCase() ?? "";
    return allItems
      .filter((item) => item.label.toLowerCase().includes(query))
      .sort();
  }, [mentionState, users, tagItems]);

  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
}

interface AstronoteEditorProps
  extends Partial<ReactEditorProps>,
    Pick<MentionComponentProps, "users" | "tags"> {}

const AstronoteEditor: FC<PropsWithChildren<AstronoteEditorProps>> = (
  props
) => {
  const { placeholder, stringHandler, children, users, tags, ...rest } = props;

  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new TableExtension(),
      new MentionAtomExtension({
        matchers: [
          { name: "at", char: "@", appendText: " " },
          { name: "tag", char: "#", appendText: " " },
          { name: "ref", char: "[[", appendText: " " },
        ],
      }),
      new EmojiExtension({ plainText: true, data, moji: "noto" }),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new TaskListExtension(),
      new MarkdownExtension({ copyAsMarkdown: true }),
      ...wysiwygPreset({
        openLinkOnClick: true,
        defaultTarget: "_blank",
      }),
    ],
    [placeholder]
  );

  const { manager } = useRemirror({
    extensions,
    extraAttributes,
    stringHandler,
  });

  return (
    <Remirror
      manager={manager}
      {...rest}
      classNames={["prose max-w-screen-md dark:prose-invert mx-auto"]}
    >
      {children}
      <AllStyledComponent>
        <ThemeProvider>
          <EditorComponent />
          <MentionComponent users={users} tags={tags} />
          <TableComponents />
          <EmojiPopupComponent />
          <BubbleMenu />
        </ThemeProvider>
      </AllStyledComponent>
    </Remirror>
  );
};

export default AstronoteEditor;
