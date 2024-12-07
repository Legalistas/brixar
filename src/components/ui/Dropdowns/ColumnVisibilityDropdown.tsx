"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Columns4, List } from "lucide-react";

interface ColumnVisibilityDropdownProps {
  columns: { id: string; header: string }[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
}

const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columns = [],
  visibleColumns = [],
  setVisibleColumns,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
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

  const handleSelectionChange = (columnId: string) => {
    setVisibleColumns(
      visibleColumns.includes(columnId)
        ? visibleColumns.filter((id) => id !== columnId)
        : [...visibleColumns, columnId]
    );
    console.log(visibleColumns);
  };

  const handleToggleAll = () => {
    setVisibleColumns(
      visibleColumns.length === columns.length
        ? []
        : columns.map((col) => col.id)
    );
  };

  const filteredColumns = columns.filter(
    (column) => column.id !== "selected" && column.id !== "actions"
  );

  const allColumnsVisible = visibleColumns.length === filteredColumns.length;

  if (columns.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        <Columns4 className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={handleToggleAll}
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              {allColumnsVisible ? "Ocultar todos" : "Mostrar todos"}
            </button>
            {filteredColumns.map((column) => (
              <label
                key={column.id}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={visibleColumns.includes(column.id)}
                  onChange={() => handleSelectionChange(column.id)}
                />
                <span className="ml-2">{column.header}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilityDropdown;
