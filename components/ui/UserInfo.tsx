import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const [isDropDownMenuVisible, setIsDropDownMenuVisible] = useState(false);
  const session = useSession();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropDownMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsDropDownMenuVisible((prev) => !prev)}>
        {session.data?.user?.username}
      </button>
      {isDropDownMenuVisible && (
        <div className="absolute right-0 top-7 border rounded-md w-24 p-3 flex flex-col gap-2 text-center">
          <button onClick={() => signOut()}>Sign Out</button>
          <div>Test</div>
        </div>
      )}
    </div>
  );
}
