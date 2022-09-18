import styled from "styled-components";

type Props = {
  symbol: string;
  tooltipId: string;
  handleMouseDown: any;
};

export const InputButton = (props: Props) => {
  const handleMouseDown = (e: any) => {
    e.preventDefault();
    props.handleMouseDown(props.symbol);
  };

  return (
    <StyledInputButton
      onMouseDown={handleMouseDown}
      data-tip
      data-for={props.tooltipId}
      className="control-button"
    >
      {props.symbol}
    </StyledInputButton>
  );
};

const StyledInputButton = styled.button`
  display: inline;
  list-style-type: none;
  color: #94bffe;
  cursor: pointer;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  font-size: 18px;
  font-weight: 400;
  overflow: hidden !important;
  width: 50px;
  height: 50px;
  border: none;
  background: var(--input-color);
  position: relative;
  background: none;

  &:hover {
    color: white;
    /*text-shadow: 2px 4px 3px rgba(0,0,0,0.3);*/
  }

  &:active {
    transform: translateY(1px);
  }

  &:not(:last-child) {
    margin-right: 0;
  }
`;
