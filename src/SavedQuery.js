import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

export default class SavedQuery extends React.Component {
    constructor(props) {
        super(props);

        this.handleQueryClick = this.handleQueryClick.bind(this);
    }

    handleQueryClick() {
        this.props.setText(this.props.content, this.props.content.length);
    }

    handleQueryRightClick(e) {
        e.preventDefault();
        this.props.removeSavedQuery(this.props.number);
    }

    render() {
        return (
            <StyledSavedQuery onContextMenu={e => this.handleQueryRightClick(e)}>
                <button data-tip data-for={`savedQueryTip${this.props.number}`} onClick={this.handleQueryClick}>
                    { this.props.number }
                </button>
                <ReactTooltip id={`savedQueryTip${this.props.number}`} place="bottom" effect="solid">
                    { this.props.content }
                </ReactTooltip>
            </StyledSavedQuery>
        );
    }
}

const StyledSavedQuery = styled.div`
  border: white solid 1px;
  color: white;
  display: flex;
  background: var(--controls-color);
  margin-left: 0.75em;
  
  button {
    padding: 0;
    border: none;
    width: 20px;
    height: 22px;
    background: var(--controls-color);
  }
`