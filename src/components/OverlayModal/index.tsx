const OverlayModal = ({ display, children }: { display: boolean, children: React.ReactNode }) => {
    return (
        <div className={`${display ? 'opacity-100' : 'pointer-events-none opacity-0'} delay-100 transition-opacity duration-100 flex absolute z-50 inset-0 top-0 left-0 justify-center items-center w-screen h-screen`}>
            <div className={`bg-contrast2 fixed left-0 bottom-0 z-[60] rounded-t-2xl w-screen text-center text-white p-6 transform transition-all duration-150 ${display ? 'translate-y-[0] opacity-100' : 'translate-y-[10px] opacity-0'}`}>
                {children}
            </div>
            <div className="z-50 fixed bg-black opacity-90 w-screen h-screen top-0 left-0"></div>
        </div>
    )
}

export default OverlayModal;