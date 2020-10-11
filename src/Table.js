import React, { useState, useRef, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function useStickyTableHeader() {
  console.log("  useStickyTableHeader");
  const [mode, setMode] = useState("normal");
  console.log("    mode = " + mode);

  const [tableHeaderStyle, setTableHeaderStyle] = useState({
    position: "static",
    top: null,
    left: null,
    width: null
  });
  const [tableBodyStyle, setTableBodyStyle] = useState({
    paddingTop: null
  });

  const tableRef = useRef();
  const tableHeaderRef = useRef();
  const tableBodyRef = useRef();

  // table size
  const [tableRect, setTableRect] = useState({
    left: null,
    bottom: null,
    width: null
  });

  useEffect(() => {
    console.log("useEffect: table size");
    let { left, bottom, width } = tableRef.current.getBoundingClientRect();
    bottom += window.pageYOffset;

    setTableRect({
      left,
      bottom,
      width
    });

    const handleWindowResize = () => {
      setTableRect((prev) => ({
        ...prev,
        width: tableRef.current.getBoundingClientRect().width
      }));
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [tableRef, setTableRect]);

  // table header size
  const [tableHeaderRect, setTableHeaderRect] = useState({
    top: null,
    height: null
  });

  useEffect(() => {
    console.log("useEffect: table header size");
    let { top, height } = tableHeaderRef.current.getBoundingClientRect();
    top += window.pageYOffset;

    setTableHeaderRect({
      top,
      height
    });
  }, [tableHeaderRef, setTableHeaderRect]);

  // table header width
  useEffect(() => {
    console.log("useEffect: table header width");
    setTableHeaderStyle((prev) => ({
      ...prev,
      width: tableRect.width
    }));
  }, [setTableHeaderStyle, tableRect]);

  // table scroll
  useEffect(() => {
    console.log("useEffect: table scroll");
    const tableHeader = tableHeaderRef.current;
    const tableBody = tableBodyRef.current;

    const handleTableScroll = (e) => {
      const scrollY = e.target.scrollLeft;
      tableHeader.scrollTo({ top: 0, left: scrollY });
      tableBody.scrollTo({ top: 0, left: scrollY });
    };

    tableHeader.addEventListener("scroll", handleTableScroll);
    tableBody.addEventListener("scroll", handleTableScroll);

    return () => {
      tableHeader.removeEventListener("scroll", handleTableScroll);
      tableBody.removeEventListener("scroll", handleTableScroll);
    };
  }, [tableRef, tableHeaderRef]);

  // page scroll
  useEffect(() => {
    console.log("useEffect: page scroll");
    const handleWindowScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY >= tableRect.bottom - tableHeaderRect.height) {
        setMode("away");
      } else if (scrollY >= tableHeaderRect.top) {
        setMode("fixed");
      } else {
        setMode("normal");
      }
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [setMode, tableRect, tableHeaderRect]);

  // update style
  useEffect(() => {
    console.log("useEffect: update style");
    switch (mode) {
      case "normal":
        setTableHeaderStyle((prev) => ({
          ...prev,
          position: "static",
          top: null,
          left: null
        }));
        setTableBodyStyle((prev) => ({
          ...prev,
          paddingTop: null
        }));
        break;
      case "fixed":
        setTableHeaderStyle((prev) => ({
          ...prev,
          position: "fixed",
          top: 0,
          left: tableRect.left
        }));
        setTableBodyStyle((prev) => ({
          ...prev,
          paddingTop: tableHeaderRect.height
        }));
        break;
      case "away":
        setTableHeaderStyle((prev) => ({
          ...prev,
          position: "absolute",
          top: tableRect.bottom - tableHeaderRect.height,
          left: tableRect.left
        }));
        setTableBodyStyle((prev) => ({
          ...prev,
          paddingTop: tableHeaderRect.height
        }));
        break;
      default:
        break;
    }
  }, [
    mode,
    setTableHeaderStyle,
    setTableBodyStyle,
    tableRect,
    tableHeaderRect
  ]);

  return {
    tableRef,
    tableHeaderRef,
    tableBodyRef,
    tableHeaderStyle,
    tableBodyStyle
  };
}

export default function Table() {
  console.log("<Table>");
  const {
    tableRef,
    tableHeaderRef,
    tableBodyRef,
    tableHeaderStyle,
    tableBodyStyle
  } = useStickyTableHeader();

  return (
    <div className="m-4" ref={tableRef}>
      <TableHeader
        tableHeaderStyle={tableHeaderStyle}
        tableHeaderRef={tableHeaderRef}
      />
      <TableBody tableBodyStyle={tableBodyStyle} tableBodyRef={tableBodyRef} />
    </div>
  );
}
