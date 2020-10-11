import React from "react";

export default function TableBody({ tableBodyStyle, tableBodyRef }) {
  console.log("  <TableBody>");
  return (
    <div className="overflow-auto" style={tableBodyStyle} ref={tableBodyRef}>
      <table>
        <tbody>
          {[...Array(10).keys()].map((j) => (
            <tr key={`tr${j}`}>
              <th className="bg-blue-800 p-4 sticky left-0">bh{j}</th>
              {[...Array(50).keys()].map((i) => (
                <td className="bg-green-800 p-4" key={`td${i}`}>
                  b{i}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
