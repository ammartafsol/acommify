"use client";
import { mergeClass } from "@/resources/utils/helper";
import styles from "./styles.module.css";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { ReactSVG } from "react-svg";
import parse from "html-react-parser";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "@/resources/hooks/useTranslations";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import Image from "next/image";
import useDimensions from "@/resources/hooks/useDimensions";

const USER_AGREEMENT_TABS = [
  { id: 1, key: "responsibility" },
  { id: 2, key: "privacy" },
  { id: 3, key: "terms" },
];

export default function UserAgreement() {
  const t = useTranslations("userAgreementPage");
  const locale = useLocale();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(USER_AGREEMENT_TABS[0]);
  const [checked, setChecked] = useState(true);
  const { width } = useDimensions();
  const isMobile = width > 577;

  const getCurrentContent = () => {
    return UserAgreementData[selectedTab.key]?.htmlDescription?.[locale] || "";
  };

  const handleSubmit = () => {
    // Handle form submission
    router.push("/login");
  };

  return (
    <Container className={mergeClass("containerFluid", styles.wrapper)}>
      {/* responsive */}
      <div className={styles.responsiveheaderMain}>
        <div className={styles.responsiveNone}>
          <Image
            src="/dev-images/logoMobile.svg"
            height={41}
            width={41}
            alt="logo"
          ></Image>
        </div>
        <div className={styles.headerMain}>
          <h1>{t("title")}</h1>
        </div>
        {/* languageswitcher */}
        <div className={styles.authLayoutRight}>
          <LanguageSwitcher />
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.infoIcon}>
          <ReactSVG className="reactSvg" src="/svg/info.svg" />
        </div>
        <h1>{t("title")}</h1>
        <LanguageSwitcher containerClass={styles.languageSwitcher} />
      </div>
      {isMobile ? (
        <div className={styles.contentBox}>
          <nav>
            <ul>
              {USER_AGREEMENT_TABS.map((tab) => (
                <li
                  key={tab.id}
                  className={tab.id === selectedTab.id ? styles.active : ""}
                  onClick={() => setSelectedTab(tab)}
                >
                  {t(`tabs.${tab.key}`)}
                </li>
              ))}
            </ul>
          </nav>
          <section className={styles.section}>
            <div>{parse(getCurrentContent())}</div>
            <div className={styles.bottomDiv}>
              <Form.Check
                className={styles.checkbox}
                type="checkbox"
                id="agree"
                checked={checked}
                onChange={() => setChecked((v) => !v)}
                label={t("checkbox")}
              />
              <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={!checked}
                label={t("button")}
              />
            </div>
          </section>
        </div>
      ) : (
        <section className={styles.section}>
          <div>{parse(getCurrentContent())}</div>
          <div className={styles.bottomDiv}>
            <Form.Check
              className={styles.checkbox}
              type="checkbox"
              id="agree"
              checked={checked}
              onChange={() => setChecked((v) => !v)}
              label={t("checkbox")}
            />
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!checked}
              label={t("button")}
            />
          </div>
        </section>
      )}
    </Container>
  );
}

const UserAgreementData = {
  responsibility: {
    htmlDescription: {
      en: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>As a user of our platform, you are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>Providing accurate and up-to-date information</li>
          <li>Complying with all applicable laws and regulations</li>
          <li>Respecting the rights and privacy of other users</li>
        </ul>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      `,
    },
  },
  privacy: {
    htmlDescription: {
      en: `
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h3>Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
        <h3>How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        <h3>Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      `,
    },
  },
  terms: {
    htmlDescription: {
      en: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <h3>Acceptance of Terms</h3>
        <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <h3>Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
        <h3>Disclaimer</h3>
        <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.</p>
      `,
    },
  },
};
