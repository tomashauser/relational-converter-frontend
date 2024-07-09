import React from "react";
import "./NotationSwitch";
import styled from "styled-components";
import Button from "@mui/material/Button";

type Props = {
  fetchNotationConversion: any;
  fetchAtomicConversion: any;
  standardChosen: boolean;
  updateContent: any;
};

export const ConvertButtonsPanel = (props: Props) => {
  return (
    <StyledConvertButtonsPanel>
      <Button variant="contained" onClick={props.fetchNotationConversion} id='notation-conversion-button'>
        Convert to{" "}
        {`${props.standardChosen ? "simplified" : "standard"} notation`}
        <HiddenCircle />
      </Button>
      <Button variant="contained" id='to-trc-conversion-button' onClick={props.fetchAtomicConversion}>
        Convert to TRC
      </Button>
    </StyledConvertButtonsPanel>
  );
};

const StyledConvertButtonsPanel = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-shadow: var(--box-shadow);
  gap: var(--convert-button-gap);

  button {
    font: inherit;
    color: black;
    text-transform: none;
    border-radius: 0;
    height: var(--convert-button-height);
    background-size: 300% 100%;
    background-image: linear-gradient(
      90deg,
      rgb(232, 231, 231) 0%,
      rgb(255, 255, 255) 20%,
      rgb(224, 222, 222) 82%,
      rgb(255, 255, 255) 97%
    );

    transition: background 0.2s ease-in-out;

    &:hover {
      background-position: 100% 0;
    }
  }
`;

const HiddenCircle = styled.span`
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: 0;
  inset: 0;
  border-radius: inherit;
`;
