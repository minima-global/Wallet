import { useContext } from "react";
import { appContext } from "../../AppContext";

const TokenAuthenticity = ({ token }: { token: any }) => {
    const { verified } = useContext(appContext);
    const tokenid = token.tokenid;

    if (verified[tokenid] === 2) {
        return (
            <div className="my-auto ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"></path>
                    <path d="M9 12l2 2l4 -4"></path>
                </svg>
            </div>
        )
    }

    if (verified[tokenid] === 1) {
        return (
            <div className="my-auto ml-2">
                <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="question">
                            <polygon id="Path" points="0 0 16 0 16 16 0 16"></polygon>
                            <path d="M3.3258283,4.79249496 C3.3258283,3.98247733 3.98247733,3.3258283 4.79249496,3.3258283 L5.45916163,3.3258283 C5.84642746,3.32560687 6.2178883,3.17222949 6.49249496,2.89916163 L6.95916163,2.43249496 C7.23444814,2.15565702 7.60874915,2 7.99916163,2 C8.38957411,2 8.76387512,2.15565702 9.03916163,2.43249496 L9.5058283,2.89916163 C9.78049496,3.17249496 10.152495,3.3258283 10.5391616,3.3258283 L11.2058283,3.3258283 C12.0158459,3.3258283 12.672495,3.98247733 12.672495,4.79249496 L12.672495,5.45916163 C12.672495,5.8458283 12.8258283,6.2178283 13.0991616,6.49249496 L13.5658283,6.95916163 C13.8426662,7.23444814 13.9983233,7.60874915 13.9983233,7.99916163 C13.9983233,8.38957411 13.8426662,8.76387512 13.5658283,9.03916163 L13.0991616,9.5058283 C12.8260938,9.78043496 12.6727164,10.1518958 12.672495,10.5391616 L12.672495,11.2058283 C12.672495,12.0158459 12.0158459,12.672495 11.2058283,12.672495 L10.5391616,12.672495 C10.1518958,12.6727164 9.78043496,12.8260938 9.5058283,13.0991616 L9.03916163,13.5658283 C8.76387512,13.8426662 8.38957411,13.9983233 7.99916163,13.9983233 C7.60874915,13.9983233 7.23444814,13.8426662 6.95916163,13.5658283 L6.49249496,13.0991616 C6.2178883,12.8260938 5.84642746,12.6727164 5.45916163,12.672495 L4.79249496,12.672495 C3.98247733,12.672495 3.3258283,12.0158459 3.3258283,11.2058283 L3.3258283,10.5391616 C3.32560687,10.1518958 3.17222949,9.78043496 2.89916163,9.5058283 L2.43249496,9.03916163 C2.15565702,8.76387512 2,8.38957411 2,7.99916163 C2,7.60874915 2.15565702,7.23444814 2.43249496,6.95916163 L2.89916163,6.49249496 C3.17222949,6.2178883 3.32560687,5.84642746 3.3258283,5.45916163 L3.3258283,4.79249496" id="Path" stroke="#FFFFFF" strokeWidth="1.66666667" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M7.008,8.735 L7.917,8.555 C9.273,8.285 9.951,7.67 9.951,6.71 C9.951,6.2 9.7695,5.7875 9.4065,5.4725 C9.0435,5.1575 8.508,5 7.8,5 C7.536,5 7.2945,5.018 7.0755,5.054 C6.8565,5.09 6.6675,5.1455 6.5085,5.2205 C6.3495,5.2955 6.225,5.3915 6.135,5.5085 C6.045,5.6255 6,5.762 6,5.918 C6,6.074 6.036,6.2075 6.108,6.3185 C6.18,6.4295 6.267,6.524 6.369,6.602 C6.501,6.518 6.675,6.4445 6.891,6.3815 C7.107,6.3185 7.338,6.287 7.584,6.287 C7.854,6.287 8.0445,6.329 8.1555,6.413 C8.2665,6.497 8.322,6.596 8.322,6.71 C8.322,6.92 8.172,7.064 7.872,7.142 L7.872,7.142 L7.17,7.313 C6.978,7.361 6.8325,7.4315 6.7335,7.5245 C6.6345,7.6175 6.585,7.757 6.585,7.943 C6.585,8.135 6.63,8.3015 6.72,8.4425 C6.81,8.5835 6.906,8.681 7.008,8.735 L7.008,8.735 Z M7.575,10.76 C7.845,10.76 8.0565,10.6805 8.2095,10.5215 C8.3625,10.3625 8.439,10.16 8.439,9.914 C8.439,9.668 8.3625,9.4655 8.2095,9.3065 C8.0565,9.1475 7.845,9.068 7.575,9.068 C7.305,9.068 7.0935,9.1475 6.9405,9.3065 C6.7875,9.4655 6.711,9.668 6.711,9.914 C6.711,10.16 6.7875,10.3625 6.9405,10.5215 C7.0935,10.6805 7.305,10.76 7.575,10.76 Z" id="?" fill="#FFFFFF" fillRule="nonzero"></path>
                        </g>
                    </g>
                </svg>
            </div>
        )
    }

    return null;
}

export default TokenAuthenticity;