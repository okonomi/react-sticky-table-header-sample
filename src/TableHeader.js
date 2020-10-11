import React from "react";

export default function TableHeader({ tableHeaderStyle, tableHeaderRef }) {
  console.log("  <TableHeader>");
  return (
    <div
      className="overflow-auto z-10"
      style={tableHeaderStyle}
      ref={tableHeaderRef}
    >
      <table>
        <thead>
          {[...Array(3).keys()].map((j) => (
            <tr key={`tr${j}`}>
              <th className="bg-blue-600 p-4 sticky left-0">hh{j}</th>
              {[...Array(50).keys()].map((i) => (
                <th className="bg-green-600 p-4" key={`th${i}`}>
                  h{i}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
}
