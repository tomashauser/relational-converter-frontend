import React from 'react';
import styled from "styled-components";

export default class Loader extends React.Component {
    render() {
        return (
            <StyledLoader>
                <LoaderText>It may take up to 10 seconds</LoaderText>
                <div className="lds-roller">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
                <LoaderText>before the server wakes up.</LoaderText>
            </StyledLoader>
        )
    }
}

const StyledLoader = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  gap: 3em;
  width: 100%;
  height: 100%;
`;

const LoaderText = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 1.5rem;
`;

