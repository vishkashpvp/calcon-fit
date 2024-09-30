interface InfoCardProps {
  title: string;
  info: string;
  description: string;
  Icon: JSX.Element;
}

export default function InfoCard({ title, info, description, Icon }: InfoCardProps) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-[--background] dark:border dark:border-[hsla(0,0%,100%,.14)]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 text-gray-500 dark:text-gray-200">
          <h3 className="font-bold">{title}</h3>
          {Icon}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{info}</div>
        <p className="text-sm text-gray-500 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
}
