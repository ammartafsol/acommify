"use client";
import Button from "@/components/atoms/Button";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import RenderToast from "@/components/atoms/RenderToast";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { useRouter } from "@/i18n/navigation";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { imageUrl, mergeClass } from "@/resources/utils/helper";
import { removeFromCart, updateQuantity } from "@/store/cart/cartSlice";
import Image from "next/image";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";

export default function CartOverview() {
  const t = useTranslations("cartOverviewPage");
  const c = useTranslations("common");
  const cartItems = useSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const { width } = useDimensions();
  const isMobile = width < 577;

  return (
    <Container className={mergeClass(styles.main, "containerFluid")}>
      {isMobile ? (
        <MobileHeader title={t("title")} showBack />
      ) : (
        <TopHeader title={t("title")} />
      )}

      {cartItems?.length === 0 ? (
        <NoDataFound text={t("noItemsInCart")} />
      ) : (
        <>
          {" "}
          <div className={styles.cartContainer}>
            {!isMobile ? (
              <CartTable
                cartItems={cartItems}
                dispatch={dispatch}
                t={t}
                c={c}
              />
            ) : (
              <CartItemCard
                cartItems={cartItems}
                dispatch={dispatch}
                t={t}
                c={c}
              />
            )}

            {/* Cart */}
            <div className={styles.cartRight}>
              <div className={styles.cartSummary}>
                <h2>{t("cartSummary")}</h2>
                <div className={styles.cartTotal}>
                  <p>
                    <span className={styles.totalItems}>{t("totalItems")}</span>
                    <span className={styles.totalItemsVal}>
                      {cartItems?.length}
                    </span>
                  </p>
                  <p>
                    <span className={styles.totalPoints}>
                      {t("totalPoints")}
                    </span>
                    <span className={styles.totalPointsVal}>
                      {cartItems.reduce(
                        (acc, item) => acc + item.points * item.quantity,
                        0
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                label={t("checkout")}
                className={styles.checkoutBtn}
                onClick={() => {
                  const itemsWithZeroStock = cartItems?.filter(
                    (item) => item.stock === 0
                  );

                  if (itemsWithZeroStock.length > 0) {
                    if (itemsWithZeroStock.length === 1) {
                      RenderToast({
                        type: "error",
                        message: `${itemsWithZeroStock[0].name} ${t(
                          "stockIsZero"
                        )}`,
                      });
                    } else {
                      const itemNames = itemsWithZeroStock
                        .map((item) => item.name)
                        .join(", ");
                      RenderToast({
                        type: "error",
                        message: `${t("itemsStockIsZero")}: ${itemNames}`,
                      });
                    }
                    return;
                  }

                  router.push("/resident/food-stuffs/cart/checkout");
                }}
              />
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const CartTable = ({ cartItems, dispatch, c, t }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const updateQuantityHandler = (id, change) => {
    const item = cartItems.find((i) => i.id === id);
    if (change > 0 && item && item.quantity >= (item.stock || Infinity)) {
      setToastMsg(t("stockLimitReached") || "Stock limit reached");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    dispatch(updateQuantity({ id, change }));
  };

  const removeItemHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const calculateSubtotal = (points, quantity) => points * quantity;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th>{t("table.header.product")}</th>
            <th>{t("table.header.points")}</th>
            <th>{t("table.header.quantity")}</th>
            <th>{t("table.header.subtotal")}</th>
            <th>{t("table.header.stocks")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems?.map((item) => (
            <tr key={item.id}>
              <td className={styles.productCell}>
                <div className={styles.productInfo}>
                  <div className={styles.productImageContainer}>
                    <Image
                      src={imageUrl(item?.image)}
                      alt={item.name}
                      fill
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productDetails}>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.points}>
                  <ReactSVG
                    className="reactSvg"
                    src="/svg/points.svg"
                    width={16}
                    height={16}
                  />
                  <span>{c("points", { points: item?.points })}</span>
                </div>
              </td>
              <td>
                <div className={styles.quantityControls}>
                  {item.quantity <= 1 ? (
                    <CiCircleMinus
                      size={34}
                      color="var(--Blue)"
                      cursor="not-allowed"
                    />
                  ) : (
                    <FaCircleMinus
                      onClick={() => updateQuantityHandler(item.id, -1)}
                      disabled={item.quantity <= 1}
                      size={28}
                      color="var(--Blue)"
                      cursor={"pointer"}
                    />
                  )}

                  <span className={styles.quantity}>{item.quantity}</span>
                  {item.quantity >= item.stock ? (
                    <CiCirclePlus
                      size={34}
                      color="var(--Blue)"
                      cursor="not-allowed"
                    />
                  ) : (
                    <FaCirclePlus
                      onClick={() => updateQuantityHandler(item.id, 1)}
                      size={28}
                      color="var(--Blue)"
                      cursor="pointer"
                    />
                  )}
                </div>
              </td>
              <td>
                <span className={styles.subtotal}>
                  {c("points", {
                    points: calculateSubtotal(item.points, item.quantity),
                  })}
                </span>
              </td>
              <td>
                <span className={styles.subtotal}>{item.stock}</span>
              </td>
              <td>
                <HiOutlineTrash
                  cursor="pointer"
                  color="var(--Red)"
                  size={24}
                  onClick={() => removeItemHandler(item.id)}
                  className={styles.deleteIcon}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showToast && <div className={styles.toast}>{toastMsg}</div>}
    </div>
  );
};

const CartItemCard = ({ cartItems, dispatch, c, t }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const updateQuantityHandler = (id, change) => {
    const item = cartItems.find((i) => i.id === id);
    if (change > 0 && item && item.quantity >= (item.stock || Infinity)) {
      setToastMsg(t("stockLimitReached") || "Stock limit reached");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    dispatch(updateQuantity({ id, change }));
  };

  const removeItemHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  const calculateSubtotal = (points, quantity) => points * quantity;

  return (
    <>
      {cartItems?.map((item) => (
        <div key={item.id} className={styles.cartItemCard}>
          <div className={styles.productCardLeft}>
            <div className={styles.productImageContainer}>
              <Image
                src={imageUrl(item?.image)}
                alt={item.name}
                fill
                className={styles.productImage}
              />
            </div>
          </div>
          <div className={styles.productCardRight}>
            <div className={styles.top}>
              <p>{item.name}</p>
              <IoCloseOutline
                color="#8C939B"
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => removeItemHandler(item.id)}
              />
            </div>
            <p className={styles.productDesc}>{item.description}</p>
            <div className={styles.bottom}>
              <div className={styles.bottomRow}>
                <div className={styles.leftSection}>
                  <div className={styles.points}>
                    <ReactSVG
                      className="reactSvg"
                      src="/svg/points.svg"
                      width={16}
                      height={16}
                    />
                    <span>{c("points", { points: item?.points })}</span>
                  </div>
                  <div className={styles.subtotalStocks}>
                    <span className={styles.subtotal}>
                      {t("table.header.subtotal")}:{" "}
                      {c("points", {
                        points: calculateSubtotal(item.points, item.quantity),
                      })}
                    </span>
                    <span className={styles.stocks}>
                      {t("table.header.stocks")}: {item.stock}
                    </span>
                  </div>
                </div>
                <div className={styles.quantityControls}>
                  {item.quantity <= 1 ? (
                    <CiCircleMinus
                      size={34}
                      color="var(--Blue)"
                      cursor="not-allowed"
                      className={styles.quantityControlIcon}
                    />
                  ) : (
                    <FaCircleMinus
                      onClick={() => updateQuantityHandler(item.id, -1)}
                      disabled={item.quantity <= 1}
                      size={28}
                      color="var(--Blue)"
                      cursor={"pointer"}
                    />
                  )}

                  <span className={styles.quantity}>{item.quantity}</span>
                  {item.quantity >= (item.stock || Infinity) ? (
                    <CiCirclePlus
                      size={34}
                      color="var(--Blue)"
                      cursor="not-allowed"
                      className={styles.quantityControlIcon}
                    />
                  ) : (
                    <FaCirclePlus
                      onClick={() => updateQuantityHandler(item.id, 1)}
                      size={28}
                      color="var(--Blue)"
                      cursor="pointer"
                    />
                  )}
                </div>
              </div>

              {item.quantity >= (item.stock || Infinity) && (
                <span className={styles.stockLimitMsg}>
                  {t("stockLimitReached") || "Stock limit reached"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      {showToast && <div className={styles.toast}>{toastMsg}</div>}
    </>
  );
};
