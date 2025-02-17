const OverlayModal = ({ display, children, dismiss }: { display: boolean, children: React.ReactNode, dismiss?: () => void }) => { 
    return (
        <div className={`${display ? 'opacity-100' : 'pointer-events-none opacity-0'} lg:hidden z-50 fixed inset-0 left-0 justify-center items-center w-screen h-screen`}>
            <div className={`bg-contrast2 absolute left-0 bottom-0 z-[60] rounded-t-2xl w-screen text-center text-white py-5 px-6 transition-all duration-50 delay-[25ms] ${display ? 'translate-y-[0]' : 'translate-y-[100px]'}`}>
                {children}
            </div>
            <div onClick={dismiss} className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
        </div>
    )
}

export default OverlayModal;