import {
    CompositeDecorator,
    ContentState,
    convertToRaw,
    DraftHandleValue,
    Editor,
    EditorState,
    getDefaultKeyBinding,
    Modifier,
    RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {InputButtonsPanel} from "./controls/InputButtonsPanel";
import {RandomQueryButton} from "./controls/RandomQueryButton";
import {SaveQueryButton} from "./controls/SaveQueryButton";
import {SavedQuery} from "./SavedQuery";
import {MAX_NUM_OF_SAVED_QUERIES} from "./App";

type Props = {
    handleTextChange: any;
    fetchRandomQuery: any;
    text: string;
};

export const RichTextEditor = (props: Props) => {
    const RA_OPERATORS = [
        "π",
        "σ",
        "ρ",
        "∩",
        "∪",
        "\\\\",
        "÷",
        "⨯",
        "▷",
        "◁",
        "⋈",
        "⟕",
        "⟖",
        "⟗",
        "⋉",
        "⋊",
        "<\\*",
        "\\*>",
        "\\*",
        "⟨",
        "⟩",
        "\\[",
        "\\]",
    ];

    const findWithRegex = (words: string[], contentBlock: any, callback: any) => {
        const text = contentBlock.getText();

        words.forEach((word) => {
            const matches = [...text.matchAll(word)];
            matches.forEach((match) =>
                callback(match.index, match.index + match[0].length)
            );
        });
    };

    function RelationalAlgebraStrategy(contentBlock: any, callback: any) {
        findWithRegex(RA_OPERATORS, contentBlock, callback);
    }

    const RelationalAlgebraDecorator = (props: any) => {
        return <span style={{color: "purple"}}>{props.children}</span>;
    };

    const compositeDecorator = new CompositeDecorator([
        {
            strategy: RelationalAlgebraStrategy,
            component: RelationalAlgebraDecorator,
        },
    ]);

    const [editorState, setEditorState] = useState<EditorState>(
        EditorState.createWithContent(
            ContentState.createFromText(props.text),
            compositeDecorator
        )
    );

    const queriesFromStorage = localStorage.getItem("savedQueries");

    const [savedQueries, setSavedQueries] = useState<string[]>(
        queriesFromStorage ? JSON.parse(queriesFromStorage) : []
    );
    const editorRef = useRef<any>(null);
    const lastHitKey = useRef<number>(4);

    const focus = () => editorRef.current.focus();

    const onChange = (editorState: EditorState) => {
        setEditorState(editorState);
        props.handleTextChange(getCurrentText(editorState));
    };

    useEffect(() => {
        editorRef.current.focus();
    }, []);

    useEffect(() => {
        const cursorOffset =
            editorState.getSelection().getAnchorOffset() || props.text.length;

        const newState = insertText(
            props.text,
            EditorState.createEmpty(compositeDecorator),
            cursorOffset
        );

        setEditorState(newState);
    }, []);

    const _handleKeyCommand = (
        command: any,
        editorState: EditorState,
        eventTimeStamp: number
    ): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return "handled";
        }
        return "not-handled";
    };

    const _mapKeyToEditorCommand = (e: any) => {
        lastHitKey.current = e;

        return getDefaultKeyBinding(e);
    };

    const handleMouseDown = (symbol: string) => {
        let newState = undefined;

        if (symbol === "σ" || symbol === "π" || symbol === "ρ") {
            newState = insertText(symbol + "_{}()", editorState, 3);
        } else {
            newState = insertText(symbol, editorState, 1);
        }

        onChange(newState);
    };

    const setText = (text: string, cursorOffset = 0) => {
        const newState = insertText(
            text,
            EditorState.createEmpty(compositeDecorator),
            cursorOffset
        );

        onChange(newState);
    };

    const insertText = (
        text: string,
        editorState: EditorState,
        cursorOffset: number
    ) => {
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

        const newEditorState = EditorState.push(
            editorState,
            newContent,
            "insert-characters"
        );
        return EditorState.forceSelection(newEditorState, newSelection);
    };

    const getCurrentText = (editorState: EditorState) => {
        const blocks = convertToRaw(editorState.getCurrentContent())
            .blocks.map((block) => (!block.text.trim() && "\n") || block.text)
            .join("\n");

        if (blocks === "\n") return "";

        return blocks;
    };

    const clear = () => {
        setText("", 0);
    };

    const save = () => {
        if (savedQueries.length < MAX_NUM_OF_SAVED_QUERIES) {
            const newSavedQueries = [...savedQueries, getCurrentText(editorState)]; //TODO: pouzit prev

            setSavedQueries(newSavedQueries);

            localStorage.setItem("savedQueries", JSON.stringify(newSavedQueries));
        } else {
            alert(`You can only save ${MAX_NUM_OF_SAVED_QUERIES} queries.`);
        }
    };

    const removeSavedQuery = (queryNumber: number) => {
        if (queryNumber >= 1 && queryNumber <= savedQueries.length) {
            setSavedQueries((prev) => {
                const prevCopy = prev.filter((_, idx) => idx !== queryNumber - 1);

                localStorage.setItem("savedQueries", JSON.stringify(prevCopy));

                return prevCopy;
            });
        }
    };

    return (
        <>
            <SavedQueriesPanel id={'saved-queries-list'}>
                {savedQueries.map((savedQuery, idx) => (
                    <SavedQuery
                        key={idx} //TODO: Klic index
                        content={savedQuery}
                        number={idx + 1}
                        setText={setText}
                        removeSavedQuery={removeSavedQuery}
                    />
                ))}
            </SavedQueriesPanel>
            <InputButtonsPanel handleMouseDown={handleMouseDown}/>
            <RichTextEditorWrapper>
                <SaveQueryButton handleSaveClick={save} handleClearClick={clear}/>
                <RandomQueryButton handleClick={props.fetchRandomQuery}/>
                <StyledRichTextEditor onClick={focus}>
                    <Editor
                        editorState={editorState}
                        handleKeyCommand={_handleKeyCommand}
                        keyBindingFn={_mapKeyToEditorCommand}
                        onChange={onChange}
                        placeholder="Enter a query..."
                        ref={editorRef}
                    />
                </StyledRichTextEditor>
            </RichTextEditorWrapper>
        </>
    );
};

