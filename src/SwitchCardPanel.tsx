import React from "react";
import styled from "styled-components";
import { SwitchCard } from "./SwitchCard";

type Props = {
  handleSwitch: any;
  className?: string;
};

export const SwitchCardPanel = (props: Props) => {
    const handleSwitch = (name: string, newValue: string) => {
        props.handleSwitch(name, newValue);
    };

    return (
        <StyledSwitchPanel className={props.className}>
            <label className="controls-label">Options</label>
            <SwitchCard
                label="Semantic checking for RA"
                name="semanticChecking"
                defaultChecked={false}
                handleSwitch={handleSwitch}
            />
            <SwitchCard
                label="Formatting for RA"
                name="formatting"
                defaultChecked={false}
                handleSwitch={handleSwitch}
            />
            <SwitchCard
                label="Prenex form for TRC"
                name="prenexForm"
                defaultChecked={false}
                handleSwitch={handleSwitch}
            />
        </StyledSwitchPanel>
    );
};

const StyledSwitchPanel = styled.div`
  min-height: var(--notation-switch-height);
  display: flex;
  gap: var(--convert-button-gap);
  flex-direction: column;
  position: relative;

  @media only screen and (max-width: 916px) {
    flex-direction: column;
    display: block;
  }
`;
