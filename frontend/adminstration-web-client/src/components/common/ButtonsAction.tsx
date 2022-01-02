import React from "react";

interface ButtonsActionProps {
  cols: number;
  title: string;
  handleAction: () => void;
}

const ButtonsAction: React.FC<ButtonsActionProps> = ({
  cols,
  title,
  handleAction,
}) => {
  return (
    <div className={`col-span-${cols} ml-auto`}>
      <button className="btn-close-form" type="button" onClick={handleAction}>
        Close
      </button>
      <button className="btn-action-form" type="submit">
        {title}
      </button>
    </div>
  );
};

export default ButtonsAction;
