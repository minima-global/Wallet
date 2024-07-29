const DoneIcon = ({ fill, size = 22 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-heart-filled"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke={fill}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);

export default DoneIcon;
