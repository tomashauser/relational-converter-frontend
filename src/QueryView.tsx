import {useEffect, useRef} from "react";
import styled from "styled-components";
import copyIcon from "./images/copy-icon.png";
import upArrow from "./images/up-arrow.png";
import {Loader} from "./Loader";
// @ts-ignore
import katex from "katex/dist/katex.mjs";
import {charToLatex} from "./utils";
import {flow, pipe} from "fp-ts/function";
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/String';
import * as A from 'fp-ts/ReadonlyArray';
import {identity} from "fp-ts";

type Props = {
    content: string;
    updateLatexContent: any;
    errorOccurred: boolean;
    label: string;
    isInput: boolean;
    isLoading?: boolean;
    formattingEnabled: boolean;
    handleMoveToTextEditorButtonClick?: any;
};

export const QueryView = (props: Props) => {
    const convertedText = useRef<string>("");

    const renderToKatex = (text: string): void => katex.render(text, document.getElementById("query-view-input-true"), {
        throwOnError: false,
        displayMode: true,
    });

    const convertToLatex = (text: string): string => pipe(
        text,
        S.split(""),
        A.map(charToLatex),
        (s) => s.join(""),
        S.replace(/[\u200B-\u200D\uFEFF]/g, ""),
        S.replace(/\\leftouterjoin/g, '⟕'),
        S.replace(/\\rightouterjoin/g, '⟖'),
        S.replace(/\\fullouterjoin/g, '⟗'),
    );
    

    const convertFromAPIToLatex = (text: string) => {
        if (text == null || text.length === 0) {
            return "";
        }

        if (!props.errorOccurred) {
            text = text
                .replaceAll("\\leftouterjoin", "⟕")
                .replaceAll("\\rightouterjoin", "⟖")
                .replaceAll("\\fullouterjoin", "⟗");

            const operators = [
                " \\bowtie ",
                " ⟕ ",
                " ⟖ ",
                " ⟗ ",
                " \\rtimes ",
                " \\ltimes ",
                " \\triangleright ",
                " \\triangleleft ",
                " \\cap ",
                " \\cup ",
                " \\setminus ",
                " \\div ",
                " *_{L} ",
                " *_{R} ",
                " *_{F} ",
                " \\times ",
                " \\ltimes ",
                " \\rtimes ",
                " \\langle * ",
                "*\\rangle",
            ]; // TODO: pole operatoru je v projektu dvakrat

            if (props.formattingEnabled) {
                for (let i = 0; i < operators.length; i++) {
                    const current = operators[i];

                    text = text.replaceAll(current, " \\\\ " + current + " \\\\ ");
                }

                text = "\\begin{gathered}" + text + "\\end{gathered}";
            }
        } else {
            return "";
        }

        katex.render(text, document.getElementById("query-view-input-false"), {
            throwOnError: false,
            displayMode: true,
        });

        return text;
    };

    useEffect(() => {
        if (props.isInput) {
            convertedText.current = convertToLatex(props.content);
            renderToKatex(convertedText.current);
        } else {
            convertedText.current = convertFromAPIToLatex(props.content);
        }
    });

    return (
        <div style={{position: "relative", whiteSpace: "break-spaces"}}>
            <QueryViewLabel>{props.label}</QueryViewLabel>
            <StyledQueryView id={`query-view-input-${props.isInput}`} data-error={props.errorOccurred}>
                {props.errorOccurred && !props.isInput ? (
                    props.content.replaceAll(".", ".\n")
                ) : (
                    <></>
                )}
            </StyledQueryView>
            {!props.isInput &&
                props.content.length !== 0 &&
                !props.errorOccurred &&
                props.content.slice(0, 2) !== "\\{" &&
                !props.formattingEnabled && (
                <>
                    <SideButton
                        onClick={() =>
                            props.handleMoveToTextEditorButtonClick(convertedText.current)
                        }
                        title='Move to input'
                        id='move-to-input-button'
                    >
                        <img src={upArrow} alt="arrow up"/>
                    </SideButton>
                    <SideButton
                        onClick={() => window.prompt("Copy:", props.content)}
                        marginTop="4em"
                    >
                        <img src={copyIcon} alt="copy"/>
                    </SideButton>
                </>
            )}
            {props.isLoading && !props.isInput ? <Loader/> : <></>}
        </div>
    );
};

const SideButton = styled.div<{ marginTop?: string }>`
    position: absolute;
    top: ${({marginTop}) => marginTop ?? "1em"};
    right: 1em;

    img {
        cursor: pointer;
        width: 2em;
        height: 2em;

        filter: invert(67%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(104%) contrast(96%);

        &:hover {
            transform: translateY(0.2px);
            filter: invert(0%) sepia(89%) saturate(7500%) hue-rotate(211deg) brightness(107%) contrast(94%);
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
`;

const QueryViewLabel = styled.label`
    color: white;
    position: absolute;
    font-size: 1.25rem;
    top: -1.5em;
    left: 0.1em;
`;
