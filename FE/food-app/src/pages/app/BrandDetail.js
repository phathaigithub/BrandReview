import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import "../../styles/HomeStyle.css";
import "../../styles/Custom.css";
import Section7 from "./Section7";
import React, { useEffect, useState, useRef  } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BrandDetailReview from "./BrandDetailReview";
import { Modal, Button as AntButton, Image } from 'antd';
import ReviewForm from "./ReviewForm";
import { jwtDecode } from "jwt-decode";

const BrandDetail = () => {


    const { slug } = useParams(); // Get the slug from the URL
    const history = useHistory(); // Use useHistory to programmatically navigate
    const [brand, setBrand] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const reviewRef = useRef(null); 
    const googleMapRef = useRef(null); 
    const scrollToSection = (sectionRef) => { 
        sectionRef.current.scrollIntoView({ behavior: 'smooth' }); 
    };
    const isLoggedIn = () => {
        // Replace this with your actual authentication check
        const token = localStorage.getItem('authToken');
        return !!token; // Returns true if token exists, false otherwise
    };
    console.log(isLoggedIn());
    let tokenData = null;
    if (isLoggedIn()) {
        tokenData = jwtDecode(localStorage.getItem('authToken'));
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
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
    let brandID = brand.id;
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
            { overall: 0, location: 0, quality: 0, service: 0, space: 0, price: 0 }
        );
        const numOfReviews = reviews.length;
        const avgScores = {
            location: totalScores.location / numOfReviews,
            quality: totalScores.quality / numOfReviews,
            service: totalScores.service / numOfReviews,
            space: totalScores.space / numOfReviews,
            price: totalScores.price / numOfReviews,
        };
        avgScores.overall = (avgScores.location + avgScores.quality + avgScores.service + avgScores.space + avgScores.price) / 5;
        return avgScores;
    };
    const avgScores = calcAvgScores(brand.reviews);
    const ScoreToText = (input) => {
        if (input == null)
            return "0.0";
        if (input === 10)
            return input.toFixed(0);
        return input.toFixed(1);
    }
    const avatar = require("../../assets/avatar/default.png");
    const images = [
        avatar,
        avatar,
        avatar,
        avatar,
        avatar,
        imageSrc
    ];
    return (
        <Layout>
            <section className="brand_section">
                <Container>
                    <Row className="brand-header">
                        <Col className="col-4 offset-1 p-0">
                            <img class="img-fluid h-100" src={imageSrc}></img>
                        </Col>
                        <Col className="col-6 bg-white border border-start-0 p-0">
                            <Row>
                                <h4 className="brand_name">{brand.name}</h4>
                                <p className="brand_type">{brand.brandType.name}</p>
                            </Row>
                            <Row>
                                <Col className="d-flex align-items-center">
                                    <div className="brand_score_container m-2 ms-4 me-4 pb-3 ">
                                        <div className={` brand_avg_score mb-0`}>{ScoreToText(avgScores.overall)}</div>
                                    </div>
                                    <div className="brand_score_container me-2 ms-2 mb-3">
                                        <div className={`fw-bold brand_score ${avgScores.quality <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(avgScores.quality)}</div>
                                        <h7>Quality</h7>
                                    </div>
                                    <div className="brand_score_container me-2 ms-4 mb-3 ">
                                        <div className={`fw-bold brand_score ${avgScores.price <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(avgScores.price)}</div>
                                        <h7>Price</h7>
                                    </div>
                                    <div className="brand_score_container me-2 ms-4 mb-3 ">
                                        <div className={`fw-bold brand_score ${avgScores.service <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(avgScores.service)}</div>
                                        <h7>Service</h7>
                                    </div>
                                    <div className="brand_score_container me-2 ms-4 mb-3 ">
                                        <div className={`fw-bold brand_score ${avgScores.location <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(avgScores.location)}</div>
                                        <h7>Location</h7>
                                    </div>
                                    <div className="brand_score_container me-2 ms-4 mb-3 ">
                                        <div className={`fw-bold brand_score ${avgScores.space <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(avgScores.space)}</div>
                                        <h7>Space</h7>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <h7 class="ps-4"><i class="bi bi-telegram me-2"></i>{brand.location}</h7>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-3" style={{ minHeight: '800px' }}>
                        <Col className=" offset-1 col-2">
                            <Row className="bg-white border">
                                <ul className="nav flex-column bg-white border-top pe-0">
                                    <li className="nav-item">
                                        <a
                                            href="javascript:void(0);"
                                            className={`sidebar nav-link active`}
                                        >
                                            Đánh giá
                                            <i className={`bi bi-chevron-down`}></i>
                                        </a>
                                    </li>
                                    <li className="nav-item border-top ">
                                        <a className={`sidebar nav-link`}>
                                            Bản đồ
                                            <i className={`bi bi-chevron-right`}></i>
                                        </a>
                                    </li>
                                </ul>
                            </Row>
                            <Row className="mt-3 d-flex flex-column">
                                <AntButton type="primary" onClick={showModal}
                                    style={{
                                        backgroundColor: "#0958d9",
                                        color: "#fff",
                                        fontWeight: "500"
                                    }}>
                                    Đánh giá
                                </AntButton>
                                <Modal title="Đánh giá thương hiệu" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                                    footer={null}>
                                    <ReviewForm tokenData={tokenData} brandID={brandID}></ReviewForm>
                                </Modal>
                            </Row>
                        </Col>
                        <Col className="col-8">
                            <Row id="review">
                                <Col className="col-12">
                                    {brand.reviews.map((review, index) => (
                                        <BrandDetailReview review={review} />
                                    ))}
                                </Col>
                            </Row>
                            <Row id="google">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3919.042407802272!2d106.618481!3d10.808064!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b2f1b89cebb%3A0xd5b7573bfa9a3d32!2zQsOhbmggbcOsIE3hu5lj!5e0!3m2!1sen!2sus!4v1732200373177!5m2!1sen!2sus"
                                    style={{
                                        width: "100%",
                                        height: "600px",
                                        border: "0"
                                    }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </section>
        </Layout>
    );
};

export default BrandDetail;
