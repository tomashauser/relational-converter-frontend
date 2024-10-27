import { useState } from "react";
import styled from "styled-components";

type Props = {
  row: number;
  col: number;
  defaultValue: string;
  handleChange: any;
  number: number;
  name: string;
};

export const SchemaInput = (props: Props) => {
    const [inputValue, setInputValue] = useState<string>();
    const [isWrongInput, setIsWrongInput] = useState<boolean>();

    const identifierRegex = "[a-zA-Z][a-zA-Z0-9_-]*";
    const schemaRegex = new RegExp(
        `^$|(^${identifierRegex}\\(${identifierRegex}(,${identifierRegex})*\\)$)`
    );

    const handleChange = (e: any) => {
        const inputText = e.target.value;

        setInputValue(inputText);
        setIsWrongInput(!schemaRegex.test(inputText.replace(/\s*/g, "") || (inputText.replaceAll(" ", "").length === 0)));

        props.handleChange(props.row, props.col, inputText);
    };

    return (
        <StyledSchemaInput
            placeholder={"Table(column1, column2,...)"}
            value={inputValue}
            onChange={handleChange}
            data-wrong-input={isWrongInput}
        />
    );
};

const StyledSchemaInput = styled.input`
  padding: 0;
  border: none;
  font-size: 24px;
  outline: 1px;
  transition: 0.1s;
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
`;
