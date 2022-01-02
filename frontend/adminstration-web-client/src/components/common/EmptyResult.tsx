import React from "react";

interface EmptyResultProps {}

const EmptyResult: React.FC<EmptyResultProps> = () => {
  return <h1 className="text-xl dark:text-white">Result is empty</h1>;
};

export default EmptyResult;
