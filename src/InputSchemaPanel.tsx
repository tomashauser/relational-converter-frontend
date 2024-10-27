import styled from "styled-components";
import { SchemaInput } from "./SchemaInput";

type Props = {
  rows: number;
  columns: number;
  defaultValues: string[][];
  handleChange: (row: number, col: number, newVal: string) => void;
};

export const InputSchemaPanel = (props: Props) => {
    return (
        <StyledInputSchemaPanel rows={props.rows} columns={props.columns} id='schema-input-panel'>
            <label className="controls-label">Schema</label>
            {[...Array(props.rows).keys()].map((i) =>
                [...Array(props.columns).keys()].map((j) => (
                    <SchemaInput
                        key={`schema-input-${i}-${j}`}
                        row={i}
                        col={j}
                        defaultValue={props.defaultValues[i][j]}
                        handleChange={props.handleChange}
                        number={i}
                        name={`simple-text-input-${i}`}
                    />
                ))
            )}
        </StyledInputSchemaPanel>
    );
};

const StyledInputSchemaPanel = styled.div<{ rows: number; columns: number }>`
  display: grid;
  grid-template-rows: ${(props) => "1fr ".repeat(props.rows)};
  grid-template-columns: ${(props) => "1fr ".repeat(props.columns)};
  gap: var(--convert-button-gap);
  place-items: flex-start;
  width: 100%;
  position: relative;

  @media only screen and (max-width: 916px) {
    grid-template-columns: 1fr;
    grid-template-rows: unset;
  }
`;
