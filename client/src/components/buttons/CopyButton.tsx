import { useState } from 'react';

function CopyButton({ copyText }: { copyText: string}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      <i className="fas fa-copy"></i>
      {copied && <span>Copied!</span>}
    </button>
  );
}

export default CopyButton;
