import HeroSection from "@/components/molecules/HeroSection/HeroSection";
import LandingFooter from "@/components/molecules/LandingFooter/LandingFooter";
import LandingHeader from "@/components/molecules/LandingHeader/LandingHeader";
import {
  getLegalLinks,
  getPublicPage,
} from "@/resources/utils/cmsPublicApi";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acommify - Residential Community Management",
  description:
    "Manage residents, appointments, bookings, and maintenance requests efficiently in one place. Streamline operations for residential communities.",
};

export default async function LandingPage() {
  const locale = await getLocale();
  const [landingPage, legalLinks] = await Promise.all([
    getPublicPage("landingPage"),
    getLegalLinks(),
  ]);

  return (
    <div className={"landing-page"}>
      <LandingHeader />
      <HeroSection hero={landingPage?.hero} locale={locale} />
      <LandingFooter
        legalLinks={legalLinks}
        companyDescription={landingPage?.footerCompany?.description}
        locale={locale}
      />
    </div>
  );
}
