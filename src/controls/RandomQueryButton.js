import React from "react";
import shuffleIcon from '../images/shuffle-icon.png';
import styled from "styled-components";

export default class RandomQueryButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StyledRandomQueryButton onClick={() => this.props.handleClick()}>
                <RandomIcon src={shuffleIcon}
                          className="save-icon"
                          alt="save diskette icon"/>
            </StyledRandomQueryButton>
        );
    }
}

const StyledRandomQueryButton = styled.div`
  display: flex;
  position: absolute;
  right: 11px;
  top: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 2;
`

const RandomIcon = styled.img`
  filter: invert(67%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(104%) contrast(96%);
  
  &:hover {
    transform: translateY(0.2px);
    filter: invert(0%) sepia(89%) saturate(7500%) hue-rotate(211deg) brightness(107%) contrast(94%)
  }
`