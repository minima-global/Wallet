const MiDismiss = ({ size, color, onClick, className }: any) => {
  return (
    <div onClick={onClick}>
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 17 17"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.46759 16.6436L0.236816 15.4128L7.00605 8.64355C4.3625 6 2.88037 4.51787 0.236816 1.87432L1.46759 0.643555L8.23682 7.41278L15.006 0.643555L16.2368 1.87432L9.46758 8.64355L16.2368 15.4128L15.006 16.6436L8.23682 9.87432L1.46759 16.6436Z"
          fill="#91919D"
        />
      </svg>
    </div>
  );
};

export default MiDismiss;
