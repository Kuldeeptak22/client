/* eslint-disable camelcase */
// import { Helmet } from "react-helmet-async";
import { filter } from "lodash";
import { useState, useEffect } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  AvatarGroup,
  Modal,
  Fade,
  Box,
  Backdrop,
} from "@mui/material";
// components
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Instance, headerOptions } from "../../utils/Instance";
// import Iconify from "../components/iconify";
// import Scrollbar from "../components/scrollbar";
// sections
// import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "category", label: "Category", alignRight: false },
  { id: "subcategory", label: "Sub-Category", alignRight: false },
  { id: "brand", label: "Brand", alignRight: false },
  { id: "quantity", label: "Quantity", alignRight: false },
  { id: "price", label: "Price ₹", alignRight: false },
  { id: "images", label: "Images", alignRight: false },
  { id: "edit" },
  { id: "delete" },
];
// ------ Delete Modal ----
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const theme = createTheme({
  palette: {
    primary: {
      main: "#50C878", // Set your primary color
    },
    secondary: {
      main: "#FF0000", // Set your secondary color
    },
  },
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BrandPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [fetchedData, setFetchedData] = useState([]);

  const [productID, setProductID] = useState("");

  const [open, setOpen] = useState(false);
  //   const handleOpen = (id) => {
  //     setOpen(true);
  //     setProductID(id);
  //   };
  //   const handleClose = () => setOpen(false);

  //   const fetchData = async () => {
  //     try {
  //       const { data } = await axios.get(`${Instance}/products/get_products`);
  //       setFetchedData(data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fetchedData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  //   const handleClick = (event, name) => {
  //     const selectedIndex = selected.indexOf(name);
  //     let newSelected = [];
  //     if (selectedIndex === -1) {
  //       newSelected = newSelected.concat(selected, name);
  //     } else if (selectedIndex === 0) {
  //       newSelected = newSelected.concat(selected.slice(1));
  //     } else if (selectedIndex === selected.length - 1) {
  //       newSelected = newSelected.concat(selected.slice(0, -1));
  //     } else if (selectedIndex > 0) {
  //       newSelected = newSelected.concat(
  //         selected.slice(0, selectedIndex),
  //         selected.slice(selectedIndex + 1)
  //       );
  //     }
  //     setSelected(newSelected);
  //   };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fetchedData.length) : 0;

  const filteredUsers = applySortFilter(
    fetchedData,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  // New Product Create
  const addProduct = () => {
    navigate("/dashboard/product/addProduct");
  };
  const editProduct = (_id) => {
    navigate(`/dashboard/product/editProduct/${_id}`);
  };
  const deleteProduct = (product_id) => {
    axios
      .delete(`${Instance}/products/delete_product/${product_id}`)
      .then((res) => {
        handleClose();
        fetchData();
      });
  };

  return (
    <>
      <Helmet>
        <title> Brand | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Product
          </Typography>
          <Button
            variant="contained"
            // startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={addProduct}
          >
            New Product
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          {/* <Scrollbar> */}
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={fetchedData.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      _id,
                      name,
                      category,
                      subcategory,
                      brand,
                      quantity,
                      price,
                      images,
                      thumbnail,
                    } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedUser}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUser}
                            onChange={(event) => handleClick(event, name)}
                          />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar
                              alt={name}
                              src={`${Instance}/uploads/properties/${thumbnail}`}
                            />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{category.name}</TableCell>
                        <TableCell align="left">{subcategory.name}</TableCell>
                        <TableCell align="left">{brand.name}</TableCell>
                        <TableCell align="left">{quantity}</TableCell>
                        <TableCell align="left">{price}/-</TableCell>
                        <TableCell align="left">
                          <AvatarGroup max={4}>
                            {images &&
                              images.map((image) => (
                                <Avatar
                                  alt={image}
                                  src={`${Instance}/uploads/properties/${image}`}
                                  key={image}
                                />
                              ))}
                          </AvatarGroup>
                        </TableCell>
                        <TableCell align="right">
                          <ThemeProvider theme={theme}>
                            <Button
                              variant="contained"
                              sx={{ color: "white", fontWeight: "bold" }}
                              onClick={() => editProduct(_id)}
                            >
                              Edit
                            </Button>
                          </ThemeProvider>
                        </TableCell>
                        <TableCell align="left">
                          <ThemeProvider theme={theme}>
                            <Button
                              onClick={() => handleOpen(_id)}
                              color="secondary"
                              variant="contained"
                              sx={{ color: "white", fontWeight: "bold" }}
                            >
                              Delete
                            </Button>
                          </ThemeProvider>
                        </TableCell>
                        {/* ========= delete modal ======= */}
                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={open}
                          onClose={handleClose}
                          closeAfterTransition
                          slots={{ backdrop: Backdrop }}
                          slotProps={{
                            backdrop: {
                              timeout: 500,
                            },
                          }}
                        >
                          <Fade in={open}>
                            <Box sx={style}>
                              <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                Are You Sure ?
                              </Typography>
                              <Button
                                variant="contained"
                                sx={{ m: "20px 12px" }}
                                onClick={() => deleteProduct(productID)}
                              >
                                YES
                              </Button>
                              <Button variant="contained" onClick={handleClose}>
                                NO
                              </Button>
                            </Box>
                          </Fade>
                        </Modal>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {/* {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )} */}
            </Table>
          </TableContainer>
          {/* </Scrollbar> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={fetchedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
