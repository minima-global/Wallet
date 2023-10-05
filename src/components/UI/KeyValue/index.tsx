interface IProps {
    title: string;
    value: string;
}
const KeyValue = ({ title, value }: IProps) => {
    return (
        <div
            className={`bg-white p-4 overflow-hidden rounded flex flex-col md:grid md:items-center md:grid-cols-[auto_1fr] md:grid-rows-1 md:gap-2`}
        >
            <h3 className="text-black truncate font-bold">{title}</h3>
            <p className="text-black truncate">{value}</p>
        </div>
    );
};

export default KeyValue;
