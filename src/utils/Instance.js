import axios from "axios";
export const Instance = axios.create({
  // baseURL: "https://crm.neelnetworks.org/api",
  baseURL: "http://localhost:6700",
});

const getToken = () => {
  const token = localStorage.getItem("token");
  const Bearer = "Bearer " + token;
  const newBearer = Bearer.replace(/['"]+/g, "");
  return newBearer;
};

export const headerOptions = (isFormData) => ({
  "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  Accept: "application/json",
  Authorization: getToken(),
});

export const BaseURL = "http://localhost:6700";
