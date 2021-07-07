import { useEffect, useState } from "react";

export default function Delayed({
  delay,
  children,
}: {
  delay: number;
  children: JSX.Element | JSX.Element[];
}) {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => {
      clearTimeout(timer);
      // setShouldRender(false);
    };
  });

  return shouldRender ? <>{children}</> : <></>;
}
