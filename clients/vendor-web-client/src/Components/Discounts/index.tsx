import React, { Fragment, useEffect, useState } from "react";
import "./index.css";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  TableHead,
  TableFooter,
  TablePagination,
  Box,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SwitchProps } from "@mui/material/Switch";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import BuildIcon from "@mui/icons-material/Build";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IDiscount from "./interfaces";
import AddDiscountDialog from "../Dialog/AddDiscountDialog";
import axios from "axios";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";
import { DISCOUNT_URL, ORDER_URL } from "../../url";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: any, newPage: number) => void;
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

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
  const [moreInfo, setMoreInfo] = useState(false);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(row.isActive);
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const rowsPerPage = 3;

  const handleChangeStatus = () => {
    setActive(!active);
  };

  const createdAt = new Date(row.createdAt).toLocaleString();
  const updatedAt = new Date(row.updatedAt).toLocaleString();

  return (
    <Fragment>
      <TableRow>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.discountName}</TableCell>
        <TableCell>{row.priority}</TableCell>
        <TableCell>{row.allowedUses}</TableCell>
        <TableCell>{row.discountRule}</TableCell>
        {/* <TableCell>{row.product.length}</TableCell> */}
        <TableCell>
          {active ? (
            <>
              <CheckIcon sx={{ color: "green" }} />
            </>
          ) : (
            <>
              <ClearIcon sx={{ color: "red" }} />
            </>
          )}
        </TableCell>
        <TableCell>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={active}
                onClick={() => handleChangeStatus()}
              />
            }
            label=""
          />
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setMoreInfo(!moreInfo)}>
            {moreInfo ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={2}
          sx={{ maxWidth: "10vw" }}
          style={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <Collapse in={moreInfo} timeout="auto" unmountOnExit>
            <h4>Thông tin thêm:</h4>
            <p>Modifier: {row.modifier}</p>
            <p>Flat Amount: {row.isFlatAmount.toString().toUpperCase()}</p>
            <p>Ngày bắt đầu: {createdAt}</p>
            <p>Ngày kết thúc: {updatedAt}</p>
          </Collapse>
        </TableCell>
        {/* <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={moreInfo} timeout="auto" unmountOnExit>
            <h3>Sản Phẩm</h3>
            <Table size="small">
              <TableHead>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>
                  <BuildIcon />
                </TableCell>
              </TableHead>
              <TableBody>
                {row.product
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: any) => {
                    return (
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <IconButton>
                            <DeleteForeverIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TablePagination
                  rowsPerPageOptions={[rowsPerPage]}
                  //đổi mock data length
                  count={row.product.length}
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
              </TableFooter>
            </Table>
          </Collapse>
        </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={moreInfo} timeout="auto" unmountOnExit>
            <h4>Description:</h4>
            <p>{row.description}</p>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const Discounts = () => {
  const [page, setPage] = useState(0);
  const [addDialog, setAddDialog] = useState(false);
  const vendor: any = useSelector((state: State) => state.vendor);
  const [vendorList, setVendorList] = useState<any>([]);
  const [vendorSelected, setVendorSelected] = useState<string>("");
  const [discount, setDiscount] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const rowsPerPage = 5;
  const darkTheme = createTheme({ palette: { mode: "dark" } });

  //#region dialog
  const addNewDiscount = () => {
    setAddDialog(true);
  };

  const closeDialog = () => {
    setAddDialog(!addDialog);
  };
  //#endregion

  const getDiscountList = async () => {
    if (vendorSelected == "") return;
    setLoading(true);
    await axios
      .get(`${DISCOUNT_URL}/${vendorSelected}/vendors`)
      .then((res) => {
        const { data } = res;
        setDiscount(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
  };

  const getVendorList = () => {
    setVendorList(vendor.filter((v: any) => v.isActive === true));
    //setVendorList(vendor);
  };

  useEffect(() => {
    getVendorList();
  }, []);

  useEffect(() => {
    getDiscountList();
  }, [vendorSelected]);

  const handleVendorChange = (e: any) => {
    setVendorSelected(e.target.value);
  };

  return (
    <div id="header">
      <strong>Danh sách khuyến mãi</strong>
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
        vendorSelected != "" && (
          <ThemeProvider theme={darkTheme}>
            <AddDiscountDialog open={addDialog} closeDialog={closeDialog} />
            <TableContainer component={Paper} elevation={10}>
              <Table size="small">
                <TableHead>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên Discount</TableCell>
                  <TableCell>Ưu tiên</TableCell>
                  <TableCell>Số lần SD</TableCell>
                  <TableCell>Discount Rule</TableCell>
                  {/* <TableCell>Sản Phẩm</TableCell> */}
                  <TableCell colSpan={2}>Trạng Thái</TableCell>
                </TableHead>
                <TableBody>
                  {discount.length != 0 ? (
                    <Fragment>
                      {discount
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row: any) => (
                          <Row row={row} />
                        ))}
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[rowsPerPage]}
                          //đổi mock data length
                          count={discount.length}
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
                    </Fragment>
                  ) : (
                    <TableCell
                      colSpan={8}
                      sx={{ textAlign: "center", fontSize: "2vw" }}
                    >
                      Vui lòng tạo discount mới{" "}
                      <ArrowDownwardIcon id="arrowDown" />
                    </TableCell>
                  )}
                </TableBody>
                <TableFooter>
                  <TableCell
                    colSpan={8}
                    sx={{ textAlign: "center", padding: 0.5 }}
                  >
                    <div id="outerBorder">
                      <div id="innerBorder" onClick={() => addNewDiscount()}>
                        <ControlPointIcon
                          sx={{ fontSize: "1.5vw", pr: "5px" }}
                        />
                        Add new discount
                      </div>
                    </div>
                  </TableCell>
                </TableFooter>
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

export default Discounts;
