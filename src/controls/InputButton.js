import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

export default class InputButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.props.handleMouseDown(this.props.symbol);
    }

    render() {
        return (
            <StyledInputButton onMouseDown={this.handleMouseDown}
                               data-tip
                               data-for={this.props.tooltipId}
                               className="control-button">
                {this.props.symbol}
            </StyledInputButton>
        );
    }
}

InputButton.propTypes = {
    symbol: PropTypes.string.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    tooltipId: PropTypes.string.isRequired
};

const StyledInputButton = styled.button`
  display: inline;
  list-style-type: none;
  color: #94bffe;
  cursor: pointer;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  font-size: 18px;
  font-weight: 400;
  overflow: hidden !important;
  width: 50px;
  height: 50px;
  border: none;
  background: var(--input-color);
  position: relative;
  background: none;

  &:hover {
    color: white;
    /*text-shadow: 2px 4px 3px rgba(0,0,0,0.3);*/
  }

  &:active {
    transform: translateY(1px);
  }

  &:not(:last-child) {
    margin-right: 0;
  }
`