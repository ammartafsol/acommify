"use client";
import { usePathname } from "@/i18n/navigation";
import styles from "./styles.module.css";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import { mergeClass } from "@/resources/utils/helper";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  if (pathname.includes("user-agreement")) {
    return <div className={styles.authLayout}>{children}</div>;
  }
  return (
    <div className={mergeClass("ignoreRtl", styles.authLayout)}>
      <div className={styles.authLayoutLeft}>{children}</div>
      <div className={styles.authLayoutRight}></div>
      <LanguageSwitcher containerClass={styles?.switcherCustom} />
    </div>
  );
}
