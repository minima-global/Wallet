const GridButton = ({ gridMode, onClick }: { gridMode: 'list' | 'grid', onClick: () => void }) => {
    return (
        <div>
            <button type="button" className="text-white h-[44px] w-[44px] p-0 border border-contrast2 rounded-full flex justify-center items-center bg-contrast1 hover:bg-contrast2 active:scale-90 transition-all " onClick={onClick}>
                {gridMode === 'list' && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 7V0H7V7H0ZM0 16V9H7V16H0ZM9 7V0H16V7H9ZM9 16V9H16V16H9ZM1 6H6V1H1V6ZM10 6H15V1H10V6ZM10 15H15V10H10V15ZM1 15H6V10H1V15Z" fill="currentColor" />
                    </svg>
                )}
                {gridMode === 'grid' && (
                    <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="grid" transform="translate(-84.000000, -85.000000)" stroke="#FFFFFF">
                                <g id="list" transform="translate(84.000000, 85.000000)">
                                    <rect id="row-3" x="0.5" y="0.5" width="13" height="3"></rect>
                                    <rect id="row-2" x="0.5" y="5.5" width="13" height="3"></rect>
                                    <rect id="row-1" x="0.5" y="10.5" width="13" height="3"></rect>
                                </g>
                            </g>
                        </g>
                    </svg>
                )}
            </button>
        </div>
    )
}

export default GridButton;