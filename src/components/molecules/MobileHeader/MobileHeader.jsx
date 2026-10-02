"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import useDirection from "@/resources/hooks/useDirection";
import { useLocaleAwareBack } from "@/resources/hooks/useLocaleAwareBack";
import { useLocale } from "next-intl";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import classes from "./MobileHeader.module.css";
import { mergeClass } from "@/resources/utils/helper";

export default function MobileHeader({
  title,
  icon,
  showBack = false,
  iconImage,
  showShoppingBag,
  btnOnClick,
  children,
  totalItems = 0,
  mainClass,
}) {
  const router = useRouter();
  const locale = useLocale();
  const dir = useDirection();
  const pathname = usePathname();

  const handleBack = useLocaleAwareBack();

  return (
    <div className={mergeClass(classes.main, mainClass)}>
      {showBack && (
        <div
          className={
            pathname === "/resident/maintenance-requests"
              ? classes.maintenanceBackIcon
              : classes.backIcon
          }
        >
          {dir === "rtl" ? (
            <IoChevronBack
              size={16}
              color="#A8B5BC"
              style={{ transform: "rotate(180deg)" }}
              onClick={handleBack}
            />
          ) : (
            <IoChevronBack size={16} color="#A8B5BC" onClick={handleBack} />
          )}
        </div>
      )}
      <div className={classes.right}>
        {icon && <div className={classes.icon}>{icon}</div>}
        {iconImage && (
          <Image
            className={classes.iconImage}
            src={iconImage}
            height={5}
            width={5}
            alt="image"
          ></Image>
        )}
        <p>{title}</p>
      </div>
      {showShoppingBag && (
        <div onClick={btnOnClick} className={classes.btnLeftIcon}>
          <Image src="/svg/shoppingBag.svg" alt="Back" width={22} height={22} />
          <span className={classes.tooltip}>{totalItems}</span>
        </div>
      )}
      {children}
    </div>
  );
}
