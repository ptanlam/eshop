import React, { useState, Fragment, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Button,
  TablePagination,
  Menu,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import { red } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import CSS from "csstype";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import OrderDialog from "../Dialog/OrderDialog";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useTheme } from "@mui/material/styles";
import IOrders, { OrderState } from "./interfaces";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { dialogAction } from "../../state/index";
import axios from "axios";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";
import { ORDER_URL } from "../../url";

const deleteButtonStyle: CSS.Properties = {
  fontSize: "1.5vmin",
  color: "white",
  fontWeight: "bold",
  marginBottom: "1vw",
};
const updateButtonStyle = { ...deleteButtonStyle, marginRight: "1vw" };
//#region Table | table thôi mà dài chết đi dc

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: any, newPage: number) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const theme = useTheme();

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </Box>
  );
};

const Row = (props: { row: any }) => {
  const { row } = props;
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState(row.status);
  const [loading, setLoading] = useState(false);

  const rowsPerPage = 3;
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const dispatch = useDispatch();
  const { openDialog } = bindActionCreators(dialogAction, dispatch);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setOrderStatus = async (status: string) => {
    setLoading(true);
    const { id } = row;
    const response = await axios.patch(`${ORDER_URL}/${id}`, {
      status: status,
    });
    if (response.status === 200 || response.status === 201) {
      setLoading(false);
      setStatus(status);
    } else {
      setLoading(false);
    }
  };

  const changeButtonColor = (status: string) => {
    switch (status) {
      case OrderState.CREATED:
        return "primary";
      case OrderState.APPROVED:
        return "secondary";
      case OrderState.COMPLETE:
        return "success";
      default:
        break;
    }
  };

  const handleMenuItemClick = (e: any) => {
    switch (e.target.textContent) {
      case OrderState.APPROVED:
        setStatus(OrderState.APPROVED);
        setOrderStatus(OrderState.APPROVED);
        setAnchorEl(null);
        break;
      case OrderState.COMPLETE:
        setStatus(OrderState.COMPLETE);
        setOrderStatus(OrderState.COMPLETE);
        setAnchorEl(null);
        break;
      default:
        setStatus(OrderState.CREATED);
        break;
    }
  };

  const dropdownMenu = (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      {status == "Approved" ? (
        <MenuItem onClick={(e) => handleMenuItemClick(e)}>Complete</MenuItem>
      ) : (
        status != "Complete" && (
          <Fragment>
            <MenuItem onClick={(e) => handleMenuItemClick(e)}>
              Approved
            </MenuItem>
            <MenuItem onClick={(e) => handleMenuItemClick(e)}>
              Complete
            </MenuItem>
          </Fragment>
        )
      )}
    </Menu>
  );

  const date = new Date(row.createdAt);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <TableRow
        // onDoubleClick={() => openDialog(row)}
        style={{ cursor: "pointer" }}
      >
        <TableCell>
          {row.receipt.type.toUpperCase()}
          <IconButton size="small" onClick={() => setReceiptOpen(!receiptOpen)}>
            {receiptOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.items.length}
          <IconButton size="small" onClick={() => setItemOpen(!itemOpen)}>
            {itemOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* <TableCell>{row.createdAt.toDateString()}</TableCell> */}
        {/* //normalize date */}
        <TableCell>{date.toLocaleDateString()}</TableCell>
        <TableCell>
          {row.totalPrice}/{row.priceUnit}
        </TableCell>
        <TableCell>
          {/* {row.address.district} */}
          Q.10
          <IconButton size="small" onClick={() => setAddressOpen(!addressOpen)}>
            {addressOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Button
            color={changeButtonColor(status)}
            variant="contained"
            onClick={(e) => handleClick(e)}
          >
            {status} <ExpandMore />
          </Button>
          {dropdownMenu}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingRight: 0 }}>
          <Collapse in={receiptOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div>
                <h2>Thông tin hóa đơn: </h2>
                <p>Loại: {row.receipt.type}</p>
                <p>Tổng tiền: {row.receipt.amount}</p>
                <p>Tiền Tệ: {row.receipt.currency}</p>
                <p>
                  Đã thanh toán:{" "}
                  {row.receipt.paid ? (
                    <CircleIcon sx={{ color: "green", fontSize: "12px" }} />
                  ) : (
                    <CircleIcon sx={{ color: "red", fontSize: "12px" }} />
                  )}
                </p>
              </div>
            </Box>
          </Collapse>
        </TableCell>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={itemOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <h3>Danh sách sản phẩm</h3>
              <Table size="small">
                <TableHead>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Tổng Tiền</TableCell>
                  <TableCell>Thương Hiệu</TableCell>
                  <TableCell>Xóa</TableCell>
                </TableHead>
                <TableBody>
                  {row.items
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any) => {
                      return (
                        <TableRow>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.price}/{item.priceUnit}
                          </TableCell>
                          <TableCell>
                            {item.totalPrice}/{item.priceUnit}
                          </TableCell>
                          <TableCell>{row.vendor.name}</TableCell>
                          <TableCell>
                            <IconButton>
                              <DeleteForeverIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[rowsPerPage]}
                    count={row.items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={addressOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div>
                {/* <strong>Địa chỉ giao hàng</strong> : {row.address.street},{" "}
                {row.address.ward}, {row.address.district},{" "}
                {row.address.country} */}
                <p>Note: {row.notes}</p>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

//#endregion

const Orders = () => {
  const vendor: any = useSelector((state: State) => state.vendor);
  const [vendorList, setVendorList] = useState<any>([]);
  const [vendorSelected, setvendorSelected] = useState<string>("");
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getVendorList = () => {
    // setVendorList(vendor.filter((v: any) => v.isActive === true));
    setVendorList(vendor);
  };

  const getOrderList = async () => {
    if (vendorSelected == "") return;
    setLoading(true);

    await axios
      .get(`${ORDER_URL}?vendorId=${vendorSelected}&limit=10&offset=0`)
      .then((res) => {
        const { data } = res.data;
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    getVendorList();
  }, []);

  useEffect(() => {
    getOrderList();
  }, [vendorSelected]);

  const handleVendorChange = (e: any) => {
    setvendorSelected(e.target.value);
  };

  const darkTheme = createTheme({ palette: { mode: "dark" } });
  return (
    <div id="header">
      <strong>Danh sách đơn hàng:</strong>
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
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : !error ? (
        orders.length != 0 && (
          <ThemeProvider theme={darkTheme}>
            <OrderDialog />
            <TableContainer component={Paper} elevation={10}>
              <Table size="small">
                <TableHead>
                  <TableCell>Hóa đơn</TableCell>
                  <TableCell>Số Lượng Hàng</TableCell>
                  <TableCell>Ngày Đặt</TableCell>
                  <TableCell>Tổng Tiền</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                </TableHead>
                <TableBody>
                  {orders.map((row: any) => (
                    <Row row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ThemeProvider>
        )
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>Lỗi kết nối tới server</h3>
        </div>
      )}
    </div>
  );
};

export default Orders;
