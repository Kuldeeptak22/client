import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Instance } from "../../utils/Instance";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

const AddProperty = () => {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name Required")
        .min(3, "Enter at least 3 or more characters"),
      address: Yup.string().required("Address Required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("thumbnail", thumbnail);
      formData.append("images", images);
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      // for (const value of formData.values()) {
      //   console.log(value);
      // }

      const response = Instance.post(`properties/add_property`, formData);
      response
        .then((res) => {
          if (res?.status === 201) {
            const notify = () => toast.success(res?.data?.message);
            notify();
            setTimeout(() => {
              navigate("/propertylist");
            }, 2000);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-center",
          });
        });
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    formik;
  return (
    <Container fluid>
      <h1 className="text-2xl font-bold my-3">Add Property</h1>
      <Row className="my-5">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="name"
              label="Name"
              name="name"
              type="text"
              variant="standard"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <br />
            {touched.name && errors.name ? (
              <span className="text-red-600 text-right">{errors.name}</span>
            ) : null}
          </Box>
          {/* Address Field */}
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="address"
              label="Address"
              name="address"
              type="text"
              variant="standard"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
            />
            <br />
            {touched.address && errors.address ? (
              <span className="text-red-600 text-right">{errors.address}</span>
            ) : null}
          </Box>
          {/* Thumbnail Field  */}
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              style={{ width: "35ch", margin: "5px" }}
              type="file"
              label="Thumbnail"
              variant="outlined"
              name="thumbnail"
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setThumbnail(e.target.files[0]);
              }}
              required
            />
          </Box>

          {/* Images Field  */}
          <Box
            sx={{
              "& > :not(style)": { m: 1, width: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              style={{ width: "35ch", margin: "5px" }}
              type="file"
              label="Images"
              variant="outlined"
              name="images"
              onChange={(e) => {
                setImages(e.target.files);
              }}
              onBlur={handleBlur}
              multiple
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                multiple: true,
              }}
              required
            />
          </Box>

          <Button type="submit" variant="contained">
            Add Property
          </Button>
          <ToastContainer />
        </form>
      </Row>
    </Container>
  );
};

export default AddProperty;
