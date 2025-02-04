interface Tab {
    key: string;
    title: string;
    href: string;
}

interface TabsProps {
    activeKey: string;
    onClick?: (key: string) => void;
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ activeKey, onClick, tabs }) => {
    return (
        <div className="flex gap-6 mb-6">
            {
                tabs.map((tab) => (
                    <div
                        key={tab.key}
                        onClick={() => onClick?.(tab.key)}
                        className={`cursor-pointer text-white pb-1.5 text-lg border-b-[3px] w-fit flex ${tab.key === activeKey ? '!text-orange border-orange' : 'border-transparent'}`}
                    >
                        {tab.title}
                    </div>
                ))
            }
        </div>
    )
}

export default Tabs