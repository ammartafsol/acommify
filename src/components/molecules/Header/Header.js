"use client";
import LanguageSwitcher from "@/components/atoms/LanguageSwitcher";
import PageLoader from "@/components/atoms/PageLoader/PageLoader";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { AuthRoutes } from "@/resources/utils/constant";
import { headerData, headerDataMobile } from "@/resources/utils/headerRoutes";
import { imageUrl, mergeClass } from "@/resources/utils/helper";
import { signOutRequest } from "@/store/auth/authSlice";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container, Offcanvas } from "react-bootstrap";
import { CiSettings } from "react-icons/ci";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const t = useTranslations("header");
  const { width } = useDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const isMobile = width < 577;
  const { user } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("fixedPosition");
    } else {
      document.body.classList.remove("fixedPosition");
    }
    return () => {
      document.body.classList.remove("fixedPosition");
    };
  }, [isOpen]);

  useEffect(() => {
    if (width > 991) {
      setIsOpen(false);
    }
  }, [width]);

  const toggleMenu = () => setIsOpen((open) => !open);
  const dashboardPath = pathName === "/resident";
  const showAppHeaderOnMobile =
    dashboardPath || pathName?.startsWith("/resident/maintenance-requests");
  function handleLogout() {
    sessionStorage.clear();
    Cookies.remove("_xpdx_acom-web");
    Cookies.remove("_xpdx_rf_acom-web");
    Cookies.remove("_xpdx_u_acom-web");
    Cookies.remove("_pp_accepted", { path: "/" });

    dispatch(signOutRequest());
    router.replace("/login");
  }

  if (AuthRoutes.some((route) => pathName?.includes(route))) {
    return null;
  }

  return (
    <>
      {isMobile && !showAppHeaderOnMobile ? (
        ""
      ) : (
        <>
          <header className={styles.header}>
            <Container className="containerFluid">
              <div className={styles.headerContent}>
                {/* Mobile Hamburger */}
                <button
                  className={styles.mobileMenuToggle}
                  onClick={toggleMenu}
                  ref={menuButtonRef}
                >
                  <HiOutlineMenuAlt1 size={30} />
                </button>

                <div className={styles.headerMain}>
                  {/* Logo */}
                  <Link href="/resident" className={styles.logoContainer}>
                    <div className={styles.logo}>
                      <Image src="/svg/logo.svg" alt="logo" fill />
                    </div>
                    <h1>Acommify</h1>
                    <PageLoader />
                  </Link>

                  {/* Navigation Menu */}
                  <nav className={styles.navigation}>
                    {headerData(t)?.map((item, index) => (
                      <Link
                        key={index}
                        href={item?.route}
                        className={mergeClass(
                          styles.navLink,
                          pathName === item?.route ? styles.activeNavLink : ""
                        )}
                      >
                        <ReactSVG
                          src={item?.icon}
                          className={mergeClass(
                            pathName === item?.route
                              ? styles.activeNavIcon
                              : "",
                            item?.icon?.includes("dashboardIcon") &&
                              styles.dashboardIcon
                          )}
                        />
                        {item?.label}
                        <PageLoader />
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className={styles.userActions}>
                  {/* <Button label={"Logout"} onClick={handleLogout} /> */}
                  <LanguageSwitcher containerClass={styles.languageSwitcher} />
                  {/* notification */}

                  <div
                    className={styles.notifications}
                    onClick={() => router.push(`/resident/notifications`)}
                  >
                    <IoNotificationsOutline size={24} />
                  </div>
                  {/* settings */}
                  <div
                    className={styles.settings}
                    onClick={() => router.push(`/resident/settings`)}
                  >
                    <CiSettings size={24} />
                  </div>
                  <div
                    className={styles.userProfileImage}
                    onClick={() => router.push(`/resident/profile-settings`)}
                  >
                    <Image
                      src={imageUrl(
                        user?.photo,
                        "/app-images/default-user.png"
                      )}
                      alt="user"
                      fill
                    />
                  </div>
                </div>
              </div>
            </Container>
          </header>
          <Offcanvas
            show={isOpen}
            onHide={toggleMenu}
            placement="start"
            className={styles.mobileOffcanvas}
            backdrop
          >
            <Offcanvas.Header
              closeButton
              className={styles.mobileOffcanvasHeader}
            >
              <div className={styles.mobileLogo}>
                <Image src="/svg/logo.svg" alt="logo" height={56} width={56} />
                <h1>Acommify</h1>
              </div>
            </Offcanvas.Header>
            <Offcanvas.Body className={styles.mobileOffcanvasBody}>
              <nav className={styles.mobileNavigation}>
                {headerDataMobile(t)?.map((item, index) => (
                  <Link
                    key={index}
                    href={item?.route}
                    className={mergeClass(
                      styles.navLink,
                      pathName === item?.route ? styles.activeNavLink : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <ReactSVG
                      src={item?.icon}
                      className={mergeClass(
                        pathName === item?.route ? styles.activeNavIcon : "",
                        styles.mobileNavIcon,
                        item?.icon?.includes("dashboardIcon") &&
                          styles.dashboardIcon
                      )}
                      width={"36px"}
                      height={"36px"}
                    />
                    {item?.label}
                    <PageLoader />
                  </Link>
                ))}
              </nav>
              <div
                onClick={handleLogout}
                className={mergeClass(styles.navLink, styles.logoutButton)}
              >
                <TbLogout size={24} />
                {t("logout")}
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </>
      )}
    </>
  );
}
