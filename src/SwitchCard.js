import React from "react";
import styled from "styled-components";
import {Checkbox} from "@mui/material";

export default class SwitchCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isSelected: false }

        this.handleSwitch = this.handleSwitch.bind(this);
    }

    handleSwitch(e) {
        this.props.handleSwitch(this.props.name, e.target.checked);
    }

    render() {
        const label = { inputProps: { 'aria-label': 'Toggle ' + this.props.label } };

        return (
            <StyledSwitchCard>
                <label htmlFor={this.props.name}>
                    { this.props.label }
                </label>
                        <Checkbox id={this.props.name}
                                  {...label}
                                  defaultChecked={this.props.defaultChecked}
                                  onChange={this.handleSwitch}/>
            </StyledSwitchCard>
        );
    }
}

const StyledSwitchCard = styled.div`
  background: var(--light-blue);
  height: 100%;
  min-width: 18em;
  display: flex;
  cursor: default;
  transition: background .4s ease-in-out;
  align-items: center;
  color: white;

  .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.Mui-checked {
    color: white;
  }
  
  label {
    width: 75%;
    text-align: center;
  }
`