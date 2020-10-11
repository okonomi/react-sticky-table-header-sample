import React, { useState, useRef, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

function useStickyTableHeader() {
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

  useEffect(() => {
    let {
      left: tableLeft,
      bottom: tableBottom,
      width: tableWidth
    } = tableRef.current.getBoundingClientRect();
    tableBottom += window.pageYOffset;

    let {
      top: headerTop,
      height: headerHeight
    } = tableHeaderRef.current.getBoundingClientRect();
    headerTop += window.pageYOffset;

    setTableHeaderStyle((prev) => ({
      ...prev,
      width: tableWidth
    }));

    const handleWindowScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY >= tableBottom - headerHeight) {
        setTableHeaderStyle((prev) => ({
          ...prev,
          position: "absolute",
          top: tableBottom - headerHeight,
          left: tableLeft
        }));
        setTableBodyStyle((prev) => ({
          ...prev,
          paddingTop: headerHeight
        }));
      } else if (scrollY >= headerTop) {
        setTableHeaderStyle((prev) => ({
          ...prev,
          position: "fixed",
          top: 0,
          left: tableLeft
        }));
        setTableBodyStyle((prev) => ({
          ...prev,
          paddingTop: headerHeight
        }));
      } else {
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
      }
    };

    const tableHeader = tableHeaderRef.current;
    const tableBody = tableBodyRef.current;

    const handleTableScroll = (e) => {
      const scrollY = e.target.scrollLeft;
      tableHeader.scrollTo({ top: 0, left: scrollY });
      tableBody.scrollTo({ top: 0, left: scrollY });
    };

    window.addEventListener("scroll", handleWindowScroll);
    tableHeader.addEventListener("scroll", handleTableScroll);
    tableBody.addEventListener("scroll", handleTableScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      tableHeader.removeEventListener("scroll", handleTableScroll);
      tableBody.removeEventListener("scroll", handleTableScroll);
    };
  }, [
    setTableHeaderStyle,
    setTableBodyStyle,
    tableRef,
    tableHeaderRef,
    tableBodyRef
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
