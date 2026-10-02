"use client";
import React from "react";
import classes from "./MobileFooter.module.css";
import { Link, usePathname } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { footerDataMobile } from "@/resources/utils/headerRoutes";
import { ReactSVG } from "react-svg";
import { mergeClass } from "@/resources/utils/helper";

export default function MobileFooter({ children }) {
  const { width } = useDimensions();
  const isMobile = width < 577;
  const pathName = usePathname();

  return (
    <>
      {isMobile ? (
        <footer className={classes?.main}>
          {footerDataMobile?.map((item, index) => (
            <Link key={index} href={item?.route}>
              <ReactSVG
                src={item?.icon}
                className={mergeClass(
                  pathName === item?.route ? classes.activeNavIcon : ""
                )}
              />
            </Link>
          ))}

          {children}
        </footer>
      ) : (
        ""
      )}
    </>
  );
}
