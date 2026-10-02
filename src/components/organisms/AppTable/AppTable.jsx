"use client";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import Pagination from "@/components/molecules/Pagination";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { imageUrl, mergeClass } from "@/resources/utils/helper";
import Image from "next/image";
import classes from "./AppTable.module.css";
import { useEffect, useState } from "react";

export default function AppTable({
  classNamePrefix = "",
  tableMinWidth = "",
  onRowClick = () => {},
  onKeyClick = () => {},
  rowClassName = "",
  data = [],
  tableHeader = [],
  loading = false,
  noDataText = "Data not found",
  renderTableHeader = null,
  pagination = false,
  page,
  totalRecords,
  onPageChange,
  actions = [],
  actionStyles = {},
  recordsLimit,
}) {
  const [tableWidth, setTableWidth] = useState("");

  useEffect(() => {
    const tableBodyWidth = document.querySelector(
      `.${classNamePrefix}tableBody`
    )?.offsetWidth;
    const tableHeaderWidth = document.querySelector(
      `.${classNamePrefix}tableHeader`
    )?.offsetWidth;
    const width =
      tableBodyWidth > tableHeaderWidth ? tableBodyWidth : tableHeaderWidth;
    const cellCount = tableHeader.length + (actions?.length > 0 ? 1 : 0);
    const minWidth =
      tableMinWidth > cellCount * 180 ? tableMinWidth : cellCount * 180;
    setTableWidth(width > minWidth && cellCount > 6 ? width : minWidth);
  }, [tableHeader, tableMinWidth, loading]);

  return (
    <>
      <style>
        {`
          .${classes?.tableBodyContainer} {
            height: ${pagination ? "100%" : `calc(100% - 101px)`};
          }
          .row100{
            width: 100%;
          }
          .cell100 {
            width: 100%;
          }
          .table100-head,
          .table100-body {
            min-width: ${tableMinWidth ? `${tableMinWidth}` : "100%"};
            overflow-y: auto;
          }
        `}
      </style>
      <div className={mergeClass(classes?.tableMainContainer)}>
        <div
          className={mergeClass(
            classes?.tableHeaderContainer,
            "table100-head",
            `${classNamePrefix}tableHeader`
          )}
          style={{ width: `${tableWidth}px` }}
        >
          <table>
            <thead>
              <tr>
                {tableHeader?.map((item, index) => (
                  <th
                    key={index}
                    style={{
                      textAlign: "start",
                      ...(item.style && item.style),
                    }}
                    className={mergeClass(
                      item?.headerClass && item?.headerClass
                    )}
                  >
                    {renderTableHeader
                      ? renderTableHeader({ item: item, index })
                      : item?.title}
                  </th>
                ))}
                {actions?.length > 0 && (
                  <th
                    style={{
                      textAlign: "start",
                      ...actionStyles,
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
          </table>
        </div>
        {loading ? (
          <SpinnerLoading />
        ) : (
          <div
            className={mergeClass(
              classes?.tableBodyContainer,
              "table100-body",
              `${classNamePrefix}tableBody`
            )}
            style={{ width: `${tableWidth}px` }}
          >
            <table>
              <tbody>
                {data?.length ? (
                  data?.map((item, rowIndex) => {
                    return (
                      <tr
                        key={rowIndex}
                        className={mergeClass(
                          "row100",
                          classes.bodyRow,
                          rowClassName
                        )}
                        onClick={() => onRowClick(item, rowIndex)}
                      >
                        {tableHeader?.map(
                          (
                            { key, style, title, renderItem, image },
                            colIndex
                          ) => (
                            <td
                              key={colIndex}
                              className={`cell100 column${colIndex + 1}`}
                              style={{
                                ...(image && { paddingBlock: "10px" }),
                                textAlign: "start",
                                ...style,
                              }}
                            >
                              <div
                                className={image ? classes.imageContainer : ""}
                                style={{
                                  ...style,
                                  width: "100%",
                                }}
                              >
                                {image ? (
                                  <Image
                                    src={imageUrl(
                                      item[key] ||
                                        "/images/app-images/imageFallback.png"
                                    )}
                                    alt="image"
                                    fill
                                  />
                                ) : renderItem ? (
                                  renderItem({
                                    onClick: () => onKeyClick(item, key),
                                    item: item[key],
                                    data: item,
                                    colIndex,
                                    rowIndex,
                                    key,
                                    title,
                                  })
                                ) : (
                                  item[key] || "NA"
                                )}
                              </div>
                            </td>
                          )
                        )}
                        {actions?.length > 0 && (
                          <td
                            className="cell100"
                            style={{
                              textAlign: "start",
                              flex: 1,
                              ...actionStyles,
                            }}
                          >
                            <div className={classes.actionContainer}>
                              {actions.map((action, index) => {
                                return (
                                  <div
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action?.onClick({ data: item });
                                    }}
                                  >
                                    {action?.renderItem &&
                                      action?.renderItem({
                                        data: item,
                                      })}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={tableHeader.length}
                      style={{ textAlign: "center" }}
                    >
                      <NoDataFound text={noDataText} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pagination &&
        totalRecords > (recordsLimit ? recordsLimit : RECORDS_LIMIT) && (
          <Pagination
            currentPage={page || 1}
            totalRecords={totalRecords}
            limit={10}
            setCurrentPage={onPageChange}
          />
        )}
    </>
  );
}
