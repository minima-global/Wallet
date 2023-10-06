/** this hook will return the right height for mobile browsers
 * if chrome, safari have the search bar visible or not this should fix
 * the footer cutting off as vh won't work properly there
 */
import { useEffect, useState } from "react";
const useGetInnerHeight = () => {
  const [innerHeight, setInnerHeight] = useState((window as any).innerHeight);

  useEffect(() => {
    (window as any).addEventListener("resize", () => {
      setInnerHeight((window as any).innerHeight);
    });
  }, [window]);

  return innerHeight;
};

export default useGetInnerHeight;
