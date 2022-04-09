import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import katex from "katex/dist/katex.mjs";
import upArrow from "./images/up-arrow.png";
import copyIcon from "./images/copy-icon.png";
import Loader from "./Loader";

export default class QueryView extends React.Component {
    constructor(props) {
        super(props);

        this.conversionTable = new Map([['π', ' \\pi'], ['σ', ' \\sigma'], ['ρ', ' \\rho'], ['∧', ' \\land '],
            ['∨', ' \\lor '], ['¬', ' \\lnot '], ['≠', ' \\neq '], ['≥', ' \\geq '], ['≤', ' \\leq '], ['∩', ' \\cap '],
            ['∪', ' \\cup '], ['\\', ' \\setminus '], ['÷', ' \\div '], ['⨯', ' \\times '], ['→', ' \\rightarrow '], ['◁', ' \\triangleleft '], ['▷', ' \\triangleright '],
            ['⋈', ' \\bowtie '],
            ['⟕', ' \\leftouterjoin '],
            ['⟖', ' \\rightouterjoin '],
            ['⟗', ' \\fullouterjoin '],
            ['⋉', ' \\ltimes '],
            ['⋊', ' \\rtimes '],
            ['⟨', '\\langle '],
            ['⟩', ' \\rangle ']
        ]);

        this.convertedText = '';

        this.convertToLatex = this.convertToLatex.bind(this);
        this.convertFromAPIToLatex = this.convertFromAPIToLatex.bind(this);
        this.charToLatex = this.charToLatex.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isInput) {
            this.convertedText = this.convertToLatex(this.props.content);
        } else {
            this.convertedText = this.convertFromAPIToLatex(this.props.content);
        }
    }

    getContentForConversion() {
        let text = this.props.content;

        if (text == null || text.length === 0) {
            return "";
        }

        text = text.split("").map(char => this.charToLatex(char, this.conversionTable)).join("").replace(/[\u200B-\u200D\uFEFF]/g, '');

        text = "$$" + text + "$$";

        return text;
    }

    charToLatex(char, conversionTable) {
        if (conversionTable.has(char)) {
            return conversionTable.get(char);
        }

        return char;
    }

    convertToLatex(text) {
        if (text == null || text.length === 0) {
            return "";
        }

        text = text.split("").map(char => this.charToLatex(char, this.conversionTable)).join("").replace(/[\u200B-\u200D\uFEFF]/g, '');

        text = text.replaceAll("\\leftouterjoin", '⟕')
            .replaceAll('\\rightouterjoin', '⟖')
            .replaceAll('\\fullouterjoin', '⟗');

        console.log('Displaying: ' + text);

        katex.render(text, document.getElementById('query-view-input-true'), {
            throwOnError: false,
            displayMode: true
        });
    }

    convertFromAPIToLatex(text) {
        if (text == null || text.length === 0) {
            return "";
        }

        if (!this.props.errorOccurred) {
            text = text.replaceAll("\\leftouterjoin", '⟕')
                .replaceAll('\\rightouterjoin', '⟖')
                .replaceAll('\\fullouterjoin', '⟗');

            const operators = [' \\bowtie ', ' ⟕ ', ' ⟖ ', ' ⟗ ', ' \\rtimes ', ' \\ltimes ', ' \\triangleright ', ' \\triangleleft ',
                ' \\cap ', ' \\cup ', ' \\setminus ', ' \\div ', ' *_{L} ', ' *_{R} ', ' *_{F} ', ' \\times ', ' \\ltimes ', ' \\rtimes '
                , ' \\langle * ', '*\\rangle'];

            if (this.props.formattingEnabled) {
                for (let i = 0; i < operators.length; i++) {
                    const current = operators[i];

                    text = text.replaceAll(current, ' \\\\ ' + current + ' \\\\ ');
                }

                text = "\\begin{gathered}" + text + "\\end{gathered}";
            }
        } else {
            return '';
        }

        console.log('CONVERTED_TEXT: ' + text);

        katex.render(text, document.getElementById('query-view-input-false'), {
            throwOnError: false,
            displayMode: true
        });

        return text;
    }

    render() {
        return (
            <div style={{position: 'relative', whiteSpace: 'break-spaces'}}>
                <QueryViewLabel>
                    {this.props.label}
                </QueryViewLabel>
                <StyledQueryView id={`query-view-input-${this.props.isInput}`}>
                    {(this.props.errorOccurred && !this.props.isInput) ? this.props.content.replaceAll('.', '.\n') : <></>}
                </StyledQueryView>
                {(!this.props.isInput
                    && this.props.content.length !== 0
                    && !this.props.errorOccurred
                    && this.props.content.slice(0, 2) !== '\\{'
                    && !this.props.formattingEnabled
                )
                &&
                <>
                    <SideButton onClick={() => this.props.handleMoveToTextEditorButtonClick(this.convertedText)}>
                        <img src={upArrow} alt='arrow up'/>
                    </SideButton>
                    <SideButton onClick={() => window.prompt('Copy:', this.props.content)} marginTop='4em'>
                        <img src={copyIcon} alt='copy'/>
                    </SideButton>
                </>}
                {this.props.isLoading && !this.props.isInput ? (
                    <Loader />
                ) : <></>}
            </div>
        );
    }
}

const SideButton = styled.div`
  position: absolute;
  top: ${({marginTop}) => marginTop ?? '1em'};
  right: 1em;

  img {
    cursor: pointer;
    width: 2em;
    height: 2em;

    filter: invert(67%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(104%) contrast(96%);

    &:hover {
      transform: translateY(0.2px);
      filter: invert(0%) sepia(89%) saturate(7500%) hue-rotate(211deg) brightness(107%) contrast(94%)
    }
  }
`;

const StyledQueryView = styled.div`
  border: solid white 1px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  box-shadow: var(--box-shadow);
  background: var(--query-view-color);
  min-height: 9vh;
  font-size: 1.25rem;
  background-image: var(--almost-white-gradient);
  position: relative;
`

const QueryViewLabel = styled.label`
  color: white;
  position: absolute;
  font-size: 1.25rem;
  top: -1.5em;
  left: 0.1em;
`
