import Header from "@/components/molecules/Header/Header";
import MobileFooter from "@/components/molecules/MobileFooter/MobileFooter";

export default function ResidentLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <MobileFooter />
    </>
  );
}
