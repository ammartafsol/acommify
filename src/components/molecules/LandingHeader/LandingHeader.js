"use client";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { HiMenu, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import styles from "./LandingHeader.module.css";

// Centre and Centre Staff sign in on the admin app
const ADMIN_APP_URL = "https://admin.acommify.com";

export default function LandingHeader() {
  const locale = useLocale();
  const { accessToken } = useSelector((state) => state.authReducer);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // Close the mobile menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header} ref={headerRef}>
      <Container>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logoContainer}>
            <div className={styles.logo}>
              <Image src="/svg/logo.svg" alt="Acommify logo" fill />
            </div>
            <span className={styles.logoText}>Acommify</span>
          </Link>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="landing-header-actions"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
          <nav
            id="landing-header-actions"
            className={`${styles.actions} ${menuOpen ? styles.actionsOpen : ""}`}
          >
            {accessToken ? (
              <Link href="/resident" className={styles.loginBtn} onClick={closeMenu}>
                Go to dashboard
              </Link>
            ) : (
              <>
                <a
                  href={`${ADMIN_APP_URL}/${locale}/login/center`}
                  className={styles.loginBtn}
                  onClick={closeMenu}
                >
                  Centre login
                </a>
                <a
                  href={`${ADMIN_APP_URL}/${locale}/login/center-staff`}
                  className={styles.loginBtn}
                  onClick={closeMenu}
                >
                  Centre Staff login
                </a>
                <Link href="/login" className={styles.loginBtn} onClick={closeMenu}>
                  Resident login
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
