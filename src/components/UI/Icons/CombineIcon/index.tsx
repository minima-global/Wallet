const CombineIcon = ({ fill, size = 22 }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M16 8l-4 -4l-4 4" />
  <path d="M12 20v-16" />
  <path d="M18 18c-4 -1.333 -6 -4.667 -6 -10" />
  <path d="M6 18c4 -1.333 6 -4.667 6 -10" />
    </svg>
);

export default CombineIcon;
