const MiPaginationIcon = ({ fill, onClickHandler }: any) => {
  return (
    <div onClick={onClickHandler}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="7"
        viewBox="0 0 6 7"
        fill="none"
      >
        <circle cx="3.00001" cy="3.77265" r="2.78339" fill={fill} />
      </svg>
    </div>
  );
};

export default MiPaginationIcon;
