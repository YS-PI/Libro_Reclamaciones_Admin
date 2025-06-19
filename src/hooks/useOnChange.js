import { useEffect, useRef } from "react";

const useOnchange = (onchangefunction, variable) => {
  const firstAttempt = useRef();

  useEffect(() => {
    if (firstAttempt.current !== undefined) {
      onchangefunction();
    }
    firstAttempt.current = "value";
  }, [JSON.stringify(variable)]);

  return [];
};

export default useOnchange;
