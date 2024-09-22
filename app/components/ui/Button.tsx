interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  return (
    <div className="relative bg-black dark:bg-blue-800 w-fit min-w-52 max-w-64">
      <div className="flex flex-col h-full gap-6 transform translate-x-1 -translate-y-1 border-2 border-black border-5">
        <button className="p-2 px-4 text-xl text-black bg-blue-400">{text}</button>
      </div>
    </div>
  );
}
