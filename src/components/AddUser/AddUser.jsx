import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { Instance, headerOptions } from "../../utils/Instance";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [profile, setProfile] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      userRoles: "",
      contact_no: "",
      address: "",
      purpose: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name Required")
        .min(3, "Enter at least 3 or more characters"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Must be a valid email address"
        )
        .required(" Email Required"),
      password: Yup.string()
        .required("Password Required")
        .min(8, "Enter at least 8 or more characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
          "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .max(15, "Not more than 15 characters"),
      userRoles: Yup.number().required("User Role Required"),
      contact_no: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number")
        .required("Mobile Number Required"),
      address: Yup.string().required("Address Required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("userRoles", values.userRoles);
      formData.append("contact_no", values.contact_no);
      formData.append("address", values.address);
      formData.append("profile_pic", profile);
      formData.append("purpose", "");
      // for (const value of formData.values()) {
      //   console.log(value);
      // }
      const response = Instance.post(`/add/user`, formData, {
        headers: headerOptions(true),
      });
      response
        .then((res) => {
          if (res?.status === 201) {
            const notify = () => toast.success(res?.data?.message);
            notify();
            console.log(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-center",
          });
          console.log(err.message);
        });
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    formik;
  return (
    <>
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
        {/* Email Field  */}
        <Box
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="Email"
            label="Email"
            name="email"
            type="email"
            variant="standard"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          <br />
          {touched.email && formik.errors.email ? (
            <span className="text-red-600 text-right">{errors.email}</span>
          ) : null}
        </Box>
        {/* Password Field  */}
        <Box>
          <FormControl sx={{ m: 1, width: "35ch" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="Password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {touched.password && errors.password ? (
              <span className="text-red-600 text-right">{errors.password}</span>
            ) : null}
          </FormControl>
        </Box>
        {/* User Role Field  */}
        <Box
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="userRoles"
            label="User Role"
            name="userRoles"
            type="number"
            variant="standard"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.userRoles}
          />
          <br />
          {touched.userRoles && errors.userRoles ? (
            <span className="text-red-600 text-right">{errors.userRoles}</span>
          ) : null}
        </Box>
        {/* Contact No. Field */}
        <Box
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="contact_no"
            label="Contact no."
            name="contact_no"
            type="number"
            variant="standard"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contact_no}
          />
          <br />
          {touched.contact_no && errors.contact_no ? (
            <span className="text-red-600 text-right">{errors.contact_no}</span>
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
        {/* Profile pic Field  */}
        <Box
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            style={{ width: "35ch", margin: "20px 6px" }}
            type="file"
            label="Profile Image"
            variant="outlined"
            name="profile_pic"
            // accept="image/png, image/jpeg"
            onChange={(e) => {
              setProfile(e.target.files[0]);
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Button type="submit" variant="contained">
          Add User
        </Button>
        <ToastContainer />
      </form>
    </>
  );
};

export default AddUser;
