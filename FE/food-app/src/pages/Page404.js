import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from "react-bootstrap";
const Page404 = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">404</h1>
                            <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
                            <p className="text-body-secondary float-start">
                                The page you are looking for was not found.
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="offset-4 col-6 ">
                        <Link to="/" className="btn btn_red px-4 py-2 rounded-0 ms-3">
                            HOME
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Page404
