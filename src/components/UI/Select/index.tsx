import { useEffect, useState, useRef } from 'react';

interface SelectProps {
  current: string | null;
  setCurrent: (value: string) => void;
  def?: string;
  options?: string[];
}

export default function Select({ current, setCurrent, def, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (def) {
      setCurrent(def);
    }
  }, [def, setCurrent]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 bg-white text-base text-gray-900 rounded
          border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200 ease-in-out
          flex justify-between items-center
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{current !== null ? current : 'Select option'}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && options && (
        <ul
          className={`
            absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg
            max-h-60 overflow-auto
            transition-all duration-200 ease-in-out
          `}
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option}
              className={`
                px-4 py-2 cursor-pointer
                ${option === current ? 'bg-blue-100 text-blue-800' : 'text-gray-900 hover:bg-gray-100'}
              `}
              onClick={() => {
                setCurrent(option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option === current}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}