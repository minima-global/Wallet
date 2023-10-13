import { useEffect, useState } from 'react';

interface IProps {
    current: string | null;
    setCurrent: any;
    def?: string;
    options?: string[];
}
const Select = ({ current, setCurrent, def, options }: IProps) => {
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        if (def) {
            setCurrent(def);
        }
    }, [def]);

    return (
        <div>
            <div
                className="bg-white p-4 text-black font-light rounded flex justify-between items-center"
                onClick={() => setToggle((prevState) => !prevState)}
            >
                <h1>{current !== null ? current : 'Select option'}</h1>
                <svg
                    className={`my-auto fill-gray-500 ${toggle ? 'arrow-active' : ''}`}
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask id="mask0_2226_53255" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="33">
                        <rect y="0.550781" width="32" height="32" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2226_53255)">
                        <path
                            d="M16.0004 20.6172L8.4668 13.0508L9.6668 11.8844L16.0004 18.2172L22.334 11.8844L23.534 13.0844L16.0004 20.6172Z"
                            fill="#08090B"
                        />
                    </g>
                </svg>
            </div>
            <ul aria-expanded={!toggle} className="accordion-content bg-white">
                {options &&
                    options.map((o) => (
                        <li
                            className={`hover:bg-slate-100 p-4 ${o === current ? 'bg-slate-100' : ''}`}
                            onClick={() => {
                                setCurrent(o);
                                setToggle(false);
                            }}
                        >
                            {o}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Select;
