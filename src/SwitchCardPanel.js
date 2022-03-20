import React from "react";
import styled from "styled-components";
import SwitchCard from "./SwitchCard";

export default class SwitchCardPanel extends React.Component {
    constructor(props) {
        super(props);

        this.defaultChecked = {"semanticChecking": false,"formatting": false, "prenexForm":false};

        this.handleSwitch = this.handleSwitch.bind(this);
    }

    handleSwitch(name, newValue) {
        this.props.handleSwitch(name, newValue);
    }

    render() {

        return (
            <StyledSwitchPanel className={this.props.className}>
                <label className='controls-label'>Options</label>
                <SwitchCard label='Semantic checking for RA'
                            name='semanticChecking'
                            defaultChecked={this.defaultChecked.semanticChecking}
                            handleSwitch={this.handleSwitch} />
                <SwitchCard label='Formatting for RA'
                            name='formatting'
                            defaultChecked={this.defaultChecked.formatting}
                            handleSwitch={this.handleSwitch} />
                <SwitchCard label='Prenex form for TRC'
                            name='prenexForm'
                            defaultChecked={this.defaultChecked.prenexForm}
                            handleSwitch={this.handleSwitch} />
            </StyledSwitchPanel>
        );
    }
}

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
`