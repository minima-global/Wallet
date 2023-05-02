import styled from "@emotion/styled";

export { MiCoinName, MiCoinAmount, MiUnlockDate, MiFutureCoin };

const MiFutureCoin = styled("div")`
  background: #ffede9;
  margin-bottom: 8px;
  min-height: 72px;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #ffb9ab;
  overflow: hidden;

  * {
    padding: 0 8px;
    text-overflow: ellipsis;
    display: block;
  }
`;
const MiCoinName = styled("p")`
  padding: 0;
  margin: 0;
  font-family: Manrope-regular;
  font-weight: 600;
  font-size: 1rem;
  line-height: 24px;
  text-align: left;
  letter-spacing: 0.02em;
  color: #363a3f;
`;

const MiCoinAmount = styled("p")`
  padding: 0;
  margin: 0;
  font-family: Manrope-regular;
  font-weight: 400;
  font-size: 1rem;
  line-height: 24px;
  text-align: left;
  letter-spacing: 0.02em;
  color: #363a3f;
`;

const MiUnlockDate = styled("p")`
  font-family: Manrope-regular;
  font-weight: 400;
  font-size: 0.688rem;
  line-height: 16px;
  text-align: left;
  letter-spacing: 0.02em;
  color: #16181c;
`;
