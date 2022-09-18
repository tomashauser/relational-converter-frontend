export const symbolToLatexMap = new Map([
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

export const getLatexToSymbolMap = () => {
  const newEntries: [string, string][] = [];

  symbolToLatexMap.forEach((key, value) => {
    newEntries.push([key.replaceAll(" ", ""), value]);
  });

  return new Map(newEntries);
};

export const getContentForConversion = (text: string) => {
  if (text == null || text.length === 0) {
    return "";
  }

  text = text
    .split("")
    .map((char) => charToLatex(char))
    .join("")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");

  text = "$$" + text + "$$";

  return text;
};

export const charToLatex = (char: string) => {
  if (symbolToLatexMap.has(char)) {
    return symbolToLatexMap.get(char);
  }

  return char;
};
