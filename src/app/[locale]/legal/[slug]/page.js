import LandingFooter from "@/components/molecules/LandingFooter/LandingFooter";
import LandingHeader from "@/components/molecules/LandingHeader/LandingHeader";
import {
  getLegalLinks,
  getLocalized,
  getPublicPage,
  LEGAL_SLUGS,
  SLUG_TO_PAGE_NAME,
} from "@/resources/utils/cmsPublicApi";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "react-bootstrap";
import styles from "./LegalPage.module.css";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

async function resolveLegalTitle(slug, pageData, legalLinks, locale) {
  if (pageData?.title) {
    return getLocalized(pageData.title, locale);
  }

  const link = legalLinks.find((item) => item.slug === slug);
  if (link?.title) {
    return getLocalized(link.title, locale);
  }

  if (slug === "privacy-policy") {
    return "Privacy Policy";
  }

  return "";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageName = SLUG_TO_PAGE_NAME[slug];
  if (!pageName) return {};

  const locale = await getLocale();
  const [pageData, legalLinks] = await Promise.all([
    getPublicPage(pageName),
    getLegalLinks(),
  ]);

  if (!pageData) return {};

  const title = await resolveLegalTitle(slug, pageData, legalLinks, locale);
  if (!title) return {};

  return {
    title: `${title} | Acommify`,
    description: `${title} - Acommify legal document`,
  };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const pageName = SLUG_TO_PAGE_NAME[slug];

  if (!pageName) {
    notFound();
  }

  const locale = await getLocale();
  const [pageData, legalLinks, landingPage] = await Promise.all([
    getPublicPage(pageName),
    getLegalLinks(),
    getPublicPage("landingPage"),
  ]);

  if (!pageData) {
    notFound();
  }

  const title = await resolveLegalTitle(slug, pageData, legalLinks, locale);
  const html = getLocalized(pageData.htmlDescription, locale);
  const lastUpdated = pageData.lastUpdated;

  return (
    <>
      <LandingHeader />
      <main className={styles.main}>
        <Container>
          <div className={styles.content}>
            {title ? <h1>{title}</h1> : null}
            {lastUpdated ? (
              <p className={styles.lastUpdated}>
                <strong>Last updated:</strong> {lastUpdated}
              </p>
            ) : null}
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : null}
          </div>
        </Container>
      </main>
      <LandingFooter
        legalLinks={legalLinks}
        companyDescription={landingPage?.footerCompany?.description}
        locale={locale}
      />
    </>
  );
}
