import { useEffect, useState } from "react";

export default function useLocalStorage(key: string) {
  const [item, setItem] = useState<string | null>();

  useEffect(() => {
    const itemLocalStorage = localStorage.getItem(key);
    itemLocalStorage ? setItem(itemLocalStorage) : setItem(null);
  }, [key]);

  return item;
}
