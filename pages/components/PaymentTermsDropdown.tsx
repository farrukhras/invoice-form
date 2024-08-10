import React, { useState, useRef, useEffect } from "react";

interface PaymentTermsDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const PaymentTermsDropdown: React.FC<PaymentTermsDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="mt-1 relative" ref={dropdownRef}>
      <div
        className="cursor-pointer py-2.5 px-3.5 border border-[#D0D5DD] rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-[#F2F4F7] rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-3 cursor-pointer hover:bg-[#F9FAFB] font-normal text-[#344054] text-sm"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentTermsDropdown;
