import React from 'react';
import InputButton from "./InputButton";
import styled from 'styled-components';

class InputButtonsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.inputButtonSymbols = ['π', 'σ', 'ρ', '⋈', '⟕', '⟖', '⟗', '⋉', '⋊', '▷', '◁', '∧', '∨', '¬', '≥', '≤', '∩', '∪', '\\', '÷', '⨯', '→', '*', '⟨', '⟩'];
    }

    render() {
        return (
            <StyledInputButtonsPanelWrapper>
                <StyledInputButtonsPanel>
                    {this.inputButtonSymbols.map((symbol, idx) =>
                        <InputButton symbol={symbol}
                                     key={idx}
                                     handleMouseDown={this.props.handleMouseDown}/>)}
                </StyledInputButtonsPanel>
            </StyledInputButtonsPanelWrapper>
        );
    }
}

export default InputButtonsPanel;

const StyledInputButtonsPanelWrapper = styled.div`
  background: var(--light-blue);
  padding: 0 15px;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  z-index: 2;
  transition: background .4s ease-in-out;
`

const StyledInputButtonsPanel = styled.div`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`