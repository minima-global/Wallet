const NonFungibleIcon = ({ fill, size }: any) => (
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
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M19 5v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z" />
  <path d="M8 6h.01" />
  <path d="M16 18h.01" />
  <path d="M12 16l-3 -4l3 -4l3 4z" />
    </svg>
);

export default NonFungibleIcon;