import { MDS } from "@minima-global/mds";

const Button = ({ command, title, onClick }: { command?: string, title: string, onClick?: () => void }) => {
    const handleClick = async () => {
        if (command) {
            await MDS.executeRaw(command);
        }
    }

    return (
        <button
            onClick={onClick || handleClick}
            className="bg-emerald-600 text-emerald-100 font-bold text-sm p-2 rounded-md w-full break-all"
        >
            {title}
        </button>
    )
}

export default Button;