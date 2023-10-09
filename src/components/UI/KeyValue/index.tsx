interface IProps {
    title: string;
    value: any;
}
const KeyValue = ({ title, value }: IProps) => {
    return (
        <div
            className={`bg-white p-4 overflow-hidden rounded flex flex-col md:grid md:items-center md:grid-cols-[auto_1fr] md:grid-rows-1 md:gap-2`}
        >
            <h3 className="text-black truncate font-bold">{title}</h3>
            {typeof value === 'string' || typeof value === 'number' ? (
                <p className="text-black truncate">{value}</p>
            ) : (
                value
            )}
        </div>
    );
};

export default KeyValue;
