const StateIcon = ({ fill, size = 22 }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white dark:fill-[#1B1B1B]"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 4c-2.5 5 -2.5 10 0 16m14 -16c2.5 5 2.5 10 0 16m-10 -11h1c1 0 1 1 2.016 3.527c.984 2.473 .984 3.473 1.984 3.473h1" />
        <path d="M8 16c1.5 0 3 -2 4 -3.5s2.5 -3.5 4 -3.5" />
    </svg>
);

export default StateIcon;
