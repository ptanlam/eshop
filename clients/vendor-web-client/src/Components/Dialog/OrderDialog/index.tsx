import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { State } from "../../../state/reducers";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { dialogAction } from "../../../state/index";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const OrderDialog = () => {
  //Reducer ra type never phải thêm chữ any mới dùng dc. Wtf is this magic
  const dialog: any = useSelector((state: State) => state.dialog);
  const { dialogState, data } = dialog;
  const [values, setValues] = useState();
  const [open, setOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { closeDialog } = bindActionCreators(dialogAction, dispatch);
  useEffect(() => {
    setOpen(dialogState);
    setValues(data);
  }, [dialogState]);

  const handleClose = () => {
    closeDialog();
  };

  const handleCustomerOpen = () => {
    setCustomerOpen(!customerOpen);
  };
  const handleAddressOpen = () => {
    setAddressOpen(!addressOpen);
  };

  return (
    <div>
      {data != undefined ? (
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle>Cập Nhật Đơn Hàng</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "none",
                }}
              >
                <ListItemButton onClick={() => handleCustomerOpen()}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Khách Hàng" />
                  {customerOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={customerOpen} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Họ Tên KH: "
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.customer.fullName}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Email: "
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.customer.email}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="SDT: "
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.customer.phoneNumber}
                      />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItemButton onClick={() => handleAddressOpen()}>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Địa Chỉ" />
                  {addressOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={addressOpen} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Đường"
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.address.street}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Quận"
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.address.district}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Huyện"
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.address.ward}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Thành Phố"
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.address.city}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Quốc Gia"
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.address.country}
                      />
                    </ListItem>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        primary="Chi Tiết"
                        sx={{ width: "12vw", pr: 10 }}
                      />
                      <TextField
                        variant="standard"
                        fullWidth
                        defaultValue={data.address.details}
                      />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              UPDATE
            </Button>
            <Button onClick={handleClose} autoFocus>
              CANCLE
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </div>
  );
};

export default OrderDialog;
