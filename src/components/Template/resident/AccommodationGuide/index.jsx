"use client";
import Accordions from "@/components/atoms/Accordions";
import HeaderCard from "@/components/molecules/HeaderCard/HeaderCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import Tabs from "@/components/molecules/Tabs/Tabs";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import {
  downloadable,
  servicesCardData,
  tabOptions,
  tabOptionsFrequently,
} from "@/developmentContent/frequentlyData";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { imageUrl, getFileFromKey } from "@/resources/utils/helper";
import parse from "html-react-parser";
import { useLocale } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { GoDownload } from "react-icons/go";
import classes from "./styles.module.css";

export default function AccommodationGuide({ data }) {
  const t = useTranslations("AccommodationGuidePage");
  const { Get } = useAxios();
  const [selectedTab, setSelectedTab] = useState(tabOptions(t)[0]);
  const [faqTab, setFaqTab] = useState(tabOptionsFrequently(t)[0]);
  const { width } = useDimensions();
  const [loading, setLoading] = useState("");
  const [faqData, setFaqData] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState({});
  const isMobile = width < 577;
  const locale = useLocale();

  const CONTACT_INFO = [
    {
      id: 1,
      info: data?.additionalResources?.helplineNumber,
      icon: "/dev-images/addressIcon.svg",
    },
    {
      id: 2,
      info: data?.additionalResources?.email,
      icon: "/dev-images/emailIcon.svg",
    },
    {
      id: 3,
      info: data?.additionalResources?.supportNumber,
      icon: "/dev-images/dateIcon.svg",
    },
  ];

  // api
  async function getAllFaqsData() {
    setLoading("loading");
    const { response } = await Get({
      route: "faqs/all",
    });
    if (response) {
      const allFaq = Array.isArray(response?.data)
        ? response.data.map((faq) => ({
            title: faq?.title?.[locale] || "",
            description: faq?.description?.[locale] || "",
          }))
        : [];

      setFaqData(allFaq);
      console.log(allFaq, "allFaq");
    }

    setLoading("");
  }

  // Download function using getFileFromKey
  const handleDownload = async (fileKey, fileName, index) => {
    if (!fileKey) {
      console.error("No file key provided");
      return;
    }

    setDownloadLoading((prev) => ({ ...prev, [index]: true }));

    try {
      // Get file type from the key
      const fileType = fileKey.split(".").pop();
      const blobType =
        fileType === "pdf"
          ? "application/pdf"
          : fileType === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/octet-stream";

      // Use getFileFromKey to get the file
      const file = await getFileFromKey(
        fileKey,
        fileName,
        (file) => {
          // Create download link
          const url = window.URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.${fileType}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        },
        blobType
      );

      console.log("Download completed successfully");
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  useEffect(() => {
    getAllFaqsData();
  }, []);

  return (
    <div className={classes.main}>
      <Container className="containerFluid">
        {isMobile ? (
          <MobileHeader
            title={t("title")}
            icon={
              <Image
                src={"/svg/guide.svg"}
                height={14}
                width={14}
                alt="guide"
              />
            }
            showBack
          />
        ) : (
          <TopHeader
            tabs={false}
            title={t("title")}
            icon={
              <Image
                src={"/svg/guide.svg"}
                height={14}
                width={14}
                alt="guide"
              />
            }
          />
        )}

        <div className={classes.welcomeDiv}>
          <HeaderCard
            width={isMobile}
            title={t("welcomeMessage")}
            description={t("WelcomeDescription")}
          />
          <div className={classes.contentMain}>
            <SideAccordion
              t={t}
              items={servicesCardData(data, locale)}
              downloadableItems={downloadable(data)}
              defaultIndex={0}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              contactInfo={CONTACT_INFO}
              handleDownload={handleDownload}
              downloadLoading={downloadLoading}
            />
            <Frequently
              t={t}
              faqTab={faqTab}
              setFaqTab={setFaqTab}
              isMobile={isMobile}
              items={faqData}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

function SideAccordion({
  items,
  downloadableItems,
  defaultIndex = 0,
  rightIcon = "/svg/rightArrow.svg",
  selectedTab,
  setSelectedTab,
  contactInfo,
  handleDownload,
  downloadLoading,
  t,
}) {
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const { width } = useDimensions();
  const isMobileAccordion = width <= 768;

  return (
    <div className={classes.sideAccordionLayout}>
      <div className={classes.menuColumn}>
        {items.map((item, idx) => (
          <React.Fragment key={item._id}>
            <div
              className={`${classes.menuItem} ${
                idx === activeIndex ? classes.active : ""
              }`}
              onClick={() =>
                isMobileAccordion
                  ? setActiveIndex(idx === activeIndex ? null : idx)
                  : setActiveIndex(idx)
              }
            >
              <div className={classes?.iconAccordion}>
                <div className={classes?.leftIconBox}>
                  {item.leftIcon && (
                    <Image
                      src={item.leftIcon}
                      alt="icon"
                      width={20}
                      height={20}
                      className={classes.menuIcon}
                    />
                  )}
                </div>
                <span>{item.title}</span>
              </div>
              {isMobileAccordion && (
                <div className={classes.lefttIconBox}>
                  <Image
                    src={
                      idx === activeIndex ? "/svg/close.svg" : "/svg/open.svg"
                    }
                    alt={idx === activeIndex ? "open" : "close"}
                    width={16}
                    height={16}
                  />
                </div>
              )}
              {!isMobileAccordion && !(idx === activeIndex) && rightIcon && (
                <div className={classes.lefttIconBox}>
                  <Image
                    src={rightIcon}
                    alt="leftIcon"
                    width={16}
                    height={16}
                  />
                </div>
              )}
            </div>
            {isMobileAccordion && idx === activeIndex && (
              <div className={classes.contentColumn}>
                <div className={classes.contentBody}>
                  <h2 className={classes.contentdesc}>
                    {parse(items[activeIndex]?.description || "<></>")}
                  </h2>

                  {item.myVideo && (
                    <div className={classes?.videoImage}>
                      <video
                        className={classes?.video}
                        width="295"
                        height="134"
                        controls
                      >
                        <source src={item.myVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        {/* additional */}
        <div className={classes?.additionalContainer}>
          <h2>{t("additionalResources.title")}</h2>
          <div className={classes?.tabs}>
            <Tabs
              tabsData={tabOptions(t)}
              selected={selectedTab}
              setSelected={setSelectedTab}
              containerClass={classes?.tabsMain}
              ulCustom={classes?.ulclass}
            />
          </div>
          {selectedTab?.value === "download" && (
            <div className={classes?.tabsdownload}>
              {downloadableItems?.map((item, index) => (
                <div key={index} className={classes?.mainFile}>
                  <div className={classes?.downnloadebleMain}>
                    <div className={classes?.downnloadebleImage}>
                      <Image
                        src={imageUrl(item.icon)}
                        height={28}
                        width={28}
                        alt={item.info}
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(item.fileUrl, item.info[locale], index)
                      }
                      disabled={downloadLoading[index]}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: downloadLoading[index]
                          ? "not-allowed"
                          : "pointer",
                        opacity: downloadLoading[index] ? 0.6 : 1,
                      }}
                    >
                      <GoDownload size={24} color="#33B5F6" />
                    </button>
                  </div>
                  <h5>{item.info[locale]}</h5>
                </div>
              ))}
            </div>
          )}

          {selectedTab?.value === "contact" && (
            <div className={classes?.tabsss}>
              <div className={classes?.policyCards}>
                {contactInfo?.map((item, index) => (
                  <div key={index} className={classes?.policySingle}>
                    <Image
                      src={imageUrl(item.icon)}
                      height={24}
                      width={24}
                      alt={"icon"}
                    />
                    <h5>{item.info}</h5>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isMobileAccordion && (
        <div className={classes.contentColumn}>
          <div className={classes?.accordionTopContent}>
            <div className={classes.menuIconMobile}>
              {items[activeIndex].leftIcon && (
                <Image
                  src={items[activeIndex].leftIcon}
                  alt="icon"
                  width={20}
                  height={20}
                  className={classes.menuIcon}
                />
              )}
            </div>
            <h3 className={classes.contentTitle}>{items[activeIndex].title}</h3>
          </div>

          <div className={classes.contentBody}>
            <h2>{parse(items?.[activeIndex]?.description || "<></>")}</h2>

            {items[activeIndex].myVideo && (
              <div className={classes?.videoImage}>
                <video
                  className={classes?.video}
                  width="295"
                  height="134"
                  controls
                >
                  <source src={items[activeIndex].myVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Frequently({ t, items }) {
  const router = useRouter();

  return (
    <>
      <style>
        {`
        .accordion-body{
        --bs-accordion-bg:red !important;
        background: var(--Blue, #33B5F6);
            padding: 20px 18px !important;
        }
        .accordion-collapse.collapse.show{
        --bs-accordion-bg:red !important;
        // background: var(--Blue, #33B5F6);
        border-radius: 8px;
        background: #F4F7FD;
        }
       
    
          .accordion-button{
        background:    #F4F7FD !important;}
        .accordion-button:not(.collapsed){
        border-radius:0 !important;}
        .accordion-item{
        border-radius:8px !important;
        overflow:hidden  !important;
        // --bs-accordion-border-radius:50px !important;
        // --bs-accordion-inner-border-radius:50px !important;
       
        }
        .accordion-button:not(.collapsed) > p , .accordion-body > p{
        color:#fff !important;}
        
        .accordion-button:not(.collapsed):after{
        background-image:url(/svg/Accordionarrowcollapse.svg) !important;
           transform: rotate(360deg) !important;
        }
      .accordion-button:after{
        background-image:url(/svg/Accordionarrow.svg) !important;
        }
        
      `}
      </style>
      <div className={classes?.mainfaqs}>
        <div className={classes?.additionalContainerFrequently}>
          <h2>{t("frequently.title")}</h2>

          <Accordions
            items={items}
            containerClass={classes?.containerClassAccordions}
            itemClass={classes?.itemClass}
          />
        </div>
      </div>
    </>
  );
}
