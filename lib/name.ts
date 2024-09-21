export const trimName = (name: string): string => {
  const symbols = ["(", "-", "《"];

  // Find the first occurrence of any of the symbols
  const index = Math.min(
    ...symbols.map((symbol) => name.indexOf(symbol)).filter((i) => i !== -1)
  );

  // If a symbol is found, slice the string up to that index
  return index === Infinity ? name : name.slice(0, index).trim();
};

export const compareNames = (name1: string, name2: string): boolean => {
  // Convert to lowercase and remove spaces
  const formatName = (name: string) => name.toLowerCase().replace(/\s+/g, "");

  return formatName(name1) === formatName(name2);
};
