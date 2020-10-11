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

  // table size
  const [tableRect, setTableRect] = useState({});

  useEffect(() => {
    setTableRect(tableRef.current.getBoundingClientRect().toJSON());

    const handleWindowResize = () => {
      setTableRect(tableRef.current.getBoundingClientRect().toJSON());
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [tableRef, setTableRect]);

  // table header size
  const [tableHeaderRect, setTableHeaderRect] = useState({});

  useEffect(() => {
    setTableHeaderRect(tableHeaderRef.current.getBoundingClientRect().toJSON());
  }, [tableHeaderRef, setTableHeaderRect]);

  // table header width
  useEffect(() => {
    setTableHeaderStyle((prev) => ({
      ...prev,
      width: tableRect.width
    }));
  }, [setTableHeaderStyle, tableRect]);

  // table scroll
  useEffect(() => {
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
    const handleWindowScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY >= tableRect.bottom - tableHeaderRect.height) {
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
      } else if (scrollY >= tableHeaderRect.top) {
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

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [setTableHeaderStyle, setTableBodyStyle, tableRect, tableHeaderRect]);

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
