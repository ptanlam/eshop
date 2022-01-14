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
  Grid,
  Select,
  MenuItem,
  ListSubheader,
  FormControl,
  InputLabel,
  TextareaAutosize,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveIcon from "@mui/icons-material/Remove";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { PRODUCTS_URL } from "../../../url";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { State } from "../../../state/reducers";
import { useForm, Controller } from "react-hook-form";

const ProductDialog = (props: any) => {
  const initialValues = {
    name: "",
    briefDescription: "",
    price: {
      unit: "",
      amount: 0,
    },
    stock: 0,
    detailDescription: "",
  };

  const [values, setValues] = useState<any>(initialValues);
  const { user } = useAuth0();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [basic, setBasic] = useState(true);
  const [currency, setCurrency] = useState("");
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [vendorSelected, setVendorSelected] = useState<any>();
  const [attribute, setAttribute] = useState<string[]>([""]);
  const [image, setImage] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const vendor: any = useSelector((state: State) => state.vendor);

  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("briefDescription", data.briefDescription);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    data.attributes.forEach((element: any, index: number) => {
      formData.append(`attributes[${index}][name]`, element.name);
      formData.append(`attributes[${index}][value]`, element.value);
    });

    formData.append("unit", data.unit);
    formData.append("brandId", data.brandId);
    formData.append("categoryId", data.categoryId);
    formData.append("detailDescription", data.detailDescription);

    image.forEach((element: any, index: number) => {
      formData.append(`files`, image[index]);
    });

    //send formdata to backend
    setLoading(true);

    await axios
      .post(`${PRODUCTS_URL}`, formData)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setLoading(false);
          props.closeDialog();
          alert("Thêm sản phẩm thành công");
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Lỗi kết nối tới server");
      });
  };

  const getVendors = () => {
    setVendorList(vendor);
  };

  const getProduct = async () => {
    setLoading(true);
    const { data } = await axios.get(`${PRODUCTS_URL}/${props.productId}`);
    setLoading(false);
    setValues(data);
    setAttribute(data.attributes);
    data.attributes.forEach((element: any, index: number) => {
      setValue(`attributes[${index}][name]`, element.name);
      setValue(`attributes[${index}][value]`, element.value);
    });
    // setImage(data.images.url);
  };

  useEffect(() => {
    if (props.productId != undefined) getProduct();
    getVendors();
  }, []);

  useEffect(() => {
    setValue("name", values.name);
    setValue("briefDescription", values.briefDescription);
    setValue("price", values.price.amount);
    setValue("stock", values.stock);
    setValue("detailDescription", values.detailDescription);
    register("categoryId", { value: props.categoryId });
  }, [values]);

  //#region Attribute

  const addAttribute = () => {
    setAttribute((prevState: any) => [...prevState, ""]);
  };

  const removeAttribute = (index: number) => {
    if (attribute.length == 1) {
      return;
    } else {
      unregister(`attributes[${index}].name`);
      unregister(`attributes[${index}].value`);
      setAttribute((prevState: any) => {
        const newState = [...prevState];
        newState.splice(index, 1);
        return newState;
      });
    }
  };

  // useEffect(() => {
  //   setValues((prevState: any) => ({ ...prevState, attribute }));
  // }, [attribute]);

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);
  //#endregion

  const handleCurencyChange = (event: any) => {
    const { value } = event.target;
    setCurrency(value);
  };

  //#region Image
  const onChangeImage = (e: any) => {
    const files = e.target.files;
    let notImage = false;
    Array.from(files).forEach((file: any) => {
      if (!file.type.includes("image")) notImage = true;
    });
    if (notImage) {
      alert("Please only select image file");
    } else {
      setImage((prevState: any) => prevState.concat(Array.from(files)));
    }
  };

  const removeImage = (index: number) => {
    setImage((prevState: any) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const Input = styled("input")({
    display: "none",
  });
  //#endregion

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.closeDialog()}
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth="md"
      >
        {loading ? (
          <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>Đang lấy dữ liệu từ server...</h1>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ textAlign: "center" }}>PRODUCT</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <div
                      style={{
                        display: "block",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Paper elevation={3} sx={{ mt: 3 }}>
                          <List
                            subheader={
                              <ListSubheader>Danh sách hình ảnh</ListSubheader>
                            }
                          >
                            {image &&
                              Array.from(image).map(
                                (item: any, index: number) => {
                                  return (
                                    <ListItem>
                                      <ListItemText
                                        primary={
                                          item.url ? item.url : item.name
                                        }
                                      />
                                      <IconButton>
                                        <RemoveIcon
                                          onClick={() => removeImage(index)}
                                        />
                                      </IconButton>
                                    </ListItem>
                                  );
                                }
                              )}
                          </List>
                        </Paper>
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
                            multiple
                            type="file"
                            onChange={onChangeImage}
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
                    </div>
                  </Grid>
                  <Grid item xs={12} md={7}>
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
                        <ListItemText primary="Thông tin Product" />
                        {basic ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={basic} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemText
                              primary="Tên Product: "
                              sx={{ width: "15vw", pr: 5 }}
                            />

                            <TextField
                              error={errors.name}
                              variant="standard"
                              fullWidth
                              size="small"
                              {...register("name", {
                                required: "Vui lòng điền đầy đủ",
                                maxLength: 80,
                              })}
                              helperText={errors.name && errors.name.message}
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemText
                              primary="Giá: "
                              sx={{ width: "15vw", pr: 5 }}
                            />
                            <TextField
                              error={errors.price}
                              variant="standard"
                              fullWidth
                              type="number"
                              size="small"
                              {...register("price", {
                                required: "Vui lòng điền đầy đủ",
                                pattern: {
                                  value: /^[0-9]*$/,
                                  message: "Vui lòng chỉ nhập số",
                                },
                                min: {
                                  value: 0,
                                  message: "Giá phải lớn hơn 0",
                                },
                              })}
                              helperText={errors.price && errors.price.message}
                            />
                          </ListItem>
                        </List>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Số lượng: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <TextField
                            error={errors.stock}
                            variant="standard"
                            fullWidth
                            type="number"
                            size="small"
                            {...register("stock", {
                              required: "Vui lòng điền đầy đủ",
                              pattern: {
                                value: /^[0-9]*$/,
                                message: "Vui lòng chỉ nhập số",
                              },
                              min: {
                                value: 0,
                                message: "Số lượng phải lớn hơn 0",
                              },
                            })}
                            helperText={errors.stock && errors.stock.message}
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Loại Hàng: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <TextField
                            variant="standard"
                            fullWidth
                            size="small"
                            disabled
                            value={props.categoryName}
                            // {...register("categoryId", {
                            //   required: true,
                            // })}
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Tiền tệ: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <FormControl fullWidth error={errors.unit}>
                            <InputLabel>Unit</InputLabel>
                            <Select
                              {...register("unit", {
                                required: "Vui lòng chọn loại tiền",
                              })}
                              name="unit"
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
                          <ListItemText
                            primary="Vendor: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <FormControl fullWidth error={errors.brandId}>
                            <InputLabel>Vendor</InputLabel>
                            <Select
                              {...register("brandId", {
                                required: "Vui lòng chọn vendor",
                              })}
                              name="brandId"
                              value={vendorSelected}
                              label="Vendor"
                            >
                              {vendorList.map((vendor: any) => (
                                <MenuItem value={vendor.id}>
                                  {vendor.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.brandId && errors.brandId.message}
                            </FormHelperText>
                          </FormControl>
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Chú thích: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                          <TextField
                            error={errors.briefDescription}
                            {...register("briefDescription", {
                              required: "Vui lòng nhập đầy đủ",
                              maxLength: 100,
                            })}
                            variant="standard"
                            fullWidth
                            size="small"
                            helperText={
                              errors.briefDescription &&
                              errors.briefDescription.message
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Chú thích đầy đủ: "
                            sx={{ width: "10vw", pr: 5 }}
                          />
                          <TextareaAutosize
                            style={{ width: 250, padding: "5px" }}
                            minRows={3}
                            {...register("detailDescription", {
                              required: true,
                            })}
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText
                            primary="Thuộc tính: "
                            sx={{ width: "15vw", pr: 5 }}
                          />
                        </ListItem>
                        <ListItem>
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ width: "85px" }}>
                                    Tên
                                  </TableCell>
                                  <TableCell>Giá trị</TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ width: "10px" }}
                                  >
                                    Xóa
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {attribute.map((value: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell sx={{ padding: 0, pl: "10px" }}>
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        {...register(
                                          `attributes[${index}].name`,
                                          {
                                            required: "Thiếu",
                                          }
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        {...register(
                                          `attributes[${index}].value`,
                                          {
                                            required: "Nhập đầy đủ",
                                          }
                                        )}
                                      />
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{
                                        padding: 0,
                                        pr: "1px",
                                      }}
                                    >
                                      <IconButton
                                        onClick={() => removeAttribute(index)}
                                      >
                                        <RemoveIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </ListItem>
                        <ListItem>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => addAttribute()}
                          >
                            Thêm
                          </Button>
                        </ListItem>
                      </Collapse>
                    </List>
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button type="submit">Tạo</Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </div>
  );
};

export default ProductDialog;
