import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EmptyResult from "../../components/common/EmptyResult";
import DeleteCoupon from "../../components/form/Coupon/DeleteCoupon/DeleteCoupon";
import EditCouponManagement from "../../components/form/Coupon/EditCoupon/EditCouponManagement";
import NewCouponManagement from "../../components/form/Coupon/NewCoupon/NewCouponManagement";
import PaginationNumberedList from "../../components/pagination/PaginationNumberedList";
import { Coupon } from "../../models";
import AddNewCouponButton from "./AddNewCouponButton";
import CardCouponView from "./CardCouponView";
import CouponsSkeleton from "./CouponsSkeleton";
import {
  getAllCoupons,
  getAllCouponsByCouponName,
  getAllCouponsByCouponType,
  updateStatusCoupon,
} from "./couponsThunk";
import SearchCouponButton from "./SearchCouponButton";
import SortCouponByType from "./SortCouponByType";

const Coupons: React.FC = () => {
  const history = useHistory();
  const { search } = useLocation();
  let paginationQuery = queryString.parse(search);
  const limit = paginationQuery.limit ? +paginationQuery.limit : 0;
  const offset = paginationQuery.offset ? +paginationQuery.offset : 0;
  const couponType =
    paginationQuery.couponType && (paginationQuery.couponType as string);
  const couponName =
    paginationQuery.couponName && (paginationQuery.couponName as string);

  const dispatch = useAppDispatch();
  const fetchingCoupons = useAppSelector(
    (state) => state.coupons.fetchingCoupons
  );
  const coupons = useAppSelector((state) => state.coupons.coupons);

  console.log(coupons);
  const totalCoupons = useAppSelector(
    (state) => state.coupons.pagination.total
  );

  const [openCouponForm, setOpenCouponForm] = useState<boolean>(false);
  const [openEditCouponForm, setOpenEditCouponForm] = useState<boolean>(false);
  const [openDeleteCouponForm, setOpenDeleteCouponForm] =
    useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon>();

  useEffect(() => {
    (async function () {
      try {
        if (couponName)
          return await dispatch(
            getAllCouponsByCouponName({ offset: 0, couponName })
          );
        if (couponType)
          return await dispatch(
            getAllCouponsByCouponType({ offset: 0, couponType })
          );
        await dispatch(getAllCoupons(offset));
      } catch (error) {
        toast.error(error as Error);
      }
    })();
  }, [couponName, couponType, offset]);

  const paginate = (pageNumber: number) => {
    if (couponName) {
      history.push({
        pathname: "/admin/coupons",
        search: `?limit=${limit}&offset=${
          pageNumber - 1
        }&couponName=${couponName}`,
      });
      dispatch(
        getAllCouponsByCouponName({ offset: pageNumber - 1, couponName })
      );
      return;
    }
    if (couponType) {
      history.push({
        pathname: "/admin/coupons",
        search: `?limit=${limit}&offset=${
          pageNumber - 1
        }&couponType=${couponType}`,
      });
      dispatch(
        getAllCouponsByCouponType({ offset: pageNumber - 1, couponType })
      );
      return;
    }
    history.push({
      pathname: "/admin/coupons",
      search: `?limit=${limit}&offset=${pageNumber - 1}`,
    });
    dispatch(getAllCoupons(pageNumber - 1));
  };

  function handleOpenCouponForm() {
    setOpenCouponForm(!openCouponForm);
  }

  function handleOpenEditCouponForm() {
    setOpenEditCouponForm(!openEditCouponForm);
  }

  function handleOpenDeleteCouponForm() {
    setOpenDeleteCouponForm(!openDeleteCouponForm);
  }

  function handleEditCoupon(coupon: Coupon) {
    setSelectedCoupon(coupon);
    handleOpenEditCouponForm();
  }

  function handleDeleteCoupon(coupon: Coupon) {
    setSelectedCoupon(coupon);
    handleOpenDeleteCouponForm();
  }

  async function handleUpdateStatusCoupon(id: string | undefined) {
    try {
      dispatch(updateStatusCoupon(id));
    } catch (error) {
      toast.error(error as Error);
    }
  }

  return (
    <div className="flex flex-col p-5 dark:bg-gray-600 w-full">
      <AddNewCouponButton
        fetchingCoupons={fetchingCoupons}
        handleOpenCouponForm={handleOpenCouponForm}
      />
      <div className="my-3 text-gray-600 flex items-center">
        <SearchCouponButton />
        <SortCouponByType />
      </div>
      {fetchingCoupons ? (
        <CouponsSkeleton n={limit} />
      ) : coupons.length === 0 ? (
        <EmptyResult />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 animate-fade-in-down">
          {coupons.map((coupon, index) => (
            <CardCouponView
              key={index}
              coupon={coupon}
              handleDeleteCoupon={handleDeleteCoupon}
              handleEditCoupon={handleEditCoupon}
              handleUpdateStatusCoupon={handleUpdateStatusCoupon}
            />
          ))}
        </div>
      )}
      <PaginationNumberedList
        totalArray={totalCoupons}
        arrayPerPage={limit}
        currentPage={offset}
        paginate={paginate}
      />
      <NewCouponManagement
        openCouponForm={openCouponForm}
        handleOpenCouponForm={handleOpenCouponForm}
      />
      <EditCouponManagement
        coupon={selectedCoupon}
        openEditCouponForm={openEditCouponForm}
        handleOpenEditCouponForm={handleOpenEditCouponForm}
      />
      <DeleteCoupon
        fetchingCoupons={fetchingCoupons}
        coupon={selectedCoupon}
        openDialog={openDeleteCouponForm}
        handleOpenDeleteCouponForm={handleOpenDeleteCouponForm}
      />
    </div>
  );
};

export default Coupons;
