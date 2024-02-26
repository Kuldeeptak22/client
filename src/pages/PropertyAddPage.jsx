import React from "react";
import AddProperty from "../components/Property/AddProperty";
import { Col, Container, Row } from "react-bootstrap";
import EditProperty from "../components/Property/EditProperty";

const PropertyAddPage = () => {
  return (
    <Container fluid>
      <Row className="py-4 bg-gray-200">
        <Col>
          <AddProperty />
          <EditProperty />
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyAddPage;
