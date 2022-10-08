import { FC } from "react";
import { FiFolder } from "react-icons/fi";
import Notebook from "../types/notebook";

const NotebookIcon: FC<{ notebook: Notebook }> = ({ notebook }) => {
  return notebook.emoji ? <span>{notebook.emoji}</span> : <FiFolder />;
};

export default NotebookIcon;
