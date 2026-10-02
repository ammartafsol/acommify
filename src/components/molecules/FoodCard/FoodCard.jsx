import RenderStatusCell from "@/components/organisms/AppTable/tableHelper";
import { imageUrl } from "@/resources/utils/helper";
import Image from "next/image";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";
import { useTranslations } from "@/resources/hooks/useTranslations";

export default function FoodCard({
  data,
  t,
  toggleFav = () => {},
  onAdd = () => {},
  onClick = () => {},
  addDisabled = false,
  loading,
}) {
  const c = useTranslations("common");
  return (
    <div className={styles.card} onClick={onClick}>
      <button
        className={styles.favButton}
        onClick={toggleFav}
        data-fav={data?.isFavorite}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
        disabled={loading}
      >
        <ReactSVG
          className="reactSvg"
          src={"/svg/blueHeart.svg"}
          width={16}
          height={16}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
        />
      </button>
      <div className={styles.cardImg}>
        <Image src={imageUrl(data?.image)} alt={data?.name} fill />
      </div>
      <h5 className="maxLine1">{data?.name}</h5>
      <div className={styles.cardStock}>
      <p className="maxLine1" style={{ textTransform: "capitalize" }}>
        {data?.description}
      </p>
        <span> {c("stock")}: {data?.stock}</span>
      </div>
      <div className={styles.cardBody}>
        <RenderStatusCell
          status={`${data?.shippingOption}`.replace(/-/g, " & ")}
        />
      </div>
      <div className={styles.cardFooter}>
        <div>
          <ReactSVG
            className="reactSvg"
            src="/svg/points.svg"
            width={16}
            height={16}
          />
          <span>{t("points", { points: data?.points })}</span>
        </div>
        <button
          className={styles.addButton}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          disabled={addDisabled}
        >
          <ReactSVG
            className="reactSvg"
            src="/svg/plus.svg"
            width={16}
            height={16}
          />
        </button>
      </div>
    </div>
  );
}
