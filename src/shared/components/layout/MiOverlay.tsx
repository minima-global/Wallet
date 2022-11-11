import styled from "@emotion/styled";

const MiHeader = styled("h6")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 33px;
  text-align: center;
  letter-spacing: 0.02em;

  margin-top: 22px;
  margin-bottom: 17px;

  color: #363a3f;
`;

const MiContent = styled("p")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 500;
  font-size: 0.938rem;
  line-height: 24px;
  /* or 160% */

  text-align: center;
  letter-spacing: 0.02em;

  /* Text Colour / Black DM */

  color: #363a3f;

  padding: 0;
  margin: 0;
  margin-bottom: 48px;
`;

const MiOverlayDetails = styled("div")`
  display: flex;
  flex-direction: column;
  text-align: left;
  border-bottom: 1px solid #d3d3d8;
  margin-bottom: 12px;
  h5 {
    margin: 0;
    font-family: Manrope-regular;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 21px;
    letter-spacing: 0.16px;
    text-align: left;
    padding-top: 0px !important;
  }
  p {
    margin: 0;
    font-family: Manrope-regular;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0.01em;
    text-align: left;
    padding-bottom: 12px !important;
    padding-top: 0px !important;
    text-overflow: ellipsis;
    word-break: break-all;
  }
`;

const MiOverlayDetailsContainer = styled("div")`
  > :last-child {
    border-bottom: none !important;
  }
`;

const MiOverlayActionsContainer = styled("div")`
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export {
  MiHeader,
  MiContent,
  MiOverlayDetails,
  MiOverlayDetailsContainer,
  MiOverlayActionsContainer,
};
