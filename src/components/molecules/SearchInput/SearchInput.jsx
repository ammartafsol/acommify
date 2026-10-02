import Input from "@/components/atoms/Input/Input";
import React from "react";
import { LuSearch } from "react-icons/lu";
import classes from "./SearchInput.module.css";
import useDirection from "@/resources/hooks/useDirection";
export default function SearchInput({
  placeholder,
  value,
  setValue,
  leftIcon,
  rightIcon = <LuSearch size={16} color="#8C939B" />,
  inputContainerClass,
}) {
  const dir = useDirection();
  return (
    <Input
      dir={dir}
      placeholder={placeholder}
      value={value}
      setValue={setValue}
      rightIcon={rightIcon}
      className={classes.searchInput}
      inputContainerClass={classes.searchInputContainer || inputContainerClass}
      leftIcon={leftIcon}
    />
  );
}
