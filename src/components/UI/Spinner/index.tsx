interface IProps {
    message?: string;
}

const Spinner = ({message}: IProps) => {
    return (
        <div className="flex items-center justify-center flex-col gap-2">
            {message && <p className="text-sm text-black dark:text-white animate-pulse">{message}</p>}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin "
                width="16"
                height="16"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#5eead4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
                <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
                <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
                <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
                <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
            </svg>
        </div>
    );
};

export default Spinner;
