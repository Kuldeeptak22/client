import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { BaseURL, Instance } from "../../utils/Instance";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";

const EditProperty = () => {
  const { propertyId } = useParams();
  const inputFile = useRef(null);
  const [fetchedSingleData, setFetchedSingleData] = useState({});
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState([]);

  const fetchSingleData = async (id) => {
    try {
      const { data } = await Instance.get(`/properties/get_property/${id}`);
      setFetchedSingleData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (inputFile.current.children[1].children.thumbnail.value) {
      inputFile.current.children[1].children.thumbnail.value = "";
    }
  };
  const removeImages = () => {
    setImages([]);
    if (inputFile.current.children[1].children.images.value) {
      inputFile.current.children[1].children.images.value = "";
    }
  };

  useEffect(() => {
    fetchSingleData(propertyId);
  }, [propertyId]);

  useEffect(() => {
    formik.setValues({
      name: fetchedSingleData?.name || "",
      address: fetchedSingleData?.address || "",
      thumbnail: fetchedSingleData.thumbnail || "",
      images: fetchedSingleData.images || [],
    });
  }, [fetchedSingleData]);

  const formik = useFormik({
    initialValues: {
      name: fetchedSingleData?.name,
      address: fetchedSingleData?.address,
      thumbnail: fetchedSingleData.thumbnail ? fetchedSingleData.thumbnail : "",
      images: fetchedSingleData.images ? fetchedSingleData.images : "",
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

      const response = Instance.put(
        `/properties/update_property/${propertyId}`,
        formData
      );
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
      <h1 className="text-2xl font-bold my-3">Edit Property</h1>
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
              value={values?.name ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
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
              value={values?.address ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
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
              ref={inputFile}
              required
            />
          </Box>

          {/* Selected Thumbnail show  */}
          {thumbnail && (
            <>
              <p className="font-semibold">Selected Image</p>
              <div
                className="flex justify-content-center relative"
                style={{ maxWidth: "fit-content", margin: "12px auto" }}
              >
                <CloseIcon
                  onClick={removeThumbnail}
                  sx={{
                    position: "absolute",
                    right: "-5px",
                    top: "-5px",
                    border: "1px solid red",
                    borderRadius: "50%",
                    background: "gray",
                    cursor: "pointer",
                  }}
                />
                <img
                  src={URL.createObjectURL(thumbnail)} // Assuming the image is a URL, modify accordingly
                  alt={`Fetched Image `}
                  style={{
                    maxWidth: "70px",
                    margin: "5px",
                    border: "1px solid gray",
                    padding: "2px",
                  }}
                />
              </div>
            </>
          )}
          {/* Previous Thumbnail show  */}
          {fetchedSingleData.thumbnail && (
            <>
              <p className="mt-4 font-semibold text-gray-400">Previous Image</p>
              <div className="flex justify-content-center">
                <img
                  src={`${BaseURL}/uploads/properties/${fetchedSingleData.thumbnail}`} // Assuming the image is a URL, modify accordingly
                  alt={`Fetched Image `}
                  style={{
                    maxWidth: "70px",
                    margin: "5px",
                    border: "1px solid gray",
                    padding: "2px",
                    opacity: "0.7",
                  }}
                />
              </div>
            </>
          )}

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
                setImages([...e.target.files]);
              }}
              // value={images}
              onBlur={handleBlur}
              multiple
              InputLabelProps={{
                shrink: true,
              }}
              ref={inputFile}
              inputProps={{
                multiple: true,
              }}
              required
            />
          </Box>

          {/* Selected Images show  */}
          {images && images.length > 0 && (
            <div
              className="relative"
              style={{ maxWidth: "fit-content", margin: "12px auto" }}
            >
              <p className="font-semibold">Selected Images</p>
              <CloseIcon
                onClick={removeImages}
                sx={{
                  position: "absolute",
                  right: "-10px",
                  top: "25px",
                  border: "1px solid red",
                  borderRadius: "50%",
                  background: "gray",
                  cursor: "pointer",
                }}
              />
              <div
                className="flex justify-content-center"
                style={{
                  border: "1px solid green",
                  maxWidth: "fit-content",
                  margin: "12px auto",
                }}
              >
                <div style={{ display: "flex" }}>
                  {images &&
                    images?.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)} // Assuming the image is a URL, modify accordingly
                        alt={`Fetched Image ${index + 1}`}
                        style={{
                          maxWidth: "60px",
                          margin: "5px",
                          border: "1px solid gray",
                          padding: "2px",
                        }}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Images show  */}
          {fetchedSingleData.images && fetchedSingleData.images.length > 0 && (
            <>
              <p className="font-semibold mt-4 text-gray-400">
                Privious Images
              </p>
              <div className="flex justify-content-center">
                <div style={{ display: "flex" }}>
                  {fetchedSingleData.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${BaseURL}/uploads/properties/${image}`} // Assuming the image is a URL, modify accordingly
                      alt={`Fetched Image ${index + 1}`}
                      style={{
                        maxWidth: "50px",
                        margin: "5px",
                        border: "1px solid gray",
                        padding: "2px",
                        opacity: "0.7",
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          <Button type="submit" variant="contained" sx={{ margin: "5rem 2px" }}>
            Save Property
          </Button>
          <ToastContainer />
        </form>
      </Row>
    </Container>
  );
};

export default EditProperty;
