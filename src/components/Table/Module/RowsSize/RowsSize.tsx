import { Rows4 } from "lucide-react";
import React from "react";

interface RowsSizeProps {
  pageSize: number;
  setPageSize: (size: number) => void;
}

const RowsSize: React.FC<RowsSizeProps> = ({ pageSize, setPageSize }) => (
  <select
    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100 cursor-pointer"
    value={pageSize}
    onChange={(e) => {
      setPageSize(Number(e.target.value));
    }}
  >
    {[10, 20, 30, 40, 50].map((size) => (
      <option key={size} value={size}>
        {size} filas
      </option>
    ))}
  </select>
);

export default RowsSize;
