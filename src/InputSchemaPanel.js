import React from 'react';
import SchemaInput from "./SchemaInput";
import styled from 'styled-components';

export default class InputSchemaPanel extends React.Component {
    constructor(props) {
        super(props);

        this.values = [...Array(this.props.rows).keys()].map(() =>
            [...Array(this.props.columns).keys()].map(() => []));

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(row, col, newVal) {
        this.props.handleChange(row, col, newVal);
    }

    render() {
        return (
            <StyledInputSchemaPanel rows={this.props.rows}
                                    columns={this.props.columns}>
                <label className='controls-label'>Schema</label>
                {[...Array(this.props.rows).keys()].map(i =>
                    [...Array(this.props.columns).keys()].map(j =>
                        <SchemaInput key={`schema-input-${i}-${j}`}
                                     row={i}
                                     col={j}
                                     defaultValue={this.props.defaultValues[i][j]}
                                     handleChange={this.handleChange}
                                     number={i}
                                     name={`simple-text-input-${i}`}/>))
                }
            </StyledInputSchemaPanel>
        )
    }
}

const StyledInputSchemaPanel = styled.div`
  display: grid;
  grid-template-rows: ${props => '1fr '.repeat(props.rows)};
  grid-template-columns: ${props => '1fr '.repeat(props.columns)};
  gap: var(--convert-button-gap);
  place-items: flex-start;
  width: 100%;
  position: relative;

  @media only screen and (max-width: 916px) {
    grid-template-columns: 1fr;
  }
`;