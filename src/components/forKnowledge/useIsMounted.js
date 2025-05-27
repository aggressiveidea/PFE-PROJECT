import { useRef, useEffect } from "react";

export default function useIsMounted() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    console.log("Component mounted");

    return () => {
      isMountedRef.current = false;
      console.log("Component unmounted");
    };
  }, []);

  return isMountedRef;
}
