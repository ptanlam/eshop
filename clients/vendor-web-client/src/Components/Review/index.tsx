import React, { useState, useEffect, Fragment } from "react";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Skeleton,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import "./index.css";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import axios from "axios";
import { REVIEW_URL } from "../../url";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";

interface IReview {
  id: string;
  content: string;
  rating: number;
  reviewerId: string;
  targetId: string;
  reviewer: {
    fullName: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  images: any[];
}

const UserReview = (props: { review: IReview }) => {
  const { review } = props;
  return (
    <div style={{ marginBottom: "20px" }}>
      <Grid
        container
        sx={{
          border: "1px solid gray",
          padding: "10px",
          borderRadius: "10px 10px 0px 0px",
        }}
      >
        {/* name */}
        <Grid item md={4} sx={{ textAlign: "left" }}>
          <img
            src={review.reviewer.avatarUrl}
            className="avatar"
            alt="avatar"
          />
          <div className="reviewerName">{review.reviewer.fullName}</div>
        </Grid>
        {/* rating */}
        <Grid item md={5} sx={{ textAlign: "left" }}>
          <Rating
            value={review.rating}
            precision={0.5}
            readOnly
            sx={{ fontSize: "min(10xp)" }}
          />
        </Grid>
        {/* update */}
        <Grid item md={3} sx={{ textAlign: "right" }}>
          {/* convert to normal date  */}
          <p
            style={{
              fontStyle: "italic",
              margin: "0",
              color: "gray",
              fontSize: "10px",
            }}
          >
            Updated at : {new Date(review.updatedAt).toLocaleDateString()}{" "}
          </p>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ border: "1px solid gray", borderRadius: " 0px 0px 10px 10px" }}
      >
        {/* content */}
        <Grid item md={10} sx={{ textAlign: "left", padding: "10px" }}>
          <p style={{ margin: 0 }}>{review.content}</p>
        </Grid>
        {/* pic */}
        <Grid item md={2}></Grid>
      </Grid>
    </div>
  );
};

const ReviewSkeleton = () => {
  return (
    <Fragment>
      <Grid
        container
        sx={{
          border: "1px solid gray",
          borderRadius: "10px 10px 0px 0px",
          padding: "10px",
        }}
      >
        <Grid item md={3} sx={{ textAlign: "left" }}>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="circular" width={25} height={25} />
            <Skeleton variant="rectangular" width={150} height={25} />
          </Stack>
        </Grid>
        <Grid item md={6} sx={{ textAlign: "left" }}>
          <Skeleton variant="rectangular" width={150} height={25} />
        </Grid>
        <Grid item md={3}>
          <Skeleton variant="text" width={100} height={20} />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ border: "1px solid gray", borderRadius: " 0px 0px 10px 10px" }}
      >
        <Grid item md={10} sx={{ textAlign: "left", padding: "10px" }}>
          <Skeleton variant="rectangular" width={500} height={60} />
        </Grid>
        <Grid item md={2}></Grid>
      </Grid>
    </Fragment>
  );
};

const Review = () => {
  const vendor: any = useSelector((state: State) => state.vendor);
  const [vendorList, setVendorList] = useState<any>([]);
  const [vendorSelected, setvendorSelected] = useState<any>("");
  const [reviews, setReviews] = useState<any>([]);
  const [ratingSort, setRatingSort] = useState<number>(0);
  const [initialReview, setInitialReview] = useState<any>([]);
  const [error, setError] = useState<boolean>(false);
  const [loadingReview, setLoadingReview] = useState<boolean | null>(null);

  const getVendorInfo = () => {
    setVendorList(vendor.filter((v: any) => v.isActive === true));
  };

  const getUserReview = async () => {
    if (vendorSelected == "") return;
    setLoadingReview(true);
    await axios
      .get(`${REVIEW_URL}?limit=10&offset=0&targetId=${vendorSelected}`)
      .then((res) => {
        const { data } = res.data;
        setReviews(data);
        setInitialReview(data);
        setLoadingReview(false);
      })
      .catch((err) => {
        setLoadingReview(false);
        setError(true);
      });
  };

  useEffect(() => {
    getVendorInfo();
  }, []);

  useEffect(() => {
    getUserReview();
  }, [vendorSelected]);

  const handleVendorChange = (event: any) => {
    setvendorSelected(event.target.value);
    setRatingSort(0);
  };

  //#region sort
  const sortWorstReview = () => {
    const sortedReviews = [...reviews].sort((a: IReview, b: IReview) => {
      return a.rating - b.rating;
    });
    setReviews(sortedReviews);
  };

  const sortBestReview = () => {
    const sortedReviews = [...reviews].sort((a: IReview, b: IReview) => {
      return b.rating - a.rating;
    });
    setReviews(sortedReviews);
  };

  const handleRatingSort = (e: any) => {
    setRatingSort(e.target.value);

    const filterReviews = reviews.filter(
      (review: IReview) => review.rating == e.target.value
    );
    setReviews(filterReviews);
  };

  const resetReviews = () => {
    setReviews(initialReview);
    setRatingSort(0);
  };
  //#endregion

  return (
    <div>
      <div style={{ textAlign: "left", fontWeight: "bold", fontSize: "30px" }}>
        Reviews
      </div>
      <div id="body">
        <p>
          Vui lòng chọn Vendor:
          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel id="demo-simple-select-label">Vendor</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Vendor"
              onChange={(e: any) => handleVendorChange(e)}
            >
              {vendorList.map((vendor: any) => (
                <MenuItem value={vendor.id}>{vendor.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </p>
      </div>
      {loadingReview ? (
        <ReviewSkeleton />
      ) : !error ? (
        <div>
          <div className="filter">
            <Typography component="legend">Lọc Rating</Typography>
            <Stack direction="row" spacing={2}>
              <Stack direction="row" spacing={0.5}>
                <Button
                  variant="contained"
                  onClick={() => sortBestReview()}
                  sx={{ height: "25px", fontWeight: "bold" }}
                >
                  Tốt nhất
                </Button>
                <Button
                  variant="contained"
                  onClick={() => sortWorstReview()}
                  sx={{ height: "25px", fontWeight: "bold" }}
                >
                  Xấu nhất
                </Button>
              </Stack>
              <Stack direction="row" spacing={0.5}>
                <Rating
                  value={ratingSort}
                  precision={0.5}
                  onChange={(e) => handleRatingSort(e)}
                />
                <IconButton
                  sx={{ padding: "0px" }}
                  onClick={() => resetReviews()}
                >
                  <RotateLeftIcon sx={{ fontSize: "20px" }} />
                </IconButton>
              </Stack>
            </Stack>
          </div>

          <div>
            {reviews.map((review: IReview) => {
              return <UserReview review={review} />;
            })}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>Lỗi kết nối tới server</h3>
        </div>
      )}
    </div>
  );
};

export default Review;
