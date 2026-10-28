"use client";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Container } from "react-bootstrap";
import styles from "./LandingHeader.module.css";

// Centre and Centre Staff sign in on the admin app
const ADMIN_APP_URL = "https://admin.acommify.com";

export default function LandingHeader() {
  const locale = useLocale();

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logoContainer}>
            <div className={styles.logo}>
              <Image src="/svg/logo.svg" alt="Acommify logo" fill />
            </div>
            <span className={styles.logoText}>Acommify</span>
          </Link>
          <div className={styles.actions}>
            <a
              href={`${ADMIN_APP_URL}/${locale}/login/center`}
              className={styles.loginBtn}
            >
              Centre login
            </a>
            <a
              href={`${ADMIN_APP_URL}/${locale}/login/center-staff`}
              className={styles.loginBtn}
            >
              Centre Staff login
            </a>
            <Link href="/login" className={styles.loginBtn}>
              Resident login
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
