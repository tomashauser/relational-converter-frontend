import styled from "styled-components";
import shuffleIcon from "../images/shuffle-icon.png";

type Props = {
  handleClick: any;
};

export const RandomQueryButton = (props: Props) => {
  return (
    <StyledRandomQueryButton onClick={() => props.handleClick()}
                             id='random-query-generation-button'
                             title='Generate a random RA query'>
      <RandomIcon
        src={shuffleIcon}
        className="save-icon"
        alt="random query icon"
      />
    </StyledRandomQueryButton>
  );
};

const StyledRandomQueryButton = styled.button`
  padding: 0;
  display: flex;
  position: absolute;
  right: 11px;
  top: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 2;
`;

const RandomIcon = styled.img`
  filter: invert(67%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(104%)
    contrast(96%);

  &:hover {
    transform: translateY(0.2px);
    filter: invert(0%) sepia(89%) saturate(7500%) hue-rotate(211deg)
      brightness(107%) contrast(94%);
  }
`;
