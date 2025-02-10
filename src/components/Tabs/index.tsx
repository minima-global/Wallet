interface Tab {
    key: string;
    title: string;
    number?: number;
}

interface TabsProps {
    activeKey: string;
    onClick?: (key: string) => void;
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ activeKey, onClick, tabs }) => {
    return (
        <div className="flex gap-6 text-sm">
            {
                tabs.map((tab) => (
                    <div
                        key={tab.key}
                        onClick={() => onClick?.(tab.key)}
                        className={`cursor-pointer flex items-center gap-2 text-white pb-1.5 text-base border-b-[3px] w-fit flex ${tab.key === activeKey ? '!text-orange border-orange' : 'border-transparent'}`}
                    >
                        {tab.title}
                        {tab.number !== undefined && (
                            <span className={`text-sm rounded-full bg-contrast1 px-1.5 py-[0.25px] font-[800] ${tab.key === activeKey ? 'bg-orange text-black' : ''}`}>
                                {tab.number}
                            </span>
                        )}
                    </div>
                ))
            }
        </div>
    )
}

export default Tabs