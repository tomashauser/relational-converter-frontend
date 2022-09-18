import React from "react";
import styled from "styled-components";
import { ConvertButtonsPanel } from './controls/ConvertButtonsPanel';
import { NotationSwitch } from "./controls/NotationSwitch";
import { InputSchemaPanel } from "./InputSchemaPanel";
import { QueryView } from "./QueryView";
import { RichTextEditor } from "./RichTextEditor";
import { SwitchCardPanel } from "./SwitchCardPanel";
import { getContentForConversion, getLatexToSymbolMap } from "./utils";

const BASE_URL = 'http://localhost:8080/'; //TODO: Dat to jako proxy do config filu

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.schemaInputRows = 3;
        this.schemaInputCols = 2;

        const defaultSchemaInput = JSON.parse(localStorage.getItem('schema')) || [...Array(this.schemaInputRows).keys()].map(() =>
            [...Array(this.schemaInputCols).keys()].map(() => []));

        this.state = {
            textEditorContent: "",
            latexContent: "",
            apiText: "",
            errorOccurred: false,
            standardChosen: true,
            outputData: [],
            isLoading: false,
            justArrived: true,
            formattingEnabled: false,
            schemaInput: defaultSchemaInput,
            switchValues: new Map([['semanticChecking', false], ['formatting', false], ['prenexForm', false]]),
        };

        this.latexConversionMap = getLatexToSymbolMap();

        this.handleTextChange = this.handleTextChange.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.fetchConversion = this.fetchConversion.bind(this);
        this.handleNotationSwitch = this.handleNotationSwitch.bind(this);
        this.fetchRandomQuery = this.fetchRandomQuery.bind(this);
        this.fetchNotationConversion = this.fetchNotationConversion.bind(this);
        this.fetchAtomicConversion = this.fetchAtomicConversion.bind(this);
        this.setFormatting = this.setFormatting.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.getSchemaInputValues = this.getSchemaInputValues.bind(this);
        this.handleSchemaInputChange = this.handleSchemaInputChange.bind(this);
        this.handleMoveToTextEditorButtonClick = this.handleMoveToTextEditorButtonClick.bind(this);
        this.showLoaderConditionally = this.showLoaderConditionally.bind(this);
        this.textEditor = React.createRef();
    }

    handleTextChange(textEditorContent) {
        this.setState({
            textEditorContent: textEditorContent,
            latexContent: "" // Trigger state update in QueryView
        });
    }

    updateContent(newLatexContent) {
        this.setState({
            latexContent: newLatexContent,
            textEditorContent: newLatexContent
        });
    }

    showLoaderConditionally() {
        if (this.state.justArrived) {
            this.setState({ justArrived: false, isLoading: true });
        }
    }

    fetchRandomQuery() {
        const address = BASE_URL + 'getRandomQuery';

        this.setState({ isLoading: false });

        this.showLoaderConditionally();

        fetch(address)
            .then(r => r.text())
            .then(r => {

                for (const [key, value] of this.latexConversionMap) {
                    r = r.replaceAll(key, value);
                }

                this.setState({ textEditorContent: r });

                this.setState({isLoading: false});
            });
    }

    fetchConversion(url, data) {
        url = BASE_URL + url;

        this.setState({ isLoading: false });

        this.showLoaderConditionally();

        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: data
        }).then(r => {
            this.setState({errorOccurred: r.status !== 200})

            return r;
        }).then(r => r.text()).then(r => {
            this.setState({apiText: r, isLoading: false});
        });
    }

    fetchNotationConversion() {
        let data = new Object();

        data.expression = getContentForConversion(this.state.textEditorContent);
        data.schema = this.getSchemaInputValues();
        data.options = Object.fromEntries(this.state.switchValues);

        const url = this.state.standardChosen ? '/convert/standardToSimplified' : '/convert/simplifiedToStandard';

        this.fetchConversion(url, JSON.stringify(data));
    }

    fetchAtomicConversion() {
        let data = new Object();

        data.expression = getContentForConversion(this.state.textEditorContent);
        data.schema = this.getSchemaInputValues();
        data.options = Object.fromEntries(this.state.switchValues);

        const notationString = this.state.standardChosen ? 'standard' : 'simplified';

        this.fetchConversion(`/convert/${notationString}ToTRC`, JSON.stringify(data));
    }

    handleNotationSwitch(standardChosen) {
        this.setState({standardChosen: standardChosen});
    }

    setFormatting(newVal) {
        this.setState({formattingEnabled: newVal});
    }

    getSchemaInputValues() {
        let strings = this.state.schemaInput.filter(el => el[0].length !== 0).flatMap(row => row.map(el => typeof el === 'string' ? el.replace(/ /g, '') : ''));

        return strings.map(s => {
            const idxLeftPar = s.indexOf('(');
            const idxRightPar = s.indexOf(')');

            return [s.slice(0, idxLeftPar), s.slice(idxLeftPar + 1, idxRightPar).split(',')];
        });
    }

    handleSwitch(name, newValue) {
        let newMap = new Map(this.state.switchValues);

        newMap.set(name, newValue);

        localStorage.setItem('switches', JSON.stringify(Object.fromEntries(newMap)));

        this.setState({switchValues: newMap});
    }

    handleSchemaInputChange(row, col, newVal) {
        let current = this.state.schemaInput;
        current[row][col] = newVal;

        localStorage.setItem('schema', JSON.stringify(current));

        this.setState({schemaInput: current})
    }

    handleMoveToTextEditorButtonClick(text) {
        for (const [key, value] of this.latexConversionMap) {
            text = text.replaceAll(key, value);
        }

        this.setState({ textEditorContent: text });
    }

    render() {
        return (
            <AppWrapper>
                <link href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css" rel="stylesheet"/>
                <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/dreampulse/computer-modern-web-font/master/fonts.css"/>
                <div className="text-editor-wrapper">
                    <RichTextEditor handleTextChange={this.handleTextChange}
                                    text={this.state.textEditorContent}
                                    fetchRandomQuery={this.fetchRandomQuery}/>
                </div>
                <QueryView content={this.state.textEditorContent}
                           updateLatexContent={this.updateContent}
                           errorOccurred={this.state.errorOccurred}
                           label='LaTeX input view'
                           isInput={true}/>
                <QueryView content={this.state.apiText}
                           isInput={false}
                           isLoading={this.state.isLoading}
                           formattingEnabled={this.state.switchValues.get('formatting')}
                           errorOccurred={this.state.errorOccurred}
                           handleMoveToTextEditorButtonClick={this.handleMoveToTextEditorButtonClick}
                           label='LaTeX output view'/>
                <ButtonsAndSchemaSection>
                    <ConvertButtonsWrapper>
                        <label className='controls-label'>Conversion controls</label>
                        <NotationSwitch handleNotationSwitch={this.handleNotationSwitch}/>
                        <ConvertButtonsPanel
                                             fetchNotationConversion={this.fetchNotationConversion}
                                             fetchAtomicConversion={this.fetchAtomicConversion}
                                             standardChosen={this.state.standardChosen}
                                             updateContent={this.updateContent}/>
                    </ConvertButtonsWrapper>
                    <StyledSwitchCardPanel
                        handleSwitch={this.handleSwitch}
                        className={this.props.className}
                        setFormatting={this.setFormatting}/>
                    <InputSchemaPanel rows={this.schemaInputRows}
                                      columns={this.schemaInputCols}
                                      defaultValues={this.state.schemaInput}
                                      handleChange={this.handleSchemaInputChange}/>
                </ButtonsAndSchemaSection>
            </AppWrapper>
        );
    }
}

const AppWrapper = styled.div`
  display: flex;
  width: 80vw;
  flex-direction: column;
  gap: 64px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 24px;
`;

const ConvertButtonsWrapper = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  gap: var(--convert-button-gap);
  position: relative;
`

const Label = styled.label`
  position: absolute;
  color: white;
  font-size: 1.25rem;
  top: -2em;
`;

const ButtonsAndSchemaSection = styled.section`
  display: flex;
  justify-content: flex-start;
  gap: 1em;
  width: 100%;
  font-family: Niramit, "sans-serif";

  @media only screen and (max-width: 916px) {
    flex-direction: column;
  }
`

const StyledSwitchCardPanel = styled(SwitchCardPanel)`
  box-shadow: var(--box-shadow);
`
