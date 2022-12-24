import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Home() {

  const textArray = [
    "lim_{x rightarrow a} f(x) = L if for any epislon > 0, there exists an delta > 0 such that if 0 < |x - a| < delta, we have |f(x) - L| < a",
    "(ET) There exists a infinite number of primes",
    "(UFT) Any prime number can be represented uniquely by the products of primes apart from their order",
  ];

  const text = textArray[2];

  const [textToType] = useState(text);
  const [typedText, setTypedText] = useState("");
  const parts = useMemo(() => {
    const splitTextToType = textToType.split("");
    let endIndexMatch = 0;
    for (let i=0; i<splitTextToType.length; i++) {
      const index = i;
      const s = splitTextToType[i];
      if (s !== typedText[index]) {
        endIndexMatch = index;
        break;
      }
    }
    return {
      matchedPart: textToType.slice(0, endIndexMatch),
      unmatchedPart: textToType.slice(endIndexMatch)
    };
  }, [textToType, typedText]);

  if (parts.unmatchedPart.length > 1) {
      return (
        <div style={{justifyContent: "center", 
                    display: "flex",
                    flexDirection: "column",
                    WebkitJustifyContent: "space-around",
                    alignItems: "center",
                    height: "100vh"}}>
          <div>
            <b style={{color: "green"}}>{typedText}</b>
            {parts.unmatchedPart}
          </div>
          <div>
            {textToType}
          </div>
          <form>
          <input
            type="text"
            value={typedText} 
            onChange={(e) => setTypedText(e.target.value)}
            style={{ width: "100px", height: "100px"}}/>
          </form>
        </div>
      );
    } else {
    return (
      <div>
        Done!
      </div>
    );
  }
}
