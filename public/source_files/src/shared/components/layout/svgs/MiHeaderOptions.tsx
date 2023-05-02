const MiHeaderOptions = ({ onClickHandler }: any) => {
  return (
    <span onClick={onClickHandler}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="4"
        height="17"
        viewBox="0 0 4 17"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 4.73438C3.1 4.73438 4 3.83437 4 2.73438C4 1.63437 3.1 0.734375 2 0.734375C0.9 0.734375 0 1.63437 0 2.73438C0 3.83437 0.9 4.73438 2 4.73438ZM2 6.73438C0.9 6.73438 0 7.63438 0 8.73438C0 9.83438 0.9 10.7344 2 10.7344C3.1 10.7344 4 9.83438 4 8.73438C4 7.63438 3.1 6.73438 2 6.73438ZM0 14.7344C0 13.6344 0.9 12.7344 2 12.7344C3.1 12.7344 4 13.6344 4 14.7344C4 15.8344 3.1 16.7344 2 16.7344C0.9 16.7344 0 15.8344 0 14.7344Z"
          fill="#16181C"
        />
      </svg>
    </span>
  );
};

export default MiHeaderOptions;
