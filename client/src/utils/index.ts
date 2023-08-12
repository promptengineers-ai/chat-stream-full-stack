

export function truncate(str: String, n: number) {
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

export function truncateFromCenter(fullStr: string, strLen: number, separator: string) {
  if (fullStr.length <= strLen) return fullStr;
  
  separator = separator || '...';
  
  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow/2),
    backChars = Math.floor(charsToShow/2);
  
  return fullStr.substr(0, frontChars) + 
    separator + 
    fullStr.substr(fullStr.length - backChars);
};