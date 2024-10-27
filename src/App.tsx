import {useState} from "react";
import styled from "styled-components";
import {ConvertButtonsPanel} from "./controls/ConvertButtonsPanel";
import {NotationSwitch} from "./controls/NotationSwitch";
import {InputSchemaPanel} from "./InputSchemaPanel";
import {QueryView} from "./QueryView";
import {RichTextEditor} from "./RichTextEditor";
import {SwitchCardPanel} from "./SwitchCardPanel";
import {getContentForConversion, latexToSymbolMap, replaceLatexSymbols} from "./utils";
import {pipe} from "fp-ts/function";
import * as S from 'fp-ts/String';
import * as A from 'fp-ts/ReadonlyArray';
import {Do} from "fp-ts/Array";


const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const MAX_NUM_OF_SAVED_QUERIES = 40;

type Props = {
    className?: string;
};

export const App = (props: Props) => {
    const schemaInputRows = 3;
    const schemaInputCols = 2;

    const savedSchema = localStorage.getItem("schema");

    const defaultSchemaInput = savedSchema
        ? JSON.parse(savedSchema)
        : [...Array(schemaInputRows).keys()].map(() =>
            [...Array(schemaInputCols).keys()].map(() => [])
        );

    const [textEditorContent, setTextEditorContent] = useState<string>("");
    const [apiText, setApiText] = useState<string>("");
    const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
    const [standardChosen, setStandardChosen] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [justArrived, setJustArrived] = useState<boolean>(true);
    const [schemaInput, setSchemaInput] =
        useState<string[][]>(defaultSchemaInput);
    const [switchValues, setSwitchValues] = useState<Map<string, boolean>>(
        new Map([
            ["semanticChecking", false],
            ["formatting", false],
            ["prenexForm", false],
        ])
    );

    const updateContent = (newLatexContent: string) => setTextEditorContent(newLatexContent);

    const showLoaderConditionally = () => {
        if (justArrived) {
            setJustArrived(false);
            setIsLoading(true);
        }
    };

    const fetchRandomQuery = () => {
        const address = BACKEND_URL + "getRandomQuery";

        setIsLoading(false);

        showLoaderConditionally();

        fetch(address)
            .then((r) => r.text())
            .then((r) => {
                for (const [key, value] of latexToSymbolMap) {
                    r = r.replaceAll(key, value);
                }
                debugger;

                setTextEditorContent(r);
                setIsLoading(false);
            });
    };

    const fetchConversion = (url: string, data: any) => {
        url = BACKEND_URL + url;

        setIsLoading(false);

        showLoaderConditionally();

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: data,
        })
            .then((r) => {
                setErrorOccurred(r.status !== 200);
                return r;
            })
            .then((r) => r.text())
            .then((r) => {
                setApiText(r);
                setIsLoading(false);
            });
    };

    const fetchNotationConversion = () => {
        const data: any = new Object();

        data.expression = getContentForConversion(textEditorContent);
        data.schema = getSchemaInputValues();
        data.options = Object.fromEntries(switchValues);

        const url = standardChosen
            ? "/convert/standardToSimplified"
            : "/convert/simplifiedToStandard";

        fetchConversion(url, JSON.stringify(data));
    };

    const fetchAtomicConversion = () => {
        const data: any = {};

        data.expression = getContentForConversion(textEditorContent);
        data.schema = getSchemaInputValues();
        data.options = Object.fromEntries(switchValues);

        const notationString = standardChosen ? "standard" : "simplified";

        fetchConversion(`/convert/${notationString}ToTRC`, JSON.stringify(data));
    };

    const handleNotationSwitch = (standardChosen: boolean) => {
        setStandardChosen(standardChosen);
    };

    const getSchemaInputValues = () => {
        const strings = schemaInput
            .filter((el) => el[0].length !== 0)
            .flatMap((row) =>
                row.map((el) => (typeof el === "string" ? el.replace(/ /g, "") : ""))
            );

        return strings.map((s) => {
            const idxLeftPar = s.indexOf("(");
            const idxRightPar = s.indexOf(")");

            return [
                s.slice(0, idxLeftPar),
                s.slice(idxLeftPar + 1, idxRightPar).split(","),
            ];
        });
    };

    const handleSwitch = (name: string, newValue: boolean) => {
        setSwitchValues((prev) => {
            const newMap = new Map(prev);

            newMap.set(name, newValue);

            localStorage.setItem(
                "switches",
                JSON.stringify(Object.fromEntries(newMap))
            );

            return newMap;
        });
    };

    const handleSchemaInputChange = (
        row: number,
        col: number,
        newVal: string
    ) => {
        setSchemaInput((prev) => {
            const prevCopy = [...prev];
            prevCopy[row][col] = newVal;

            localStorage.setItem("schema", JSON.stringify(prevCopy));

            return prevCopy;
        });
    };

    const handleMoveToTextEditorButtonClick = (text: string) => {
        for (const [key, value] of latexToSymbolMap) {
            text = text.replaceAll(key, value);
        }

        setTextEditorContent(text);
    };

    return (
        <AppWrapper>
            <link
                href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
                rel="stylesheet"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdn.rawgit.com/dreampulse/computer-modern-web-font/master/fonts.css"
            />
            <div className="text-editor-wrapper">
                <RichTextEditor
                    handleTextChange={updateContent}
                    text={textEditorContent}
                    fetchRandomQuery={fetchRandomQuery}
                />
            </div>
            <QueryView
                content={textEditorContent}
                updateLatexContent={updateContent}
                errorOccurred={errorOccurred}
                label="LaTeX input view"
                isInput={true}
                formattingEnabled={false}
            />
            <QueryView
                content={apiText}
                isInput={false}
                isLoading={isLoading}
                updateLatexContent={updateContent}
                formattingEnabled={switchValues.get("formatting") ?? false}
                errorOccurred={errorOccurred}
                handleMoveToTextEditorButtonClick={handleMoveToTextEditorButtonClick}
                label="LaTeX output view"
            />
            <ButtonsAndSchemaSection>
                <ConvertButtonsWrapper>
                    <label className="controls-label">Conversion controls</label>
                    <NotationSwitch handleNotationSwitch={handleNotationSwitch}/>
                    <ConvertButtonsPanel
                        fetchNotationConversion={fetchNotationConversion}
                        fetchAtomicConversion={fetchAtomicConversion}
                        standardChosen={standardChosen}
                        updateContent={updateContent}
                    />
                </ConvertButtonsWrapper>
                <StyledSwitchCardPanel
                    handleSwitch={handleSwitch}
                    className={props.className}
                />
                <InputSchemaPanel
                    rows={schemaInputRows}
                    columns={schemaInputCols}
                    defaultValues={schemaInput}
                    handleChange={handleSchemaInputChange}
                />
            </ButtonsAndSchemaSection>
        </AppWrapper>
    );
};

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
`;

const StyledSwitchCardPanel = styled(SwitchCardPanel)`
    box-shadow: var(--box-shadow);
`;
