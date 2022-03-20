import React from "react";
import styled from "styled-components";

export default class SchemaInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: this.props.defaultValue || '',
            wrongInput: false
        }

        const identifierRegex = '[a-zA-Z][a-zA-Z0-9_-]*';

        this.schemaRegex = new RegExp(`^$|(^${identifierRegex}\\(${identifierRegex}(,${identifierRegex})*\\)$)`);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const inputText = e.target.value;

        this.setState({
            inputValue: inputText,
            wrongInput: !this.schemaRegex.test(inputText.replace(/\s*/g,""))
        });

        this.props.handleChange(this.props.row, this.props.col, inputText);
    }

    render() {
        return (
            <StyledSchemaInput
                placeholder={'Table(column1, column2,...)'}
                value={this.state.inputValue}
                onChange={this.handleChange}
                ref={this.props.inputRef}
                data-wrong-input={this.state.wrongInput}
            />
        );
    }
}

const StyledSchemaInput = styled.input`
  padding: 0;
  border: none;
  font-size: 24px;
  outline: 1px;
  transition: .1s;
  height: var(--convert-button-height);
  text-align: center;
  min-width: 0;
  text-overflow: ellipsis;
  box-shadow: var(--box-shadow);
  width: 100%;

  &[data-wrong-input="true"] {
    box-shadow: 0 0 2pt 2pt red !important;
  }

  &:focus {
    box-shadow: 0 0 2pt 2pt cornflowerblue;
    border-radius: 2px;
  }

  &::placeholder {
    font-size: 0.75em;
  }
`