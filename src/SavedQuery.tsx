import ReactTooltip from "react-tooltip";
import styled from "styled-components";

type Props = {
  content: string;
  number: number;
  setText: any;
  removeSavedQuery: any;
};

export const SavedQuery = (props: Props) => {
  const handleQueryClick = () =>
    props.setText(props.content, props.content.length);

  const handleQueryRightClick = (e: any) => {
    e.preventDefault();
    props.removeSavedQuery(props.number);
  };

  const ToolTip = ReactTooltip as unknown as React.FC<any>; // TODO: Udelat vlastni tooltip

  return (
    <StyledSavedQuery
        id={`saved-query-${props.number}`}
        data-content={props.content}
        onContextMenu={(e) => handleQueryRightClick(e)}>
      <button
        data-tip
        data-for={`savedQueryTip${props.number}`}
        onClick={handleQueryClick}
      >
        {props.number}
      </button>
      <ToolTip
        id={`savedQueryTip${props.number}`}
        place="bottom"
        effect="solid"
      >
        {props.content}
      </ToolTip>
    </StyledSavedQuery>
  );
};

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
`;
