import { useLayoutEffect } from "react";

const getPageScrollPosition = (pageName: string) => {
  return JSON.parse(sessionStorage.getItem(pageName) || "{}");
};
const setPageScrollPosition = (pageName: string, position: number) => {
  sessionStorage.setItem(pageName, JSON.stringify(position));
};
const useInitScrollPosition = (pageName: string) => {
  useLayoutEffect(() => {
    const prevScrollPosition = getPageScrollPosition(pageName) || 0;
    window.scroll(0, prevScrollPosition);
    return () => {
      setPageScrollPosition(pageName, document.body.scrollTop);
    };
  }, [pageName]);
};

export default useInitScrollPosition;
