import React from "react";
import { Col, Container, Row } from "react-bootstrap";
// import PropertyTable from "../components/Table/PropertyTable";
// import MyTable from '../components/Table/MyTable'
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NormalTable from "../components/Table/NormalTable";

const PropertyPage = () => {
  const navigagte = useNavigate();

  const goToAddProperty = () => {
    navigagte("/addProperty");
  };

  return (
    <Container fluid>
      <h1 className="my-3 font-bold text-3xl text-left">Property Page</h1>
      <Row className="py-4 bg-gray-200">
        <Col sm={12} className="text-right my-3">
          <Button variant="contained" onClick={goToAddProperty}>
            Add Property
          </Button>
        </Col>
        <Col>
          <NormalTable />
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyPage;
