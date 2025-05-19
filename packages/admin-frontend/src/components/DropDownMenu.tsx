import { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";

type props = { fullName: string; userId: string };

const DropdownMenu = ({ fullName, userId }: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event &&
        event.target !== null &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="inline-block relative text-right"
      dir="rtl"
      ref={dropdownRef}
    >
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center gap-x-1.5 bg-white py-2 rounded-md w-full text-gray-900 text-sm cursor-pointer x-3"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <BsThreeDots size={16} />
        </button>
      </div>

      {isOpen && (
        <div
          className="left-0 z-10 absolute bg-white opacity-100 shadow-lg mt-2 rounded-md focus:outline-hidden ring-1 ring-black/5 w-56 scale-100 origin-top-right transition duration-100 ease-out transform"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <header className="space-y-0.5 border-b border-b-gray-300">
            <div className="mx-4 my-2">
              <p>شناسه : {userId}</p>
              <p>{fullName}</p>
            </div>
          </header>
          <div className="py-1" role="none">
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 text-sm"
              role="menuitem"
              id="menu-item-0"
            >
              ویرایش کاربر
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
