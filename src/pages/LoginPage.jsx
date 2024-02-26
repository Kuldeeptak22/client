import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Login from "../components/Auth/Login";

const LoginPage = () => {
  return (
    <Container fluid>
      <Row className="py-4 bg-gray-200">
        <Col>
          <h1 className="font-semibold text-2xl py-4">Login Page</h1>
          <Login />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
