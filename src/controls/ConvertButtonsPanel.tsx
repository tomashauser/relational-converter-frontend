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
      <Button variant="contained" onClick={props.fetchNotationConversion}>
        Convert to{" "}
        {`${props.standardChosen ? "simplified" : "standard"} notation`}
        <HiddenCircle />
      </Button>
      <Button variant="contained" onClick={props.fetchAtomicConversion}>
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

const ConvertButton = styled.button`
  cursor: pointer;
  background: var(--query-view-color);
  border: none;
  width: 100%;
  padding: 0;
  min-height: var(--convert-button-height);
  font-size: 1.125rem;

  background-size: 300% 100%;
  background-image: linear-gradient(
    to right,
    #25aae1,
    #4481eb,
    #04befe,
    #3f86ed
  );
  box-shadow: 0 2px 2px 0 rgba(65, 132, 234, 0.75);
  color: white;

  &:hover {
    background-position: 100% 0;
  }

  &:active {
    background: #003b62;
    color: white;
  }
`;
