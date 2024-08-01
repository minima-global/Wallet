import { useState } from 'react';

interface Props {
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    value: any;
    error: false | string;
    id: string;
    name: string;
    placeholder?: string; // optional, defaults to "Public Message" if not provided.
}
const MessageArea = ({ handleChange, handleBlur, value, id, name, placeholder = "Public Message" }: Props) => {
    const [_f, setF] = useState(false);


    return (
        <div className={`bg-white dark:bg-[#1B1B1B] rounded p-4 w-full ${_f && "border"} flex`}>
            <textarea
                id={id}
                name={name}
                onChange={handleChange}
                onFocus={() => {
                    setF(true);
                }}
                onBlur={(e) => {
                    handleBlur(e);
                    setF(false);
                }}
                placeholder={placeholder}
                className="bg-transparent focus:outline-none dark:placeholder:text-neutral-600 w-full truncate"
                rows={5}    
                value={value}            
            />
            <span className="mt-auto text-sm dark:text-neutral-300">
                {value.length + "/" + 255}
            </span>
        </div>
    );
};

export default MessageArea;
MessageArea