import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  TextareaAutosize,
  Button,
  Paper,
  createTheme,
  ThemeProvider,
  Stack,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import "./index.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";
import { VENDOR_URL } from "../../url";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { vendorAction } from "../../state/index";

const VendorList = (props: { vendors: any; selectedVendor: any }) => {
  const { vendors, selectedVendor } = props;

  const image = (url: string) => {
    if (url == undefined || url == "")
      return (
        <img
          src="https://via.placeholder.com/150"
          style={{ margin: "1px", width: "5vw", height: "5vw" }}
        />
      );
    return (
      <img src={url} style={{ margin: "1px", width: "5vw", height: "5vw" }} />
    );
  };

  return (
    <div onClick={() => selectedVendor(vendors)} className="vendorCard">
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 400,
          flexGrow: 1,
          mb: 2,
        }}
        elevation={3}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={2}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {image(vendors.logoUrl)}
          </Grid>
          <Grid item xs={10} md={8} container style={{ textAlign: "left" }}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {vendors.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {vendors.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {vendors.hotline}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                {vendors.isActive ? (
                  <CheckCircleIcon sx={{ color: "green" }} />
                ) : (
                  <OfflineBoltIcon sx={{ color: "red" }} />
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

const ShopInfo = () => {
  const initialValues = {
    id: "",
    name: "",
    email: "",
    hotline: "",
    ownerID: "",
    isActive: false,
    introduction: "",
    logoUrl: "",
  };
  const { user } = useAuth0();
  const vendor: any = useSelector((state: State) => state.vendor);
  const [values, setValues] = useState(initialValues);
  const [vendorList, setVendorList] = useState<typeof initialValues[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [image, setImage] = useState<any>();
  const [selectedTab, setSelectedTab] = useState("Create");
  const darkTheme = createTheme({ palette: { mode: "dark" } });
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { fetchVendor } = bindActionCreators(vendorAction, dispatch);

  const getVendorInfo = () => {
    setVendorList(vendor);
  };

  useEffect(() => {
    getVendorInfo();
  }, []);

  const vendorClick = (vendor: typeof initialValues) => {
    setValues(vendor);
    setEnabled(false);
    setSelectedTab("Update");
  };

  //submit form
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("ownerId", user?.sub!);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("hotline", data.hotline);
    formData.append("introduction", data.introduction);
    formData.append("logo", image);

    setIsLoading(true);
    try {
      await axios.post(`${VENDOR_URL}`, formData).then(() => {
        setIsLoading(false);
        alert("Tạo thành công");
        fetchVendor(user?.sub!);
      });
      window.location.reload();
    } catch {
      setIsLoading(false);
      alert("Lỗi kết nối server");
    }
    // const res = await axios.post(`${VENDOR_URL}`, formData);
    // if (res.status === 201 || res.status === 200) {
    //   setIsLoading(false);
    //   alert("Tạo thành công. Vui lòng tải lại trang");
    //   fetchVendor(user?.sub!);
    // } else {
    //   setIsLoading(false);
    //   alert(res.data.message);
    // }
  };

  //update vendor
  const updateVendor = () => {
    // axios.put(`${VENDOR_URL}/${values.id}`, values).then((res) => {
    //   getVendorInfo();
    //   setValues(initialValues);
    //   setEnabled(true);
    // });
  };

  //delete vendor
  const deleteVendor = () => {
    axios.delete(`${VENDOR_URL}/${values.id}`).then((res) => {
      getVendorInfo();
      setValues(initialValues);
      setEnabled(true);
    });
  };

  //#region upload image
  const handleImageUpload = (e: any) => {
    //check if file is an image
    if (e.target.files[0].type.split("/")[0] !== "image") {
      alert("File không hợp lệ");
      return;
    }
    const file = e.target.files[0];
    setImage(file);
  };
  const Input = styled("input")({
    display: "none",
  });
  //#endregion

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {vendorList.map((vendor: any) => (
            <VendorList vendors={vendor} selectedVendor={vendorClick} />
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container>
            <Grid item xs={6} md={6}>
              <div
                className="tab"
                style={
                  selectedTab == "Create"
                    ? { backgroundColor: "rgb(37, 37, 37)" }
                    : { backgroundColor: "gray", color: "rgb(197, 197, 197)" }
                }
                onClick={() => setSelectedTab("Create")}
              >
                Tạo
              </div>
            </Grid>
            <Grid item xs={6} md={6}>
              <div
                className="tab"
                style={
                  selectedTab == "Update"
                    ? { backgroundColor: "rgb(37, 37, 37)" }
                    : { backgroundColor: "gray", color: "rgb(197, 197, 197)" }
                }
                onClick={() => setSelectedTab("Update")}
              >
                Cập Nhật
              </div>
            </Grid>
          </Grid>
          {selectedTab == "Create" ? (
            <ThemeProvider theme={darkTheme}>
              <Paper
                sx={{
                  p: 2,
                  flexGrow: 1,
                  mb: 2,
                }}
                elevation={3}
                square
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {image ? (
                        <div className="imageBorder">
                          <img
                            src={URL.createObjectURL(image)}
                            className="image"
                            alt="image"
                          />
                        </div>
                      ) : null}

                      <div
                        style={{
                          margin: "auto",
                          width: "fit-content",
                          marginTop: "10px",
                        }}
                      >
                        <label htmlFor="contained-button-file">
                          <Input
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            onChange={handleImageUpload}
                          />
                          <Button
                            variant="contained"
                            component="span"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "15px",
                              width: "fit-content",
                              mr: "10px",
                              ml: "10px",
                            }}
                          >
                            Upload
                            <PhotoCamera sx={{ pl: 1 }} />
                          </Button>
                        </label>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={errors.name}
                        label="Tên cửa hàng"
                        fullWidth
                        focused
                        margin="dense"
                        variant="standard"
                        size="small"
                        {...register("name", {
                          required: "Vui lòng nhập đầy đủ",
                        })}
                        helperText={errors.name && errors.name.message}
                      />
                      <TextField
                        error={errors.email}
                        label="Email"
                        fullWidth
                        margin="dense"
                        focused
                        variant="standard"
                        size="small"
                        {...register("email", {
                          required: "Vui lòng nhập đầy đủ",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: "Email không hợp lệ",
                          },
                        })}
                        helperText={errors.email && errors.email.message}
                      />
                      <TextField
                        error={errors.hotline}
                        label="Hotline"
                        fullWidth
                        margin="dense"
                        focused
                        variant="standard"
                        size="small"
                        {...register("hotline", {
                          required: "Vui lòng nhập đầy đủ",
                          minLength: {
                            value: 10,
                            message: "Vui lòng nhập số điện thoại chính xác",
                          },
                        })}
                        helperText={errors.hotline && errors.hotline.message}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ textAlign: "left" }}
                      >
                        Tóm Tắt
                      </Typography>
                      <TextareaAutosize
                        minRows={3}
                        style={{ width: 350 }}
                        {...register("introduction", {
                          required: true,
                        })}
                      />
                    </Grid>
                  </Grid>
                  <div style={{ margin: "auto", marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ fontWeight: "bold" }}
                      color="success"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              </Paper>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={darkTheme}>
              <Paper
                sx={{
                  p: 2,
                  flexGrow: 1,
                  mb: 2,
                }}
                elevation={3}
                square
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <div className="imageBorder">
                      <img src={values.logoUrl} className="image" alt="image" />
                    </div>
                    <div
                      style={{
                        margin: "auto",
                        width: "fit-content",
                        marginTop: "10px",
                      }}
                    >
                      <label htmlFor="contained-button-file">
                        <Input
                          accept="image/*"
                          id="contained-button-file"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <Button
                          variant="contained"
                          component="span"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "15px",
                            width: "fit-content",
                            mr: "10px",
                            ml: "10px",
                          }}
                        >
                          Upload
                          <PhotoCamera sx={{ pl: 1 }} />
                        </Button>
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Tên cửa hàng"
                      fullWidth
                      focused
                      margin="dense"
                      variant="standard"
                      size="small"
                      value={values.name}
                    />
                    <TextField
                      label="Email"
                      fullWidth
                      margin="dense"
                      focused
                      variant="standard"
                      size="small"
                      value={values.email}
                    />
                    <TextField
                      label="Hotline"
                      fullWidth
                      margin="dense"
                      focused
                      variant="standard"
                      size="small"
                      value={values.hotline}
                    />
                    <Typography variant="subtitle1" sx={{ textAlign: "left" }}>
                      Tóm Tắt
                    </Typography>
                    <TextareaAutosize
                      minRows={3}
                      style={{ width: 350 }}
                      defaultValue={values.introduction}
                    />
                  </Grid>
                </Grid>
                <div style={{ margin: "auto", marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ fontWeight: "bold" }}
                    color="warning"
                  >
                    Update
                  </Button>
                </div>
              </Paper>
            </ThemeProvider>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ShopInfo;
