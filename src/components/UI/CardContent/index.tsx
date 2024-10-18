import { ReactElement } from 'react';

interface CardContentProps {
  header: ReactElement;
  content: ReactElement;
  className?: string;
  onClick?: () => void;
}

export default function CardContent({ header, content, className, onClick }: CardContentProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg h-max shadow-md overflow-hidden my-4 mx-4 sm:mx-0 transition-all duration-300 ease-in-out ${
        className || ''
      }`}
    >
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          {header}
        </div>
        <div className="h-px bg-gray-200 w-full mb-6" />
        <div id="card-content" className="h-max">
          {content}
        </div>
      </div>
    </div>
  );
}