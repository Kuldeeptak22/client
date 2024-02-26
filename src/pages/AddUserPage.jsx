import React from "react";
import AddUser from "../components/AddUser/AddUser";
import { Col, Container, Row } from "react-bootstrap";

const AddUserPage = () => {
  return (
    <Container fluid>
      <Row className="py-4 bg-gray-200">
        <Col>
          <AddUser />
        </Col>
      </Row>
    </Container>
  );
};

export default AddUserPage;
