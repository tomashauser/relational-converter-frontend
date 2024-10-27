import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/String';
import * as A from 'fp-ts/ReadonlyArray';
import {flow, pipe} from "fp-ts/function";

const symbolToLatexMap = new Map([
    ["π", " \\pi"],
    ["σ", " \\sigma"],
    ["ρ", " \\rho"],
    ["∧", " \\land "],
    ["∨", " \\lor "],
    ["¬", " \\lnot "],
    ["≠", " \\neq "],
    ["≥", " \\geq "],
    ["≤", " \\leq "],
    ["∩", " \\cap "],
    ["∪", " \\cup "],
    ["\\", " \\setminus "],
    ["÷", " \\div "],
    ["⨯", " \\times "],
    ["→", " \\rightarrow "],
    ["◁", " \\triangleleft "],
    ["▷", " \\triangleright "],
    ["⋈", " \\bowtie "],
    ["⟕", " \\leftouterjoin "],
    ["⟖", " \\rightouterjoin "],
    ["⟗", " \\fullouterjoin "],
    ["⋉", " \\ltimes "],
    ["⋊", " \\rtimes "],
    ["⟨", "\\langle "],
    ["⟩", " \\rangle "],
]);

const fromCharsToString = (text: readonly string[]) => text.join("");
const includeLatexDollars = (text: string) => `$$${text}$$`;
const removeSpaces = (text: string) => text.replaceAll(" ", "");
export const charToLatex = (char: string): string => symbolToLatexMap.get(char) ?? char;

export const latexToSymbolMap = pipe(
    symbolToLatexMap,
    (v) => [...v],
    A.map(([key, val]) => [removeSpaces(val), key] as const),
    (v) => new Map(v)
)

export const getContentForConversion = flow(
    S.split(""),
    A.map(charToLatex),
    fromCharsToString,
    includeLatexDollars,
    S.replace(/[\u200B-\u200D\uFEFF]/g, "")
)

export const replaceLatexSymbols = (text: string): string =>
    pipe(
        [...latexToSymbolMap],
        A.reduce(text, (acc, [key, value]) => acc.replaceAll(key, value))
    );
