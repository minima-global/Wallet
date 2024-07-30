const HelpIcon = ({ size = 22 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="fill-neutral-100 dark:fill-[#1B1B1B] dark:text-neutral-300"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth="2"    
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" />
  <path d="M12 19l0 .01" />
  </svg>
);

export default HelpIcon;