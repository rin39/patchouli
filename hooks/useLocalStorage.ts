import { useEffect, useState } from "react";

export default function useLocalStorage(key: string) {
  const [item, setItem] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const itemLocalStorage = localStorage.getItem(key);
      itemLocalStorage && setItem(itemLocalStorage);
    }
  }, []);

  return item;
}
