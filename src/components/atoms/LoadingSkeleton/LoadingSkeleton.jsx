"use client";
import React from "react";
import classes from "./LoadingSkeleton.module.css";
import { mergeClass } from "@/resources/utils/helper";
export default function LoadingSkeleton({ customStyle, mainClass }) {
  return (
    <div
      style={customStyle}
      className={mergeClass(classes.main, mainClass)}
    ></div>
  );
}
