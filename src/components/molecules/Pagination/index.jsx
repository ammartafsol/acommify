import React from "react";
import classes from "./Pagination.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import useDimensions from "@/resources/hooks/useDimensions";

function getPages(current, total) {
  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }
  return pages;
}

export default function Pagination({
  currentPage = 1,
  setCurrentPage,
  totalRecords = 0,
  limit = 10,
  className = "",
}) {
  const totalPages = Math.ceil(totalRecords / limit);

  if (totalPages <= 1) return null;
  const width = useDimensions();

  const pages = getPages(currentPage, totalPages);

  return (
    <nav className={`${classes.paginationContainer} ${className}`}>
      <button
        className={classes.arrowButton}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaArrowLeft size={16} color="#414651" />{" "}
        {width < 375 ? "Previous" : ""}
      </button>
      <ul className={classes.pageList}>
        {pages.map((page, idx) =>
          page === "..." ? (
            <li key={idx} className={classes.ellipsis}>
              ...
            </li>
          ) : (
            <li key={idx}>
              <button
                className={
                  page === currentPage
                    ? `${classes.pageItem} ${classes.pageItemActive}`
                    : classes.pageItem
                }
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        className={classes.arrowButton}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {width < 375 ? "Next" : ""} <FaArrowRight size={16} color="#414651" />
      </button>
    </nav>
  );
}
