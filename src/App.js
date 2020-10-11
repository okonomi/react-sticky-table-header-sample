import React from "react";
import Table from "./Table";

export default function App() {
  return (
    <>
      <h1 className="text-4xl mb-20">スクロール固定</h1>
      <Table />
      <div className="h-screen bg-gray-400">フッタ</div>
    </>
  );
}
