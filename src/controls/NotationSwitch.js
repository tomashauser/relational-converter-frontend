import React from "react";
import styled from "styled-components";
import Button from '@mui/material/Button';

export default class NotationSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {standardChosen: true}

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(standardChosen) {
        this.setState({standardChosen: standardChosen});

        this.props.handleNotationSwitch(standardChosen);
    }

    render() {
        return (
           <StyledNotationSwitch>
                    <Button variant='contained' onClick={() => this.handleClick(true)} data-chosen={this.state.standardChosen}>
                        Standard notation

                    </Button>
                    <Button variant='contained' onClick={() => this.handleClick(false)} data-chosen={!this.state.standardChosen}>
                        Simplified notation
                    </Button>
           </StyledNotationSwitch>
        );
    }
}

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
`