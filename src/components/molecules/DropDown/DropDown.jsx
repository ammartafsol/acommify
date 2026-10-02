"use client";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import ReactSelect, { components } from "react-select";
import classes from "./DropDown.module.css";

// primary-outlined

const DropDown = ({
  dir = "ltr",
  children,
  options,
  label,
  customStyle,
  disabled,
  value,
  setValue,
  placeholder,
  placeholderFontStyle = "var(--font-lato)",
  placeholderColor = "var(--Dark-gray) !important",
  isMulti,
  style,
  mainClass,
  leftIcon,
  Components,
  labelClassName,
  indicatorColor = "var(--Dark-gray)",
  optionLabel,
  optionValue,
  selectRef,
  isSearchable = true,
  borderRadius = "10px",
  classNamePrefix,
  dropDownContainerClass = "",
  variant = "",
  error,
  ...props
}) => {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        {props.isFocused ? (
          <MdKeyboardArrowUp size={20} color={indicatorColor} />
        ) : (
          <MdKeyboardArrowDown size={20} color={indicatorColor} />
        )}
      </components.DropdownIndicator>
    );
  };

  const dropDownStyle = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      opacity: isDisabled ? 0.9 : 1,
      backgroundColor: "#F4F7FD !important",
      padding: "4px 8px",
      borderRadius: borderRadius,
      color:"var(--Dark-gray)",
      boxShadow: "none",
      fontFamily: "var(--font-lato)",
      fontWeight: 400,
      fontSize: 16,
      letterSpacing: 1,
      lineHeight: "22px",
      cursor: isDisabled ? "not-allowed" : "pointer",
      borderRadius: "25px",

      ...customStyle,

      ":hover": {
        ...styles[":hover"],
        borderColor: "var(--border-color)",
      },
      ":placeholder": {
        ...styles[":placeholder"],
        color: "#8C939B",
      },
      ":active": {
        ...styles[":active"],
        color: "#fff",
        borderColor: "var(--Dark-gray)",
        backgroundColor: "var( --Dark-blue)",
      },
    }),

    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        fontSize: "14px",
        color: placeholderColor,
        fontStyle: placeholderFontStyle,
        fontFamily: "var(--font-lato)",
        textTransform: "capitalize",
        fontWeight: 500,
        letterSpacing: 0,
      };
    },

    option: (styles, { data, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isSelected && "var(--Blue)",
        color: isSelected ? "var(--Poor-white) !important" : "var(--Black)",
        padding: "12px 16px",
        fontFamily: "var(--font-lato)",
        fontWeight: 500,
        fontSize: 14,
        textTransform: "capitalize",
        borderBottom: "1px solid var(--border-color)",
        ":active": {
          ...styles[":active"],
          backgroundColor: "var(--Blue)",
          color: "var(--White) !important",
        },
        ":hover": {
          ...styles[":hover"],
          color: isSelected ? "var(--White)" : "var(--Black)",
          fontSize: 14,
          cursor: "pointer",
        },
      };
    },

    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "var(--Blue)",
        borderRadius: "50px",
        padding: "4px 8px",
        fontFamily: "var(--font-lato)",
        fontWeight: 500,
      };
    },
    singleValue: (styles) => {
      return {
        ...styles,
        fontSize: 14,
        fontFamily: "var(--font-lato) !important",
        fontWeight: 500,
        letterSpacing: "0px",
        color: "var(--Black)",
        textTransform: "capitalize",
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: "var(--White)",
      fontWeight: 550,
      backgroundColor: "transparent",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      fontSize: "18px",
      color: "var(--White)",
      ":hover": {
        color: "var(--Red)",
        transition: "all 0.5s ease-in-out",
      },
    }),
    menu: (styles) => ({
      ...styles,
      borderRadius: "11px",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
    }),
  };
  return (
    <>
      <div
        className={`${[classes.Container, mainClass].join(" ")}`}
        data-variant={variant}
        dir={dir}
      >
        <style>{`
        .DropdownOptionContainer__menu {
          margin: 0px;
        }

        .DropdownOptionContainer::-webkit-scrollbar {
          width: 6px;
        }

        .DropdownOptionContainer::-webkit-scrollbar-track {
          border-radius: 50px;
          background-color: var(--White);
          margin-block: 20px;
        }

        .DropdownOptionContainer::-webkit-scrollbar-thumb {
          width: 5px;
          border-radius: 50px;
          background-color: var(--Blue);
        }

        .DropdownOptionContainer__single-value {
          color: var(--black)
        }
        .DropdownOptionContainer__menu {
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
        }
      `}</style>
        {label && (
          <label
            htmlFor={`dropdown${label}`}
            className={`${[
              classes.label,
              labelClassName && labelClassName,
              disabled && classes.disabled,
            ].join(" ")}`}
          >
            {label}
          </label>
        )}

        <div
          className={`${[classes.dropdownContainer].join(" ")}`}
          data-disabled={disabled}
        >
          <ReactSelect
            key={Math.random()}
            inputId={`dropdown${label}`}
            value={value}
            onChange={(e) => {
              setValue(e);
            }}
            isOptionDisabled={(e) => e.disabled}
            className={`${[
              classes.reactSelect,
              dropDownContainerClass && dropDownContainerClass,
            ].join(" ")}`}
            isMulti={isMulti}
            isDisabled={disabled}
            placeholder={placeholder}
            options={options}
            styles={{ ...dropDownStyle, ...style }}
            isClearable={false}
            isSearchable={isSearchable}
            classNamePrefix={`DropdownOptionContainer ${
              classNamePrefix && classNamePrefix
            }`}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: (e) => DropdownIndicator(e),
              ...Components,
            }}
            getOptionLabel={(option) => {
              return optionLabel ? option[optionLabel] : option?.label;
            }}
            getOptionValue={(option) =>
              optionValue ? option[optionValue] : option?.value
            }
            ref={selectRef}
            {...props}
          />
          {leftIcon && <div className={classes.leftIconBox}>{leftIcon}</div>}
        </div>
        {error && (
          <p className={`mt-1 ${[classes.error].join(" ")}`}>*{error}</p>
        )}
      </div>
    </>
  );
};

export default DropDown;
