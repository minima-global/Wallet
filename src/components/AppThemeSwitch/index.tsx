import { useContext } from "react";
import LightIcon from "../UI/Icons/LightIcon";
import DarkIcon from "../UI/Icons/DarkIcon";
import { appContext } from "../../AppContext";

const AppThemeSwitch = () => {
  const {isDarkMode, setIsDarkMode} = useContext(appContext);

  // Handler for the switch change event
  const handleSwitchChange = (e: any) => {
    setIsDarkMode(e.target.checked);
  };

  return (
    <div className="">
      <input
        type="checkbox"
        id="light-switch"
        className="light-switch sr-only"
        checked={isDarkMode}
        onChange={handleSwitchChange}
      />
      <label className="relative cursor-pointer" htmlFor="light-switch">
        <span className="dark:hidden text-[#1B1B1B]">
          <LightIcon size={24} />
        </span>
        <span className="hidden dark:block text-neutral-400 opacity-90"><DarkIcon size={24} /></span>
        <span className="sr-only">Switch to light / dark version</span>
      </label>
    </div>
  );
};

export default AppThemeSwitch;
