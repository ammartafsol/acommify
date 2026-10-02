"use client";
import { getLocalized } from "@/resources/utils/cmsPublicApi";
import { Container } from "react-bootstrap";
import styles from "./HeroSection.module.css";

export default function HeroSection({ hero, locale }) {
  const badge = getLocalized(hero?.badge, locale);
  const title = getLocalized(hero?.title, locale);
  const subtitle = getLocalized(hero?.subtitle, locale);

  return (
    <section className={styles.hero}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.orb} />
        <span className={`${styles.orb} ${styles.orbSecondary}`} />
        <span className={styles.grid} />
      </div>
      <Container className={styles.container}>
        <div className={styles.heroContent}>
          <p className={styles.brand}>Acommify</p>
          {badge ? <span className={styles.badge}>{badge}</span> : null}
          {title ? <h1 className={styles.title}>{title}</h1> : null}
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </Container>
    </section>
  );
}
