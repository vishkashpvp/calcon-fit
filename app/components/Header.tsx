import { getAppName } from "@utils/env";

const APP_NAME = getAppName();

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={className}>
      <div className="ms-5 mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{APP_NAME}</h1>
      </div>
    </header>
  );
}
