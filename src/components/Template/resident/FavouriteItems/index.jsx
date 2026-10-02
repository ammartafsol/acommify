"use client";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import FoodCard from "@/components/molecules/FoodCard/FoodCard";
import Pagination from "@/components/molecules/Pagination";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import useAxios from "@/interceptor/axios-functions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import { setFavouriteItems } from "@/store/common/commonSlice";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import classes from "./FavouriteItems.module.css";
import { addToCart } from "@/store/cart/cartSlice";
import Image from "next/image";
import useDimensions from "@/resources/hooks/useDimensions";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";

export default function FavouriteItems() {
  const t = useTranslations("favouritePage");
  const c = useTranslations("common");
  const locale = useLocale();
  const { Get, Post } = useAxios();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartReducer.items);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [favLoadingId, setFavLoadingId] = useState(null);
  const [animateCart, setAnimateCart] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const animationTimeoutRef = useRef();
  const {width} = useDimensions();
  

  const handleAddToCart = (item) => {
    const cartItem = cartItems.find((ci) => ci.id === item.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    
    // Check if stock limit is reached
    if (item.stock && currentQuantity >= item.stock) {
      return;
    }

    // Add item to cart (cart slice will increment quantity if item exists)
    dispatch(addToCart({ ...item, stock: item.stock }));
    
    // Show cart overlay animation (only once, not per click)
    if (!showCartOverlay) {
      setAnimateCart(true);
      setShowCartOverlay(true);
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = setTimeout(() => {
        setAnimateCart(false);
        setShowCartOverlay(false);
      }, 1000); // overlay duration
    }
  };

  const favouriteItems =
    useSelector((state) => state.commonReducer.favouriteItems) || [];
  const favouriteRef = useRef(favouriteItems);

  useEffect(() => {
    favouriteRef.current = favouriteItems;
  }, [favouriteItems]);

  const fetchData = async ({ page }) => {
    const query = {
      page,
      limit: 10,
    };
    const queryParams = new URLSearchParams(query).toString();
    setLoading("gettingData");
    const { response } = await Get({
      route: `users/favorite/list/all?${queryParams}`,
    });
    if (response) {
      const formattedData = response?.data?.map((item) => {
        const product = item.product || {};
        return {
          ...item,
          id: product._id || item._id,
          _id: product._id || item._id,
          name: product.name?.[locale] || product.name?.en || "",

          image: product.image || "/dev-images/dummyFood.jpg",
          points: product.points || 0,
          stock: product.stock || 0,
          slug: product.slug || "",
          isFavorite: true,
          shippingOption: product.shippingOption || "",
        };
      });
      setData(formattedData);
      setTotalRecords(response.totalRecords);
    }
    setLoading("");
  };
  const favouriteToggleHandler = async (slug, id) => {
    setFavLoadingId(id);

    try {
      const { response } = await Post({
        route: `users/favorite/add/remove/item/${slug}`,
      });

      if (response) {
        // Remove from Redux after successful API response
        const currentFavs = Array.isArray(favouriteRef.current)
          ? [...favouriteRef.current]
          : [];
        const updatedFavs = currentFavs.filter((item) => item !== id);
        dispatch(setFavouriteItems(updatedFavs));
        favouriteRef.current = updatedFavs;

        RenderToast({
          type: "success",
          message: t("toasts.removedFromFavorites"),
        });

        // Refetch data to update the list
        fetchData({ page: 1 });
      } else {
        RenderToast({
          type: "error",
          message: t("toasts.actionFailed") || "Action failed",
        });
      }
    } catch (err) {
      RenderToast({
        type: "error",
        message: t("toasts.actionFailed") || "Action failed",
      });
    }

    setFavLoadingId(null);
  };

  useEffect(() => {
    fetchData({ page: 1 });
  }, []);


  return (
    <Container className="containerFluid">
      <div className={classes.main}>
        {
          width < 577 ? (
            <MobileHeader title={t("title")} showBack />
          ) : (
            <TopHeader title={t("title")} backButton={true} />
          )
        }

        {loading === "gettingData" ? (
          <div className={classes.spinner}>
            <SpinnerLoading />
          </div>
        ) : data?.length > 0 ? (
          <div className={classes.grid}>
            {data?.map((item) => {
              const cartItem = cartItems.find((ci) => ci.id === item.id);
              const currentQuantity = cartItem ? cartItem.quantity : 0;
              const isStockLimitReached = item.stock && currentQuantity >= item.stock;
              
              return (
                <FoodCard
                  key={item.id}
                  data={{ ...item }}
                  t={c}
                  toggleFav={() => favouriteToggleHandler(item?.slug, item._id)}
                  loading={favLoadingId === item._id}
                  onAdd={() => handleAddToCart(item)}
                  addDisabled={isStockLimitReached}
                />
              );
            })}
          </div>
        ) : (
          <div className={classes.noDataFound}>
            <NoDataFound text={t("empty")} />
          </div>
        )}
        {totalRecords > RECORDS_LIMIT && (
          <Pagination
            currentPage={page}
            setCurrentPage={(newPage) => {
              setPage(newPage);
              fetchData({ page: newPage });
            }}
            totalRecords={totalRecords}
            limit={RECORDS_LIMIT}
          />
        )}
      </div>
      {showCartOverlay && (
        <div className={classes.cartOverlay}>
          <div className={classes.cartOverlayContent}>
            <Image
              src="/svg/shoppingBag.svg"
              alt="Cart"
              width={60}
              height={60}
            />
            <div className={classes.cartOverlayText}>{t("addedToCart")}</div>
          </div>
        </div>
      )}
    </Container>
  );
}

