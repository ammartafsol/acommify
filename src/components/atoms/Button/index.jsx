"use client";
import React from "react";
import classes from "./Button.module.css";
import { Spinner } from "react-bootstrap";

// Variants
const Button = ({
  label,
  customStyle,
  onClick,
  large = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  className = "",
  variant,
  medium = false,
  type,
  loading = false,
  showSpinner = false,
  spinnerStyles = {},
  ...props
}) => {
  return (
    <>
      <button
        type={type}
        style={{
          ...customStyle,
          border: "none",
        }}
        onClick={onClick}
        disabled={disabled}
        data-loading={loading}
        color-variant={variant}
        className={`${classes.btn} ${className} ${large ? classes.large : ""} ${
          medium ? classes.medium : ""
        }`}
        {...props}
      >
        {leftIcon && leftIcon}
        {label && <label>{label}</label>}

        {children && { children }}
        {!loading && rightIcon && rightIcon}
        {loading && showSpinner && (
          <Spinner
            className={classes.spinner}
            style={spinnerStyles}
            size="sm"
          />
        )}
      </button>
    </>
  );
};

export default Button;
