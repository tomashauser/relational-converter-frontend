import React from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import { InputButton } from "./InputButton";

type Props = {
  handleMouseDown: any;
};

export const InputButtonsPanel = (props: Props) => {
    const ToolTip = ReactTooltip as unknown as React.FC<any>;
    const inputButtonSymbols = [
        ["π", "Pi", "π_{r}(R)"],
        ["σ", "Sigma", "σ_{r = 4}(R)"],
        ["ρ", "Rho", "ρ_{s / r}(R)"],
        ["⋈", "naturalJoin", "R ⋈ S or R ⋈_{x = y} S"],
        ["⟕", "", ""],
        ["⟖", "", ""],
        ["⟗", "", ""],
        ["⋉", "leftSemiJoin", "R ⋉ S or R ⋉_{x = y} S"],
        ["⋊", "rightSemiJoin", "R ⋊ S or R ⋊_{x = y} S"],
        ["▷", "", ""],
        ["∧", "", ""],
        ["∨", "", ""],
        ["¬", "", ""],
        ["≥", "", ""],
        ["≤", "", ""],
        ["∩", "", ""],
        ["∪", "", ""],
        ["\\", "", ""],
        ["÷", "", ""],
        ["⨯", "", ""],
        ["÷", "", ""],
        ["→", "renamingArrow", "R⟨r → S⟩"],
        ["*", "", ""],
        ["⟨", "leftAngle", "R⟨r = 4]S"],
        ["⟩", "rightAngle", "R[r = 4⟩S"],
    ];

    return (
        <StyledInputButtonsPanelWrapper>
            <StyledInputButtonsPanel>
                {inputButtonSymbols.map(([symbol, tipId, content], idx) => (
                    <>
                        <InputButton
                            symbol={symbol}
                            tooltipId={`usageTip${tipId}`}
                            handleMouseDown={props.handleMouseDown}
                        />
                        {tipId !== "" ? (
                            <ToolTip
                                id={`usageTip${tipId}`}
                                place="left"
                                effect="solid"
                                key={tipId + "-" + idx}
                            >
                                {content}
                            </ToolTip>
                        ) : (
                            <></>
                        )}
                    </>
                ))}
            </StyledInputButtonsPanel>
        </StyledInputButtonsPanelWrapper>
    );
};

const StyledInputButtonsPanelWrapper = styled.div`
  background: var(--light-blue);
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  z-index: 2;
  transition: background 0.4s ease-in-out;
`;

const StyledInputButtonsPanel = styled.div`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;
