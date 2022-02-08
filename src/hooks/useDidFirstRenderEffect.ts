import { useEffect, useRef } from 'react';

export const useDidFirstRenderEffect = (func: () => void, deps: any[]) => {
  const didFirstRender = useRef(false);

  useEffect(() => {
    if (didFirstRender.current) func();
    else didFirstRender.current = true;
  }, deps);
};
