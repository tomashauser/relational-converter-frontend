import { Checkbox } from "@mui/material";
import styled from "styled-components";

type Props = {
  label: string;
  name: string;
  defaultChecked: boolean;
  handleSwitch: any;
};

export const SwitchCard = (props: Props) => {
    const handleSwitch = (e: any) =>
        props.handleSwitch(props.name, e.target.checked);

    const label = { inputProps: { "aria-label": "Toggle " + props.label } };

    return (
        <StyledSwitchCard>
            <label htmlFor={props.name}>{props.label}</label>
            <Checkbox
                id={props.name}
                {...label}
                defaultChecked={props.defaultChecked}
                onChange={handleSwitch}
            />
        </StyledSwitchCard>
    );
};

const StyledSwitchCard = styled.div`
  background: var(--light-blue);
  height: 100%;
  min-width: 18em;
  display: flex;
  cursor: default;
  transition: background 0.4s ease-in-out;
  align-items: center;
  color: white;

  .Mui-checked {
    color: white !important;
  }

  label {
    width: 75%;
    text-align: center;
  }
`;
