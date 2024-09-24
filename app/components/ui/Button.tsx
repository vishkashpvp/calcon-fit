interface ButtonProps {
  text: string;
  onClick?: () => void;
  icon?: JSX.Element;
  iconAlign?: "start" | "end";
}

export default function Button({ text, onClick, icon, iconAlign = "start" }: ButtonProps) {
  return (
    <div className="relative bg-black dark:bg-blue-800 w-fit min-w-52 max-w-64">
      <div className="flex flex-col h-full gap-6 transform translate-x-1 -translate-y-1 border-2 border-black border-5">
        <button
          className={`p-2 px-4 text-xl text-black bg-blue-400 flex items-center ${
            !icon ? "justify-center" : iconAlign === "end" ? "justify-between" : ""
          }`}
          onClick={onClick}>
          {iconAlign === "start" && icon && <span className="mr-3">{icon}</span>}
          <span>{text}</span>
          {iconAlign === "end" && icon && <span>{icon}</span>}
        </button>
      </div>
    </div>
  );
}
