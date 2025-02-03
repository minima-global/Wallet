import { Link, useLocation } from "@tanstack/react-router"

const Tabs: React.FC<{ tabs: { title: string; href: string }[]; }> = ({ tabs }) => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="flex gap-6 mb-8">
            {
                tabs.map((tab) => (
                    <Link
                        to={tab.href}
                        className={`text-white pb-1.5 text-lg border-b-[3px] w-fit flex ${tab.href === pathname ? '!text-orange border-orange' : 'border-transparent'}`}
                    >
                        {tab.title}
                    </Link>
                ))
            }
        </div>
    )
}

export default Tabs