"use client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Container } from "react-bootstrap";
import styles from "./LandingHeader.module.css";

export default function LandingHeader() {
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
            <Link href="/login" className={styles.loginBtn}>
              Resident login
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
