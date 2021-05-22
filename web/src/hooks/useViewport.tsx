import { useEffect, useState } from "react";

const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const resizeListener = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  });

  return width;
};

export default useViewport;
