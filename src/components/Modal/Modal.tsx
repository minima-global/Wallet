const Modal = () => {
    return (
        <div className="hidden absolute z-50 inset-0 top-0 left-0 bg-opacity-50 flex justify-center items-center w-screen h-screen">
            <div className="bg-contrast1 relative z-[60] rounded-lg w-[470px] text-center text-white p-10">
                <h1 className="text-white text-2xl mb-4">Sent</h1>
                <p className="text-grey60 text-base text-sm mb-2">Your transaction has been sent</p>
                <button className="bg-contrast2 py-3 px-4 w-full mt-6 text-sm rounded-sm">Close</button>
            </div>
            <div className="z-50 bg-black opacity-90 absolute w-screen h-screen top-0 left-0"></div>
        </div>
    )
}

export default Modal;
