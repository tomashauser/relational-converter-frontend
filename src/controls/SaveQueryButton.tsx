import styled from "styled-components";
import diskette from "../images/diskette.png";

type Props = {
  handleSaveClick: any;
  handleClearClick: any;
};

export const SaveQueryButton = (props: Props) => {
  return (
    <StyledSavedQueryButton onClick={() => props.handleSaveClick()} id={'save-query-button'}>
      <SaveIcon src={diskette} className="save-icon" alt="save diskette icon" />
    </StyledSavedQueryButton>
  );
};

const StyledSavedQueryButton = styled.button`
  padding: 0;
  display: flex;
  position: absolute;
  right: 16px;
  top: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 2;
`;

const SaveIcon = styled.img`
  width: 25px;
  height: 25px;
  filter: invert(67%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(104%)
    contrast(96%);

  &:hover {
    transform: translateY(0.2px);
    filter: invert(0%) sepia(89%) saturate(7500%) hue-rotate(211deg)
      brightness(107%) contrast(94%);
  }
`;
