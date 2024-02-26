import React from "react";
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
import { Instance } from "../../utils/Instance";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Must be a valid email address"
        )
        .required(" Email Required"),
      password: Yup.string().required("Password Required"),
      // .min(8, "Enter at least 8 or more characters")
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
      //   "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      // )
      // .max(15, "Not more than 15 characters")
    }),
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
      const response = Instance.post(`/login`, values);
      response
        .then((res) => {
          if (res?.status === 200) {
            localStorage.setItem("token", res.data?.user_data?.token);
            const notify = () => toast.success(res?.data?.message);
            notify();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message, {
            position: "top-center",
          });
          console.log(err);
        });
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <br />
          {formik.touched.email && formik.errors.email ? (
            <span className="text-red-600 text-right">
              {formik.errors.email}
            </span>
          ) : null}
        </Box>
        <Box>
          <FormControl sx={{ m: 1, width: "35ch" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
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
            {formik.touched.password && formik.errors.password ? (
              <span className="text-red-600 text-right">
                {formik.errors.password}
              </span>
            ) : null}
          </FormControl>
        </Box>
        <Button type="submit" variant="contained">
          Login
        </Button>
        <ToastContainer />
      </form>
    </>
  );
};

export default Login;
