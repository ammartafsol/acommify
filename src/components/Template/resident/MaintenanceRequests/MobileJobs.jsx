"use client";

import RenderStatusCell from "@/components/organisms/AppTable/tableHelper";
import { useTranslations } from "@/resources/hooks/useTranslations";
import useDirection from "@/resources/hooks/useDirection";
import { useLocale } from "next-intl";
import { HiOutlineHome, HiOutlineUser, HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { LuDoorClosed } from "react-icons/lu";
import { IoChevronForward, IoSearchOutline } from "react-icons/io5";
import {
  asText,
  formatListTime,
  houseValue,
  jobTitle,
  personName,
  placeLabel,
  roomValue,
} from "./jobFormat";
import styles from "./mobileJobs.module.css";

export default function MobileJobs({
  tabs,
  selectedTab,
  onTabChange,
  search,
  setSearch,
  jobs,
  loading,
  onOpen,
  onAdd,
  canLoadMore,
  onLoadMore,
}) {
  const t = useTranslations("maintenance.maintenanceRequests");
  const locale = useLocale();
  const dir = useDirection();
  const list = Array.isArray(jobs) ? jobs : [];

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1>{t("jobs.title")}</h1>
        <p>{t("jobs.subtitle")}</p>
      </div>

      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => {
          const active = selectedTab?.value === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? styles.tabActive : styles.tab}
              onClick={() => onTabChange(tab)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <label className={styles.search}>
        <IoSearchOutline size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("jobs.searchPlaceholder")}
        />
      </label>

      {loading === "loading" ? (
        <div className={styles.skeletonList} aria-hidden="true">
          {[0, 1, 2].map((key) => (
            <div key={key} className={styles.skeletonCard}>
              <div className={styles.skeletonBody}>
                <div className={styles.skeletonTop}>
                  <span className={styles.skeletonPill} />
                  <span className={styles.skeletonTime} />
                </div>
                <span className={styles.skeletonTitle} />
                <span className={styles.skeletonLine} />
                <span className={styles.skeletonLineShort} />
              </div>
              <span className={styles.skeletonChevron} />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className={styles.empty}>{t("jobs.empty")}</p>
      ) : (
        <div className={styles.list}>
          {list.map((item, index) => {
            const house = placeLabel(t("jobs.house"), houseValue(item));
            const room = placeLabel(t("jobs.room"), roomValue(item, locale));
            const person = personName(item, locale);
            const category = asText(item?.category?.name, locale);
            return (
              <button
                key={item?.slug || item?._id || index}
                type="button"
                className={styles.card}
                onClick={() => onOpen(item)}
              >
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <RenderStatusCell status={item?.status} />
                    <time>{formatListTime(item?.createdAt, t)}</time>
                  </div>
                  <h2>{jobTitle(item, locale)}</h2>
                  <div className={styles.meta}>
                    {house ? (
                      <p>
                        <HiOutlineHome size={15} />
                        {house}
                      </p>
                    ) : null}
                    {room ? (
                      <p>
                        <LuDoorClosed size={15} />
                        {room}
                      </p>
                    ) : null}
                    {person ? (
                      <p>
                        <HiOutlineUser size={15} />
                        {person}
                      </p>
                    ) : null}
                    {category && category !== jobTitle(item, locale) ? (
                      <p>
                        <HiOutlineWrenchScrewdriver size={15} />
                        {category}
                      </p>
                    ) : null}
                  </div>
                </div>
                <IoChevronForward
                  className={styles.chevron}
                  size={18}
                  style={dir === "rtl" ? { transform: "rotate(180deg)" } : undefined}
                />
              </button>
            );
          })}
        </div>
      )}

      {canLoadMore ? (
        <button
          type="button"
          className={styles.loadMore}
          onClick={onLoadMore}
          disabled={loading === "more"}
        >
          {t("jobs.loadMore")}
        </button>
      ) : null}

      <button type="button" className={styles.fab} onClick={onAdd} aria-label={t("addNewRequest")}>
        +
      </button>
    </div>
  );
}
