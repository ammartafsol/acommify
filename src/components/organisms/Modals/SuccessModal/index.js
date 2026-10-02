import Button from "@/components/atoms/Button";
import { useRouter } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import Image from "next/image";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./Style.module.css";

export default function SuccessModal({
  show,
  setShow,
  icon = "/svg/Successfully.svg",
  title,
  btnText,
  content = "modal.SuccessModal",
  btnStyle = {},
  onClose = () => {},
}) {
  const t = useTranslations(content);
  const router = useRouter();
  const { width } = useDimensions();

  function handleClose() {
    setShow(false);
  }
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      header={" "}
      maxWidth={"486px"}
      borderRadius="8px"
    >
      <div className={classes.main}>
        <Image src={icon} alt={"icon"} width={236} height={190} />
        <div>
          <h5>{title || t("title")}</h5>
        </div>
        <Button
          variant={"primary"}
          label={btnText || t("btnText")}
          customStyle={btnStyle}
          onClick={() => (handleClose(), onClose())}
        />
      </div>
    </ModalSkeleton>
  );
}
