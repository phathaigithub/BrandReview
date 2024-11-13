import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import "../../styles/HomeStyle.css";
import "../../styles/Custom.css";
import Section7 from "./Section7";
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';


const BrandDetail = () => {
    const { slug } = useParams(); // Get the slug from the URL
    const history = useHistory(); // Use useHistory to programmatically navigate
    const [brand, setBrand] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    useEffect(() => {
        // Fetch brand data based on the slug
        fetch(`http://localhost:8080/brand/slug/${slug}`)
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length === 0) {
                    // If data is empty, redirect to 404
                    history.replace('/404');
                } else {
                    setBrand(data.result);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching brand data:", error);
                history.replace('/404'); // Redirect to 404 on fetch error
            });
    }, [slug, history]);
    if (isLoading) {
        return (
            <Layout>
                <section className="brand_section">
                    <Container className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </Container>
                </section>
            </Layout>
        );
    }
    console.log(brand);
    const imageSrc = brand ? require("../../assets/" + brand.image) : null // assuming the `brand.image` has only the filename
    const calcAvgScores = (reviews) => {
        if (!reviews.length) return { location: 0, quality: 0, service: 0, space: 0, price: 0 };

        // Sum up each individual score
        const totalScores = reviews.reduce(
            (acc, review) => {
                acc.location += review.locationScore;
                acc.quality += review.qualityScore;
                acc.service += review.serviceScore;
                acc.space += review.spaceScore;
                acc.price += review.priceScore;
                return acc;
            },
            { location: 0, quality: 0, service: 0, space: 0, price: 0 }
        );
        const numOfReviews = reviews.length;
        return {
            location: totalScores.location / numOfReviews,
            quality: totalScores.quality / numOfReviews,
            service: totalScores.service / numOfReviews,
            space: totalScores.space / numOfReviews,
            price: totalScores.price / numOfReviews
        };
    };
    const avgScores = calcAvgScores(brand.reviews);
    return (
        <Layout>
            <section className="brand_section">
                <Container>
                    <Row className="brand-header">
                        <Col lg={{ offset: 1, span: 4 }} className="p-0">
                            <img class="img-fluid h-100" src={imageSrc}></img>
                        </Col>
                        <Col lg={{ span: 6 }} className="bg-white border border-start-0 p-0">
                            <Row>
                                <h4 className="brand_name">{brand.name}</h4>
                                <p className="brand_type">{brand.brandType.name}</p>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="brand_score m-2 ms-4">
                                        <div className={`fw-bold ${avgScores.quality <= 5 ? "red" : "green" } mb-0`}>{avgScores.quality}</div>
                                    </div>
                                    <div className="brand_score m-2 ">
                                        <div className={`fw-bold ${avgScores.price <= 5 ? "red" : "green" } mb-0`}>{avgScores.price}</div>
                                    </div>
                                    <div className="brand_score m-2 ">
                                        <div className={`fw-bold ${avgScores.service <= 5 ? "red" : "green" } mb-0`}>{avgScores.quality}</div>
                                    </div>
                                    <div className="brand_score m-2 ">
                                        <div className={`fw-bold ${avgScores.location <= 5 ? "red" : "green" } mb-0`}>{avgScores.quality}</div>
                                    </div>
                                    <div className="brand_score m-2 ">
                                        <div className={`fw-bold ${avgScores.space <= 5 ? "red" : "green" } mb-0`}>{avgScores.space}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ minHeight: '800px' }}>
                        <Col lg={{ span: 2 }}>

                        </Col>
                        <Col lg={{ span: 10 }}>

                        </Col>
                    </Row>
                </Container>
            </section>
        </Layout>
    );
};

export default BrandDetail;
