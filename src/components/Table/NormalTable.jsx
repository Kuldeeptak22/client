import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { BaseURL, Instance } from "../../utils/Instance";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DummyImage from "../../assets/dummy.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ============= Delete Model ===================
const DeleteModal = ({
  deleteProperty,
  fullScreen,
  open,
  handleClose,
  itemId,
}) => {
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Delete This Property Entry."}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you Sure ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Disagree
        </Button>
        <Button
          onClick={() => {
            deleteProperty(itemId);
            handleClose();
          }}
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// =============== Normal Table ================
const NormalTable = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await Instance.get(`/properties/get_properties`);
      setFetchedData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const editProperty = (id) => {
    if (id) {
      setLoader(true);
      setTimeout(() => {
        navigate(`/editProperty/${id}`);
        setLoader(false);
      }, 1000);
    }
  };

  const deleteProperty = async (id) => {
    try {
      setOpen(true);
      const { data } = await Instance.delete(
        `/properties/delete_property/${id}`
      );
      const notify = () => toast.success(data?.message);
      notify();
      let filterData = fetchedData.filter((a) => a._id !== id);
      setFetchedData(filterData); // Update state after successful delete
    } catch (error) {
      console.log(error);
    }
  };

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        {loader && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
        {fetchedData.length !== 0 ? (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Address
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Thumbnail
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Images
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetchedData &&
                fetchedData.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="left">
                      {item.name}
                    </TableCell>
                    <TableCell align="left">{item.address}</TableCell>
                    <TableCell align="left">
                      <Avatar
                        alt="Travis Howard"
                        src={
                          item?.thumbnail
                            ? `${BaseURL}/uploads/properties/${item.thumbnail}`
                            : DummyImage
                        }
                      />
                    </TableCell>
                    <TableCell align="left">
                      <AvatarGroup
                        max={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {item.images &&
                          item.images.map((image) => (
                            <Avatar
                              alt={image}
                              src={
                                image
                                  ? `${BaseURL}/uploads/properties/${image}`
                                  : DummyImage
                              }
                              key={image}
                            />
                          ))}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => editProperty(item._id)}
                        variant="contained"
                        sx={{ marginRight: "3px" }}
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={handleClickOpen}
                        variant="contained"
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                    <DeleteModal
                      deleteProperty={deleteProperty}
                      itemId={item._id}
                      fullScreen={fullScreen}
                      open={open}
                      handleClose={handleClose}
                    />
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "4rem",
              backgroundColor: "rgba(0, 0, 0, 0.5)",

              // zIndex: 9999,
            }}
          >
            <p>No Data available!</p>
          </Box>
        )}
      </TableContainer>
      <ToastContainer />
    </>
  );
};

export default NormalTable;
