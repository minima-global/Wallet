import AnimatedDialog from "../../../components/UI/AnimatedDialog";
import CloseIcon from "../../../components/UI/Icons/CloseIcon";

interface Props { 
  txpowid: string | false; 
  dismiss: () => void; 
}

const Detail = ({ txpowid, dismiss }: Props) => {
  return (
    <AnimatedDialog display={!!txpowid} dismiss={dismiss}>
      <div className="modal-content">
        <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
          <h3 className="font-bold text-lg">Transaction Details</h3>
          <button onClick={dismiss} aria-label="Close">
            <CloseIcon fill="currentColor" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Content goes here */}

          {/* Add more content as needed */}
        </div>
      </div>
    </AnimatedDialog>
  );
}

export default Detail;
