const ActivityIcon = ({ fill }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-heart-filled"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke={fill}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 12h4l3 8l4 -16l3 8h4" />
    </svg>
  );
  
  export default ActivityIcon;
