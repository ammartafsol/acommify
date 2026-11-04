"use client";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Container } from "react-bootstrap";
import {
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineViewGrid,
  HiUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import styles from "./LandingHeader.module.css";

// Centre and Centre Staff sign in on the admin app
const ADMIN_APP_URL = "https://admin.acommify.com";

export default function LandingHeader() {
  const locale = useLocale();
  const { accessToken } = useSelector((state) => state.authReducer);

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
          <nav className={styles.actions}>
            {accessToken ? (
              <Link href="/resident" className={styles.loginBtn}>
                <HiOutlineViewGrid className={styles.btnIcon} />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <a
                  href={`${ADMIN_APP_URL}/${locale}/login/center`}
                  className={styles.loginBtn}
                >
                  <HiOutlineOfficeBuilding className={styles.btnIcon} />
                  <span>Centre Login</span>
                </a>
                <a
                  href={`${ADMIN_APP_URL}/${locale}/login/center-staff`}
                  className={styles.loginBtn}
                >
                  <HiUserGroup className={styles.btnIcon} />
                  <span>Centre Staff Login</span>
                </a>
                <Link href="/login" className={styles.loginBtn}>
                  <HiOutlineUser className={styles.btnIcon} />
                  <span>Resident Login</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
