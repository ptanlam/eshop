import React, { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Button,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemIcon,
  Collapse,
  TextField,
  Switch,
  Stack,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Autocomplete,
  IconButton,
  Paper,
  TableContainer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Grid,
  FormHelperText,
  Backdrop,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { styled } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { CATEGORIES_URL, PRODUCTS_URL, DISCOUNT_URL } from "../../../url";
import { useSelector } from "react-redux";
import { State } from "../../../state/reducers";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const AddDiscountDialog = (props: any) => {
  const initialValues = {
    id: "1",
    discountName: "",
    description: "",
    priority: 0,
    allowedUses: 0,
    modifier: 0,
    discountRule: 0,
    startDate: "",
    endDate: "",
    isFlatAmount: false,
    isActive: false,
    product: [],
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const vendor: any = useSelector((state: State) => state.vendor);
  const [basic, setBasic] = useState(true);
  const [advance, setAdvance] = useState(false);
  const [discountList, setDiscountList] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [startDate, setStartDate] = useState(new Date("2020-01-01T21:11:54"));
  const [endDate, setEndDate] = useState(new Date("2020-01-01T21:11:54"));
  const [addedProducts, setAddedProducts] = useState<any>([]);
  const [productValues, setProductValues] =
    useState<IDiscountProducts | null>();
  const [categories, setCategories] = useState<any>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [products, setProducts] = useState<any>([]);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>();
  const [currency, setCurrency] = useState("");
  const [vendorSelected, setVendorSelected] = useState<any>();
  const [formLoading, setFormLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  interface IDiscountProducts {
    name: string;
    id: number;
  }

  const defaultProps = {
    options: products,
    getOptionLabel: (option: any) => option.name,
  };

  const handleProductChange = (event: any, value: IDiscountProducts | null) => {
    setProductValues(value);
  };

  const addToList = () => {
    if (productValues?.id == undefined) return;
    let duplicate = addedProducts.find(
      (p: IDiscountProducts) => p.id == productValues?.id
    );
    if (duplicate == undefined) {
      setAddedProducts((oldArray: any) => [...oldArray, productValues]);
    }
  };

  const handleRemoveItem = (id: any) => {
    setAddedProducts(
      addedProducts.filter((item: IDiscountProducts) => item.id !== id)
    );
  };

  const handleStartDate = (newDate: any) => {
    setStartDate(newDate);
    setValues((prevState) => ({
      ...prevState,
      startDate: newDate._d,
    }));
  };
  const handleEndDate = (newDate: any) => {
    setEndDate(newDate);
    setValues((prevState) => ({
      ...prevState,
      endDate: newDate._d,
    }));
  };

  const handleCurencyChange = (event: any) => {
    const { value } = event.target;
    setCurrency(value);
  };
  const handleVendorChange = (event: any) => {
    const { value } = event.target;
    setVendorSelected(value);
    setDisabled(false);
  };

  const getCategories = async () => {
    axios
      .get(`${CATEGORIES_URL}`)
      .then((response) => {
        const data = response.data;
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProducts();
  }, [categoryId, vendorSelected]);

  const getProducts = async () => {
    if (categoryId == "" || vendorSelected == "") return;
    setLoading(true);
    await axios
      .get(
        `${PRODUCTS_URL}?limit=10&offset=0&categoryId=${categoryId}&brandId=${vendorSelected}`
      )
      .then((response) => {
        const { data } = response.data;
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCategories();
    setDefaultValues();
  }, []);

  useEffect(() => {
    setValues((prevState) => ({ ...prevState, product: addedProducts }));
  }, [addedProducts]);

  const setDefaultValues = () => {
    setValue("discountRule", 1);
    setValue("isFlatAmount", false);
    setValue("modifier", 1);
  };

  const onSubmit = async (data: any) => {
    var today = new Date();
    if (startDate > endDate) {
      alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc");
      return;
    } else if (endDate < today) {
      alert("Ngày kết thúc không được bé hơn ngày hôm nay");
      return;
    } else if (image == undefined || image == null) {
      alert("Vui lòng chọn hình ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("vendorId", data.vendorId);
    formData.append("discountName", data.discountName);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("allowedUses", data.allowedUses);
    formData.append("modifier", data.modifier);
    formData.append("discountRule", data.discountRule);
    //convert date to date string
    formData.append("startDate", startDate.toString());
    formData.append("endDate", endDate.toString());
    formData.append("isFlatAmount", data.isFlatAmount);
    formData.append("unit", data.unit);

    formData.append("files", image);

    addedProducts.forEach((item: any, index: number) => {
      formData.append(`productId[${index}]`, item.id);
    });

    setFormLoading(true);
    await axios
      .post(`${DISCOUNT_URL}`, formData)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setFormLoading(false);
          alert("Tạo khuyến mãi thành công");
          window.location.reload();
        }
      })
      .catch((error) => {
        setFormLoading(false);
        alert("Lỗi kết nối tới server");
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
      {formLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={formLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Dialog
          open={props.open}
          onClose={() => props.closeDialog()}
          fullScreen={fullScreen}
          fullWidth={true}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ textAlign: "center" }}>DISCOUNT</DialogTitle>
            <DialogContent>
              <DialogContentText>
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
                    <List
                      sx={{
                        width: "100%",
                        bgcolor: "none",
                      }}
                    >
                      <ListItemButton onClick={() => setBasic(!basic)}>
                        <ListItemIcon>
                          <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cài đặt cơ bản" />
                        {basic ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={basic} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Vendor: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <FormControl
                              sx={{ width: 200 }}
                              error={errors.vendorId}
                            >
                              <InputLabel>Vendor</InputLabel>
                              <Select
                                {...register("vendorId", {
                                  required: "Vui lòng chọn vendor",
                                })}
                                label="Vendor"
                                value={vendorSelected}
                                onChange={handleVendorChange}
                              >
                                {vendor.map((v: any) => (
                                  <MenuItem key={v.id} value={v.id}>
                                    {v.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {errors.vendorId && errors.vendorId.message}
                              </FormHelperText>
                            </FormControl>
                          </ListItem>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Tên Discount: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <TextField
                              error={errors.discountName}
                              variant="standard"
                              fullWidth
                              size="small"
                              {...register("discountName", {
                                required: "Vui lòng nhập đầy đủ",
                              })}
                              helperText={
                                errors.discountName &&
                                errors.discountName.message
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Thứ tự ưu tiên: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <TextField
                              error={errors.priority}
                              variant="standard"
                              type="number"
                              fullWidth
                              size="small"
                              {...register("priority", {
                                required: "Vui lòng nhập đầy đủ",
                                min: {
                                  value: 1,
                                  message: "Vui lòng nhập số lớn hơn 0",
                                },
                              })}
                              helperText={
                                errors.priority && errors.priority.message
                              }
                            />
                          </ListItem>
                        </List>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemIcon></ListItemIcon>
                          <ListItemText
                            primary="Số lần sử dụng: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <TextField
                            error={errors.allowedUses}
                            variant="standard"
                            fullWidth
                            size="small"
                            type="number"
                            {...register("allowedUses", {
                              required: "Vui lòng nhập đầy đủ",
                              min: {
                                value: 1,
                                message: "Vui lòng nhập số lớn hơn 0",
                              },
                            })}
                            helperText={
                              errors.allowedUses && errors.allowedUses.message
                            }
                          />
                        </ListItem>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Ngày bắt đầu: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <MobileDatePicker
                              value={startDate}
                              onChange={handleStartDate}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Ngày kết thúc: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <MobileDatePicker
                              value={endDate}
                              onChange={handleEndDate}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </ListItem>
                        </LocalizationProvider>

                        <ListItem sx={{ pl: 4 }}>
                          <ListItemIcon></ListItemIcon>
                          <ListItemText
                            primary="Tiền tệ: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <FormControl sx={{ width: 100 }} error={errors.unit}>
                            <InputLabel>Unit</InputLabel>
                            <Select
                              {...register("unit", {
                                required: "Vui lòng chọn loại tiền",
                              })}
                              label="Unit"
                              value={currency}
                              onChange={handleCurencyChange}
                            >
                              <MenuItem value={"VND"}>VND</MenuItem>
                              <MenuItem value={"USD"}>USD</MenuItem>
                            </Select>
                            <FormHelperText>
                              {errors.unit && errors.unit.message}
                            </FormHelperText>
                          </FormControl>
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemIcon></ListItemIcon>
                          <ListItemText
                            primary="Chú thích: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <TextField
                            error={errors.description}
                            variant="standard"
                            fullWidth
                            size="small"
                            {...register("description", {
                              required: "Vui lòng nhập đầy đủ",
                            })}
                            helperText={
                              errors.description && errors.description.message
                            }
                          />
                        </ListItem>
                      </Collapse>
                      <ListItemButton
                        onClick={() => setDiscountList(!discountList)}
                      >
                        <ListItemIcon>
                          <ViewListIcon />
                        </ListItemIcon>
                        <ListItemText primary="Thêm products" />
                        {discountList ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={discountList} timeout="auto" unmountOnExit>
                        <div style={{ marginLeft: 70 }}>
                          <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Categories</InputLabel>
                            <Select label="Categories" disabled={disabled}>
                              {categories.map((category: any) => (
                                <MenuItem
                                  key={category.id}
                                  value={category.id}
                                  onClick={() => setCategoryId(category.id)}
                                >
                                  {category.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {loading ? (
                            <CircularProgress />
                          ) : (
                            <Stack direction="row" spacing={1}>
                              <Autocomplete
                                disabled={disabled}
                                sx={{ minWidth: 350 }}
                                {...defaultProps}
                                id="auto-select"
                                autoSelect
                                onChange={handleProductChange}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Chọn Products"
                                    variant="outlined"
                                  />
                                )}
                              />
                              <IconButton
                                onClick={() => addToList()}
                                disabled={disabled}
                              >
                                <AddBoxIcon sx={{ fontSize: 45 }} />
                              </IconButton>
                            </Stack>
                          )}

                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 100 }} size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>ID</TableCell>
                                  <TableCell align="center">Tên</TableCell>
                                  <TableCell align="center">Delete</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {addedProducts.map((row: IDiscountProducts) => {
                                  return (
                                    <TableRow>
                                      <TableCell>{row.id}</TableCell>
                                      <TableCell align="center">
                                        {row.name}
                                      </TableCell>
                                      <TableCell align="center">
                                        <IconButton
                                          onClick={() =>
                                            handleRemoveItem(row.id)
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      </Collapse>
                      <ListItemButton onClick={() => setAdvance(!advance)}>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cài đặt nâng cao" />
                        {advance ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={advance} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Discount Rule: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <TextField
                              error={errors.discountRule}
                              variant="standard"
                              fullWidth
                              type="number"
                              size="small"
                              {...register("discountRule", {
                                min: {
                                  value: 1,
                                  message: "Vui lòng nhập số lớn hơn 0",
                                },
                              })}
                              helperText={
                                errors.discountRule &&
                                errors.discountRule.message
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Modifier: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <TextField
                              error={errors.modifier}
                              variant="standard"
                              fullWidth
                              type="number"
                              size="small"
                              {...register("modifier", {
                                min: {
                                  value: 1,
                                  message: "Vui lòng nhập số lớn hơn 0",
                                },
                              })}
                              helperText={
                                errors.modifier && errors.modifier.message
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary="Flat Amount: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography>No</Typography>
                              <Controller
                                control={control}
                                render={() => <AntSwitch />}
                                name="isFlatAmount"
                              />
                              <Typography>Yes</Typography>
                            </Stack>
                          </ListItem>
                        </List>
                      </Collapse>
                    </List>
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button type="submit">CREATE</Button>
              {/* <Button onClick={() => props.closeDialog()}>CANCLE</Button> */}

              <Button onClick={() => console.log(values)}>CANCLE</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
};

export default AddDiscountDialog;
