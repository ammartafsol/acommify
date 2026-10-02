"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { IoChevronBack, IoFilterSharp } from "react-icons/io5";
import classes from "./TopHeader.module.css";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import { useRouter } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { ReactSVG } from "react-svg";
import DropDown from "../DropDown/DropDown";
import Tabs from "../Tabs/Tabs";
import useDirection from "@/resources/hooks/useDirection";
import { useLocale } from "next-intl";
import { locales } from "@/i18n/routing";
import { useLocaleAwareBack } from "@/resources/hooks/useLocaleAwareBack";

export default function TopHeader({
  tabs = [],
  dropdownOptions = [],
  dropdownValue,
  setDropdownValue,
  title = "",
  selectedTab,
  setSelectedTab,
  search = "",
  setSearch,
  filterOptions = [],
  filterValue,
  setFilterValue,
  mainClass = "",
  icon,
  showSearch = false,
  showFilters = false,
  showDropdown = false,
  showBackBtn = true,
  btnLabel = "",
  btnVariant = "primary",
  btnLeftIcon = null,
  btnOnClick = null,
  btnClass = "",
  children,
  containerClass = "",
  dropDownPlaceholder = "",
  cardsCount,
  searchInpClass = "",
  tabsStuff = "",
  searchCustom = "",
  isBackBtnDisabled = false,
  btn2Label = "",
  btn2Variant = "primary",
  btn2LeftIcon = null,
  btn2OnClick = null,
  btn2Class = "",
  btn2Disabled = false,
}) {
  const t = useTranslations();
  const handleBack = useLocaleAwareBack();

  const [filterOpen, setFilterOpen] = useState(false);
  const { width } = useDimensions();
  const filterRef = useRef(null);
  const dir = useDirection();

  // Click outside logic using useRef
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  const filteredOptions = useMemo(() => {
    if (!search) return dropdownOptions;
    return dropdownOptions.filter((opt) =>
      (opt.label || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [dropdownOptions, search]);

  return (
    <div className={mergeClass(containerClass, classes.main)}>
      {showBackBtn && (
        <div
          className={classes.back}
          style={
            isBackBtnDisabled ? { cursor: "not-allowed", opacity: 0.6 } : {}
          }
          onClick={handleBack}
        >
          {dir === "rtl" ? (
            <IoChevronBack
              size={16}
              color="#A8B5BC"
              style={{ transform: "rotate(180deg)" }}
            />
          ) : (
            <IoChevronBack size={16} color="#A8B5BC" />
          )}

          <p>{t("common.back")}</p>
        </div>
      )}

      <div className={mergeClass(mainClass, classes.header)}>
        {tabs?.length > 0 && (
          <Tabs
            tabsData={tabs}
            selected={selectedTab}
            setSelected={setSelectedTab}
            ulCustom={tabsStuff}
          />
        )}

        {title && (
          <div className={classes.title}>
            {icon && <span>{icon}</span>}
            <p>{title}</p>
            {cardsCount && <p>({cardsCount} )</p>}
          </div>
        )}

        {(showSearch ||
          showFilters ||
          showDropdown ||
          btnOnClick ||
          children) && (
          <div className={mergeClass(classes.headerRight, searchCustom)}>
            {showSearch && (
              <Input
                dir={dir}
                placeholder={t("common.search")}
                value={search}
                setValue={setSearch}
                leftIcon={
                  width < 576 && (
                    <ReactSVG src="/svg/search.svg" height={16} width={16} />
                  )
                }
                rightIcon={
                  width > 576 && (
                    <ReactSVG src="/svg/search.svg" height={16} width={16} />
                  )
                }
                className={mergeClass(searchInpClass, classes.searchInput)}
                inputContainerClass={classes.searchInputContainer}
              />
            )}
            {showFilters && (
              <div
                ref={filterRef}
                className={width > 576 ? classes.filters : ""}
                onClick={() => setFilterOpen((open) => !open)}
                tabIndex={0}
                style={{ position: "relative" }}
              >
                {width < 576 ? (
                  <IoFilterSharp
                    className={classes.filterIcon}
                    size={24}
                    color="#172A33"
                  />
                ) : (
                  <>
                    <CiFilter
                      size={16}
                      className={classes.filterIcon}
                      color="#8C939B"
                    />
                    <p className={classes.filterLabel}>{t("common.filter")}</p>
                  </>
                )}

                {filterOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={classes.filterDropdown}
                  >
                    {filterOptions?.map((opt) => (
                      <p
                        key={opt.value ?? opt.label}
                        className={`${classes.filterOption} ${
                          filterValue === opt
                            ? classes.filterOptionSelected
                            : ""
                        }`}
                        onClick={() => {
                          setFilterValue(opt);
                          setFilterOpen(false);
                        }}
                      >
                        {opt.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showDropdown && (
              <DropDown
                options={filteredOptions}
                value={dropdownValue}
                setValue={setDropdownValue}
                dropDownContainerClass={classes.dropdownContainer}
                mainClass={classes.dropdownMain}
                placeholder={dropDownPlaceholder}
                styles={{
                  placeholder: (styles) => ({
                    ...styles,
                    color: "var(--Blue)",
                  }),
                  singleValue: (styles) => ({
                    ...styles,
                    color: "var(--Blue)",
                  }),
                }}
              />
            )}
            {btn2Label && (
              <Button
                variant={btn2Variant}
                leftIcon={btn2LeftIcon}
                label={btn2Label}
                className={mergeClass(btn2Class, classes.downloadBtn)}
                onClick={btn2OnClick}
                disabled={btn2Disabled}
              />
            )}

            {btnOnClick && (
              <Button
                variant={btnVariant}
                leftIcon={btnLeftIcon}
                label={btnLabel}
                className={mergeClass(btnClass, classes.downloadBtn)}
                onClick={btnOnClick}
              />
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
