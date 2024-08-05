import { useState } from "react";

import * as utils from "../../../utilities";
interface Props { _address: string}
const WalletAddress = ({ _address }: Props) => {
  
  const [copied, setCopied] = useState(false);
  const [_f, setF] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    utils.copyToClipboard(_address!);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleDoubleClick = () => {
    handleCopy();
  };

  // Event handler for key down
  const handleKeyDown = (event: any) => {
    // Check if Ctrl key and C key are pressed simultaneously
    if ((event.ctrlKey || event.metaKey) && event.key === "c") {
      handleCopy();
    }
  };

  return (
    <div
      style={{
        appearance: "none",
        padding: 0,
        border: 0,
        outline: 0,
        cursor: "pointer",
      }}
      className="mx-auto text-center relative dark:text-black"
    >
      {_f && (
        <input
          readOnly
          onClick={handleCopy}
          onKeyDown={handleKeyDown}
          onDoubleClick={handleDoubleClick}
          onBlur={() => setF(false)}
          className={`p-2 text-left font-bold rounded-full focus:bg-teal-200 truncate focus:outline-teal-600 dark:focus:text-black px-3 pr-8 text-sm !w-max !max-w-max bg-neutral-300 ${copied && "bg-teal-500"}`}
          value={_address ? _address : "N/A"}
        />
      )}
      {!_f && (
        <input
          readOnly
          onClick={handleCopy}
          onKeyDown={handleKeyDown}
          onDoubleClick={handleDoubleClick}
          onFocus={() => setF(true)}
          className="p-2 text-left font-bold rounded-full focus:bg-teal-200 focus:outline-teal-600 dark:focus:text-black px-3 pr-8 text-sm !w-max !max-w-max bg-neutral-200"
          value={
            _address
              ? _address.substring(0, 8) +
                "..." +
                _address.substring(
                  _address.length - 8,
                  _address.length
                )
              : "N/A"
          }
        />
      )}
      <svg
        onInput={() => {}}
        className="absolute right-2 top-2"
        style={{
          color: "#0809ab",
          position: "absolute",
          top: 9,
          right: 10,
          strokeDasharray: 50,
          strokeDashoffset: copied ? -50 : 0,
          transition: "all 300ms ease-in-out",
          opacity: copied ? 0 : 1,
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        strokeWidth="3.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
        <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
      </svg>
      <svg
        onClick={handleCopy}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          color: "black",
          position: "absolute",
          top: 6,
          right: 8,
          strokeDasharray: 50,
          strokeDashoffset: copied ? 0 : -50,
          transition: "all 300ms ease-in-out",
        }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="3"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l5 5l10 -10" />
      </svg>      
    </div>
  );
};

export default WalletAddress;
