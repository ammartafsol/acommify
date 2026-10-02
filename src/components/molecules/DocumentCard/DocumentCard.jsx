import useDimensions from "@/resources/hooks/useDimensions";
import Image from "next/image";
import { LuDownload } from "react-icons/lu";
import classes from "./DocumentCard.module.css";

export default function DocumentCard({
  data = {},
  title = "",
  date = "",
  isGrid = false,
  document = null,
  onClick = () => {},
}) {
  const { width } = useDimensions();

  return (
    <div
      className={isGrid && width < 680 ? classes.gridCard : classes.card}
      onClick={() => onClick(data)}
    >
      <div className={classes.left}>
        <div className={classes.pdfFileImg}>
          <Image
            src={"/svg/pdfIcon.svg"}
            width={37}
            height={45}
            alt="Document Icon"
          />
        </div>
        <div className={classes.content}>
          <p>{title}</p>
          <p>{date}</p>
        </div>
      </div>
      <div className={classes.downloadIcon}>
        <LuDownload size={24} color="#33B5F6" />
      </div>
    </div>
  );
}