const RichTextEditorWrapper = styled.div`
    font-family: "Computer Modern Sans", sans-serif;
    background-image: var(--almost-white-gradient);
    font-size: 14px;
    box-shadow: var(--box-shadow);
    color: #1a2930;
    padding: 0 15px 0 15px;
    position: relative;
`;

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
        font-family: "Hoefler Text", "Georgia", serif;
        font-style: italic;
        margin: 16px 0;
        padding: 10px 20px;
    }

    .RichEditor-editor .public-DraftStyleDefault-pre {
        background-color: rgba(0, 0, 0, 0.05);
        font-family: "Inconsolata", "Menlo", "Consolas", monospace;
        font-size: 16px;
        padding: 20px;
    }

    .RichEditor-controls {
        font-family: "Helvetica", sans-serif;
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

    .public-DraftEditorPlaceholder-root,
    .public-DraftEditor-content {
        padding: 15px;
    }

    .RichEditor-blockquote {
        border-left: 5px solid #eee;
        color: #666;
        font-family: "Hoefler Text", "Georgia", serif;
        font-style: italic;
        margin: 16px 0;
        padding: 10px 20px;
    }

    .public-DraftStyleDefault-pre {
        background-color: rgba(0, 0, 0, 0.05);
        font-family: "Inconsolata", "Menlo", "Consolas", monospace;
        font-size: 16px;
        padding: 20px;
    }
`;

const SavedQueriesPanel = styled.div`
    display: flex;
    margin: 0 auto -0.5px auto;
`;

export default RichTextEditor;
