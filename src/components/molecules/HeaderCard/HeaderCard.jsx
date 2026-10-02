"use client";
import { mergeClass } from "@/resources/utils/helper";
import Image from "next/image";
import classes from "./HeaderCard.module.css";
export default function HeaderCard({ title, description, mainClass, width }) {
  return (
    <div
      className={mergeClass(
        mainClass,
        width ? classes.welcomeCard : classes.card
      )}
    >
      {width && (
        <div className={classes.hiIcon}>
          <Image src={"/svg/hi.svg"} width={27} height={27} alt="Hi Icon" />
        </div>
      )}
      <p>{title}</p>
      <p>{description}</p>
    </div>
  );
}
