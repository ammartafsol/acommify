"use client";
import Button from "@/components/atoms/Button";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import FoodCard from "@/components/molecules/FoodCard/FoodCard";
import MobileHeader from "@/components/molecules/MobileHeader/MobileHeader";
import Pagination from "@/components/molecules/Pagination";
import TopHeader from "@/components/molecules/TopHeader/TopHeader";
import { useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import useDebounce from "@/resources/hooks/useDebounce";
import useDimensions from "@/resources/hooks/useDimensions";
import { useTranslations } from "@/resources/hooks/useTranslations";
import { mergeClass } from "@/resources/utils/helper";
import { addToCart } from "@/store/cart/cartSlice";
import { setFavouriteItems } from "@/store/common/commonSlice";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";

export default function FoodStuffs() {
  const t = useTranslations("foodStuffsPage");
  const c = useTranslations("common");
  const locale = useLocale();
  const { Get, Post } = useAxios();
  const router = useRouter();
  const { width } = useDimensions();
  const isMobile = width < 577;

  // Separate state variables
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const [categories, setCategories] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [favLoadingId, setFavLoadingId] = useState(null);
  const [animateCart, setAnimateCart] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const animationTimeoutRef = useRef();
  const searchDebounce = useDebounce(search, 500);
  const cartItems = useSelector((state) => state.cartReducer.items);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    const cartItem = cartItems.find((ci) => ci.id === item.id);
    if (!cartItem || cartItem.quantity < item.stock) {
      dispatch(addToCart({ ...item, stock: item.stock }));
      setAnimateCart(true);
      setShowCartOverlay(true);
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = setTimeout(() => {
        setAnimateCart(false);
        setShowCartOverlay(false);
      }, 1000); // overlay duration
    }
  };

  // Get all categories
  const getAllCategories = async () => {
    setLoading("categories");
    const { response } = await Get({ route: "category/all?crudType=product" });
    if (response) {
      const cats = response.data?.map((elem) => ({
        label: elem?.name?.[locale],
        value: elem?.slug,
      }));
      setCategories([{ label: t("all"), value: "all" }, ...cats]);
      // Ensure "All" tab is selected if not already
      setSelectedTab((prev) => prev || "all");
    }
    setLoading("");
  };

  const fetchData = async ({ category, search = "", page }) => {
    setLoading("loading");
    const query = {
      search,
      categorySlug: category === "all" ? "" : category,
      page,
      limit: 12,
    };

    const queryParams = new URLSearchParams(query).toString();
    const { response } = await Get({ route: `product/all?${queryParams}` });
    if (response) {
      const formattedData = response?.data?.map((item) => ({
        ...item,
        id: item._id,
        name: item.name?.[locale],
        description: item.category?.name?.[locale],
        image: item.image,
        // image: "/dev-images/dummyFood.jpg",
        points: item.points,
        isFavorite: false,
        stock: item.stock,
      }));
      setProductsData(formattedData);
      setTotalRecords(response?.totalRecords);
    }
    setLoading("");
  };

  // Favourite toggle handler
  const favouriteItems =
    useSelector((state) => state.commonReducer.favouriteItems) || [];
  const favouriteRef = useRef(favouriteItems); // keep latest favourites in a ref
  useEffect(() => {
    favouriteRef.current = favouriteItems;
  }, [favouriteItems]);

  const favouriteToggleHandler = async (slug, id) => {
    setFavLoadingId(id);

    const currentFavs = Array.isArray(favouriteRef.current)
      ? [...favouriteRef.current]
      : [];
    const isExists = currentFavs.includes(id);

    // Optimistic update
    const updatedFavs = isExists
      ? currentFavs.filter((item) => item !== id)
      : [...currentFavs, id];

    dispatch(setFavouriteItems(updatedFavs));
    favouriteRef.current = updatedFavs;

    try {
      const { response } = await Post({
        route: `users/favorite/add/remove/item/${slug}`,
      });

      if (response) {
        RenderToast({
          type: "success",
          message: isExists
            ? t("toasts.removedFromFavorites")
            : t("toasts.addedToFavorites"),
        });
      } else {
        dispatch(setFavouriteItems(currentFavs));
        favouriteRef.current = currentFavs;
        RenderToast({
          type: "error",
          message: t("toasts.actionFailed") || "Action failed",
        });
      }
    } catch (err) {
      dispatch(setFavouriteItems(currentFavs));
      favouriteRef.current = currentFavs;
      RenderToast({
        type: "error",
        message: t("toasts.actionFailed") || "Action failed",
      });
    }

    setFavLoadingId(null);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    fetchData({ category: selectedTab, search: searchDebounce, page: 1 });
  }, [selectedTab, searchDebounce]);

  return (
    <Container className={mergeClass(styles.main, "containerFluid")}>
      {isMobile ? (
        <MobileHeader
          icon={<AiOutlineShoppingCart size={16} color="#33B5F6" />}
          title={t("title")}
          showBack
          mainClass={styles.mobileHeaderMain}
          showShoppingBag
          btnOnClick={() => router.push("/resident/food-stuffs/cart")}
          totalItems={cartItems.length}
          children={<div
            className={styles.favouriteBtn}
            onClick={() => router.push("/resident/food-stuffs/favourite")}
          >
            <Image
              src="/svg/blueHeart.svg"
              alt="Favourite"
              width={22}
              height={22}
            />
            <span className={styles.favouriteBtnCount}>
              {favouriteItems?.length}
            </span>
          </div>}
        />
      ) : (
        // <TopHeader
        //   title={t("title")}
        //   btnOnClick={() => router.push("/resident/food-stuffs/cart")}
        //   btnClass={styles.cartBtn}
        //   btnLeftIcon={
        //     <div className={styles.btnLeftIcon}>
        //       <Image
        //         src="/svg/shoppingBag.svg"
        //         alt="Back"
        //         width={22}
        //         height={22}
        //       />
        //       <span
        //         className={`${styles.tooltip} ${
        //           animateCart ? styles.cartDropAnimate : ""
        //         }`}
        //       >
        //         {cartItems.length}
        //       </span>
        //     </div>
        //   }
        // />
        <TopHeader
          title={t("title")}
          // btnOnClick={() => router.push("/resident/food-stuffs/cart")}
          btnClass={styles.cartBtn}
          mainClass={styles.headerMain}
          tabsStuff={styles.tabsStuff}
          // btnLeftIcon={
          //   <div className={styles.btnLeftIcon}>
          //     <Image
          //       src="/svg/shoppingBag.svg"
          //       alt="Back"
          //       width={22}
          //       height={22}
          //     />
          //     <span
          //       className={`${styles.tooltip} ${
          //         animateCart ? styles.cartDropAnimate : ""
          //       }`}
          //     >
          //       {cartItems.length}
          //     </span>
          //   </div>
          // }
        >
          <div
            className={styles.favouriteBtn}
            onClick={() => router.push("/resident/food-stuffs/cart")}
          >
            <Image
              src="/svg/shoppingBag.svg"
              alt="Back"
              width={22}
              height={22}
            />
            <span
              className={`${styles.tooltip} ${
                animateCart ? styles.cartDropAnimate : ""
              }`}
            >
              {cartItems.length}
            </span>
          </div>
          <div
            className={styles.favouriteBtn}
            onClick={() => router.push("/resident/food-stuffs/favourite")}
          >
            <Image
              src="/svg/blueHeart.svg"
              alt="Favourite"
              width={22}
              height={22}
            />
            <span className={styles.favouriteBtnCount}>
              {favouriteItems?.length}
            </span>
          </div>
        </TopHeader>
      )}

      <TopHeader
        title={false}
        showBackBtn={false}
        tabs={categories}
        selectedTab={categories.find((tab) => tab.value === selectedTab)}
        setSelectedTab={(tab) => {
          setPage(1);
          setSelectedTab(tab.value);
        }}
        showSearch
        search={search}
        setSearch={(s) => {
          setSearch(s);
          setPage(1);
        }}
        mainClass={styles.headerMain}
        searchCustom={styles?.searchCustom}
        tabsStuff={styles?.tabsStuff}
      />

      {loading === "loading" ? (
        <div className={styles.spinner}>
          <SpinnerLoading />
        </div>
      ) : productsData?.length === 0 ? (
        <NoDataFound />
      ) : (
        <div
          className={mergeClass(
            styles.grid,
            cartItems.length > 0 ? styles?.mt : ""
          )}
        >
          {productsData?.map((item) => {
            const cartItem = cartItems.find((ci) => ci.id === item.id);
            const isMaxStock = cartItem && cartItem.quantity >= item.stock;
            let isFavorite = favouriteItems?.includes(item._id);
            return (
              <FoodCard
                key={item.id}
                data={{ ...item, isFavorite }}
                t={c}
                onAdd={() => handleAddToCart(item)}
                toggleFav={() => favouriteToggleHandler(item?.slug, item._id)}
                addDisabled={isMaxStock}
                loading={favLoadingId === item._id}
              />
            );
          })}
        </div>
      )}

      {totalRecords > 12 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={page}
            setCurrentPage={(page) => {
              setPage(page);
              fetchData({
                category: selectedTab,
                search: searchDebounce,
                page,
              });
            }}
            limit={12}
            totalRecords={totalRecords}
          />
        </div>
      )}
      {showCartOverlay && (
        <div className={styles.cartOverlay}>
          <div className={styles.cartOverlayContent}>
            <Image
              src="/svg/shoppingBag.svg"
              alt="Cart"
              width={60}
              height={60}
            />
            <div className={styles.cartOverlayText}>{t("addedToCart")}</div>
          </div>
        </div>
      )}
    </Container>
  );
}
