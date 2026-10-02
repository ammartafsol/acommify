"use client";
import { Link } from "@/i18n/navigation";
import { getLocalized } from "@/resources/utils/cmsPublicApi";
import Image from "next/image";
import { Container } from "react-bootstrap";
import styles from "./LandingFooter.module.css";

export default function LandingFooter({
  legalLinks = [],
  companyDescription,
  locale,
}) {
  const currentYear = new Date().getFullYear();
  const description = getLocalized(companyDescription, locale);

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          <div className={styles.companySection}>
            <Link href="/" className={styles.logoContainer}>
              <div className={styles.logo}>
                <Image src="/svg/logo.svg" alt="Acommify logo" fill />
              </div>
              <span className={styles.logoText}>Acommify</span>
            </Link>
            {description ? (
              <p className={styles.companyDescription}>{description}</p>
            ) : null}
          </div>

          <div className={styles.linkSection}>
            <h4 className={styles.sectionTitle}>Legal</h4>
            <ul className={styles.linkList}>
              {legalLinks.map((doc) => (
                <li key={doc.slug}>
                  <Link href={`/legal/${doc.slug}`}>
                    {getLocalized(doc.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} Acommify. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
