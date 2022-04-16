import React from 'react';
import {
    convertToRaw,
    Editor,
    EditorState,
    getDefaultKeyBinding,
    Modifier,
    RichUtils,
    CompositeDecorator
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import PropTypes from 'prop-types';
import SavedQuery from "./SavedQuery";
import SaveQueryButton from "./controls/SaveQueryButton";
import InputButtonsPanel from "./controls/InputButtonsPanel";
import styled from "styled-components";
import RandomQueryButton from "./controls/RandomQueryButton";

class RichTextEditor extends React.Component {
    constructor(props) {
        super(props);

        const RA_OPERATORS = ['π', 'σ', 'ρ', '∩', '∪', '\\\\', '÷', '⨯', '▷', '◁', '⋈', '⟕', '⟖', '⟗', '⋉', '⋊', '<\\*', '\\*>', '\\*', '⟨', '⟩', '\\[', '\\]'];

        const LOGICAL_OPERATORS = ['∧', '∨', '¬', '≥', '≤', '<', '>', '='];

        function findWithRegex(words, contentBlock, callback) {
            const text = contentBlock.getText();

            words.forEach(word => {
                const matches = [...text.matchAll(word)];
                matches.forEach(match =>
                    callback(match.index, match.index + match[0].length)
                );
            });
        }

        function RelationalAlgebraStrategy(contentBlock, callback) {
            findWithRegex(RA_OPERATORS, contentBlock, callback);
        }

        const RelationalAlgebraDecorator = ({children}) => {
            return <span style={{color: "purple"}}>{children}</span>;
        };

        const compositeDecorator =
            new CompositeDecorator([
                {
                    strategy: RelationalAlgebraStrategy,
                    component: RelationalAlgebraDecorator
                }
            ]);

        this.state = {
            editorState: EditorState.createEmpty(compositeDecorator),
            latexTextFieldContent: "",
            savedQueries: JSON.parse(localStorage.getItem('savedQueries')) || []
        };

        this.compositeDecorator = compositeDecorator;

        this.focus = () => this.editorRef.current.focus();
        this.onChange = (editorState) => {
            this.setState({editorState});
            this.setState({
                latexTextFieldContent: "$$" + this.getCurrentText(editorState) + "$$"
            });

            this.props.handleTextChange(this.getCurrentText(editorState));
        }

        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.insertText = this.insertText.bind(this);
        this.getCurrentText = this.getCurrentText.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.setText = this.setText.bind(this);
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);
        this.removeSavedQuery = this.removeSavedQuery.bind(this);

        this.lastHitKey = 4;
        this.editorRef = React.createRef();
    }

    componentDidMount() {
        this.editorRef.current.focus();
    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _mapKeyToEditorCommand(e) {
        this.lastHitKey = e;

        return getDefaultKeyBinding(e);
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    handleMouseDown(symbol) {
        let newState = undefined;

        if (symbol === 'σ' || symbol === 'π' || symbol === 'ρ') {
            newState = this.insertText(symbol + "_{}()", this.state.editorState, 3);
        } else {
            newState = this.insertText(symbol, this.state.editorState, 1);
        }

        this.onChange(newState);
    }

    setText(text, cursorOffset = 0) {
        let newState = this.insertText(text, EditorState.createEmpty(this.compositeDecorator), cursorOffset);
        this.onChange(newState);
    }

    insertText(text, editorState, cursorOffset) {

        const currentContent = editorState.getCurrentContent(),
            currentSelection = editorState.getSelection();

        const newSelection = currentSelection.merge({
            anchorOffset: currentSelection.getAnchorOffset() + cursorOffset,
            focusOffset: currentSelection.getAnchorOffset() + cursorOffset,
        });

        const newContent = Modifier.replaceText(
            currentContent,
            currentSelection,
            text
        );

        const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');
        return EditorState.forceSelection(newEditorState, newSelection);
    }

    getCurrentText(editorState) {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;

        return blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    }

    clear() {
        this.setText("", 0);
    }

    save() {
        if (this.state.savedQueries.length <= 40) {
            let newSavedQueries = [...this.state.savedQueries, this.getCurrentText(this.state.editorState)];

            this.setState({savedQueries: newSavedQueries});

            localStorage.setItem("savedQueries", JSON.stringify(newSavedQueries));
        }
    }

    removeSavedQuery(queryNumber) {
        if (queryNumber >= 1 && queryNumber <= this.state.savedQueries.length) {
            let newSavedQueries = this.state.savedQueries;
            newSavedQueries.splice(queryNumber - 1, 1);

            this.setState({savedQueries: newSavedQueries});

            localStorage.setItem("savedQueries", JSON.stringify(newSavedQueries));
        }
    }

    render() {
        const {editorState} = this.state;

        return (
            <>
                <SavedQueriesPanel>
                    {this.state.savedQueries.map((savedQuery, idx) =>
                        <SavedQuery key={idx}
                                    content={savedQuery}
                                    number={idx + 1}
                                    setText={this.setText}
                                    removeSavedQuery={this.removeSavedQuery}/>)}
                </SavedQueriesPanel>
                <InputButtonsPanel handleMouseDown={this.handleMouseDown}/>
                <RichTextEditorWrapper>
                    <SaveQueryButton handleSaveClick={this.save}
                                     handleClearClick={this.clear}/>
                    <RandomQueryButton handleClick={this.props.fetchRandomQuery}/>
                    <StyledRichTextEditor onClick={this.focus}>
                        <Editor
                            blockStyleFn={null}
                            customStyleMap={null}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            keyBindingFn={this.mapKeyToEditorCommand}
                            onChange={this.onChange}
                            placeholder="Enter a query..."
                            ref={this.editorRef}/>
                    </StyledRichTextEditor>
                </RichTextEditorWrapper>
            </>
        );
    }
}

RichTextEditor.propTypes = {
    handleTextChange: PropTypes.func.isRequired
};

const RichTextEditorWrapper = styled.div`
  font-family: "Computer Modern Sans", sans-serif;
  background-image: var(--almost-white-gradient);
  font-size: 14px;
  box-shadow: var(--box-shadow);
  color: #1a2930;
  padding: 0 15px 0 15px;
  position: relative;
`

const StyledRichTextEditor = styled.div`
  cursor: text;
  font-size: 40px;
  margin-top: 4px;

  .RichEditor-editor {
    cursor: text;
    font-size: 40px;
    margin-top: 4px;
  }

  .RichEditor-editor .public-DraftEditorPlaceholder-root,
  .RichEditor-editor .public-DraftEditor-content {
    padding: 15px;
  }

  .RichEditor-editor .public-DraftEditor-content {

  }

  .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root {
    display: none;
  }

  .RichEditor-editor .RichEditor-blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-family: 'Hoefler Text', 'Georgia', serif;
    font-style: italic;
    margin: 16px 0;
    padding: 10px 20px;
  }

  .RichEditor-editor .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    font-size: 16px;
    padding: 20px;
  }

  .RichEditor-controls {
    font-family: 'Helvetica', sans-serif;
    font-size: 14px;
    margin-bottom: 5px;
    user-select: none;
  }

  .RichEditor-styleButton {
    color: #999;
    cursor: pointer;
    margin-right: 16px;
    padding: 2px 0;
    display: inline-block;
  }

  .RichEditor-activeButton {
    color: #5890ff;
  }

  .public-DraftEditorPlaceholder-root, .public-DraftEditor-content {
    padding: 15px;
  }

  .RichEditor-blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-family: 'Hoefler Text', 'Georgia', serif;
    font-style: italic;
    margin: 16px 0;
    padding: 10px 20px;
  }

  .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    font-size: 16px;
    padding: 20px;
  }
`;

const SavedQueriesPanel = styled.div`
  display: flex;
  margin: 0 auto -0.5px auto;
`

export default RichTextEditor;