import styled from "@emotion/styled";

const Unavailable = styled("div")`
  position: absolute;
  height: 100vh;
  background-color: #16181c;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  > * {
    color: #fff;
    font-weight: 800;
    max-width: 380px;
  }
  > div div {
    margin-top: 4px !important;
  }
  img {
    width: 120px;
    height: 120px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Unavailable;
