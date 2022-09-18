import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";

type Props = {
  handleNotationSwitch: any;
};

export const NotationSwitch = (props: Props) => {
  const [isStandardChosen, setIsStandardChosen] = useState<boolean>(true);

  const handleClick = (standardChosen: boolean) => {
    setIsStandardChosen(standardChosen);
    props.handleNotationSwitch(standardChosen);
  };

  return (
    <StyledNotationSwitch>
      <Button
        variant="contained"
        onClick={() => handleClick(true)}
        data-chosen={isStandardChosen}
      >
        Standard notation
      </Button>
      <Button
        variant="contained"
        onClick={() => handleClick(false)}
        data-chosen={!isStandardChosen}
      >
        Simplified notation
      </Button>
    </StyledNotationSwitch>
  );
};

const StyledNotationSwitch = styled.div`
  display: flex;
  box-shadow: var(--box-shadow);
  background: var(--query-view-color);
  background: var(--light-blue);
  min-height: var(--convert-button-height);
  align-items: center;
  justify-content: center;

  button {
    box-shadow: none;
    white-space: nowrap;
    border: none;
    font: inherit;
    text-transform: none;
    border-radius: 0;
    height: 100%;
    color: #94bffe;
    background: var(--light-blue);

    &[data-chosen="true"] {
      color: white;
    }

    &:hover {
      background: var(--light-blue-hover);
      box-shadow: none;
      color: white;
    }
  }
`;
