"use client";

import { useRef, useEffect } from "react";

/**
 * Custom hook to safely check if a component is mounted
 * This helps prevent memory leaks and errors from updating unmounted components
 */
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
