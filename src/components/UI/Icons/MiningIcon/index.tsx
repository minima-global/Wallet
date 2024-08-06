const MiningIcon = ({ fill, size = 22 }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke={fill}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
    </svg>
);

export default MiningIcon;
