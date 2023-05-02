import styled from "@emotion/styled";

import styles from "./MiTabs.module.css";

export { styles as tabStyles };
export const Tabs = styled("div")`
  height: 48px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
  > :first-of-type {
    margin-right: 4.5px;
  }
`;

export const TabButton = styled("button")`
  background: #fff;
  width: 100%;
  border-radius: 8px;
  letter-spacing: 0.01em;
  color: #16181c;
  font-family: Manrope-regular;
  font-weight: 800;
  font-size: 0.938rem;
  border: none;
`;
