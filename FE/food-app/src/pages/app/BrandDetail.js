import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import Layout from "../../components/Layouts/Layout";
import "../../styles/HomeStyle.css";
import "../../styles/Custom.css";
import Section7 from "./Section7";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BrandDetailReview from "./BrandDetailReview";
import { Modal, Button as AntButton, Image, message } from 'antd';
import ReviewForm from "./ReviewForm";
import { jwtDecode } from "jwt-decode";
import { FaFacebook } from "react-icons/fa";

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
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const showModal = () => {
        if (!isLoggedIn()) {
            setShowLoginPrompt(true);
            return;
        }
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        refreshBrandData(); // Refresh the brand data
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        refreshBrandData(); // Refresh the brand data
    };
    const handleLoginClick = () => {
        setShowLoginPrompt(false);
        history.push('/register');
    };
    const handleLoginPromptCancel = () => {
        setShowLoginPrompt(false);
    };
    useEffect(() => {
        // Fetch brand data based on the slug
        fetch(`http://localhost:8080/brand/slug/${slug}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Brand not found');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.result || Object.keys(data.result).length === 0) {
                    // Redirect to 404 if no data or empty result
                    history.replace('/404');
                    return;
                }
                setBrand(data.result);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching brand data:", error);
                history.replace('/404'); // Redirect to 404 on any error
                setIsLoading(false);
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
    const imageSrc = brand ? 
        brand.image ? 
            "http://localhost:8080/uploads/" + brand.image 
            : "http://localhost:8080/uploads/branddefault.jpg"
        : null;
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
    const formatGoogleMapUrl = (url) => {
        if (!url) return '';
        
        // Check if it's already an embed URL
        if (url.includes('embed')) {
            return url;
        }

        // Convert regular Google Maps URL to embed URL
        try {
            // Extract coordinates and location name
            if (url.includes('@')) {
                const coords = url.split('@')[1].split(',');
                const lat = coords[0];
                const lng = coords[1];
                // Create a more precise embed URL with zoom level 15
                return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2s!4v1`;
            } 
            // For search URLs, create a place-based embed
            else if (url.includes('maps/search')) {
                const searchQuery = url.split('maps/search/')[1].split('/@')[0];
                const coords = url.split('@')[1].split(',');
                const lat = coords[0];
                const lng = coords[1];
                return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${searchQuery}&center=${lat},${lng}&zoom=15`;
            }
            // For direct place URLs
            else if (url.includes('maps/place')) {
                return url.replace('maps/place', 'maps/embed/place');
            }
            // For other map URLs
            else if (url.includes('maps/')) {
                return url.replace('maps/', 'maps/embed/');
            }
        } catch (error) {
            console.error('Error formatting Google Maps URL:', error);
            return '';
        }
        
        return url;
    };
    const refreshBrandData = () => {
        fetch(`http://localhost:8080/brand/slug/${slug}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Brand not found');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.result || Object.keys(data.result).length === 0) {
                    history.replace('/404');
                    return;
                }
                setBrand(data.result);
            })
            .catch(error => {
                console.error("Error fetching brand data:", error);
            });
    };
    
    // Add this function to handle report click
    const handleReportClick = () => {
        if (!isLoggedIn()) {
            setShowLoginPrompt(true);
            return false;
        }
        return true;
    };

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
                                <h4 className="brand_name">
                                    {brand.name}
                                    {brand.facebook && (
                                        <a
                                            href={brand.facebook.startsWith('https://') 
                                                ? brand.facebook 
                                                : `https://${brand.facebook.startsWith('www.') ? '' : 'www.'}${brand.facebook}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ms-2"
                                            style={{
                                                color: '#1877F2',
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                                verticalAlign: 'middle',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <FaFacebook size={24} />
                                        </a>
                                    )}
                                </h4>
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
                        <Col className="offset-1 col-2">
                            <div class="" style={{ position: 'sticky', top: '20px' }}>
                                <Row className="bg-white border">
                                    <ul className="nav flex-column bg-white border-top pe-0">
                                        <li className="nav-item">
                                            <a
                                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: "5px" }}
                                                href="javascript:void(0);"
                                                className={`sidebar nav-link`}
                                                onClick={() => scrollToSection(reviewRef)}
                                            >
                                                Đánh giá
                                                <i className={`bi bi-chevron-right`}></i>
                                            </a>
                                        </li>
                                        <li className="nav-item border-top ">
                                            <a className="sidebar nav-link" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: "5px" }}
                                                onClick={() => scrollToSection(googleMapRef)}
                                            >
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
                                        <ReviewForm tokenData={tokenData} brandID={brandID} onSubmitSuccess={handleOk}></ReviewForm>
                                    </Modal>
                                </Row>
                            </div>
                        </Col>
                        <Col className="col-8">
                            <Row id="review" ref={reviewRef}>
                                <Col className="col-12">
                                    {brand.reviews && brand.reviews.length > 0 ? (
                                        brand.reviews.map((review, index) => (
                                            <BrandDetailReview 
                                                review={review} 
                                                onReportClick={handleReportClick}  // Pass the handler to child component
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center p-4 border-bottom">
                                            <p className="mb-0">No reviews available yet</p>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row id="google" ref={googleMapRef} className="mt-4">
                                {brand.google && brand.google !== "google.com" ? (
                                    <iframe
                                        src={formatGoogleMapUrl(brand.google)}
                                        style={{
                                            width: "100%",
                                            height: "600px",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "4px"
                                        }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                ) : (
                                    <div className="text-center p-4" style={{ borderRadius: '4px' }}>
                                        <p className="mb-0">No map location available</p>
                                    </div>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Modal
                title="Thông báo"
                open={showLoginPrompt}
                onCancel={handleLoginPromptCancel}
                footer={[
                    <Button 
                        key="cancel" 
                        onClick={handleLoginPromptCancel}
                        style={{ 
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #f0f0f0',
                            color: '#666666',
                            marginRight: '8px'
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button 
                        key="login" 
                        type="primary" 
                        onClick={handleLoginClick}
                    >
                        Đăng nhập
                    </Button>,
                ]}
            >
                <p>Bạn cần đăng nhập để thực hiện đánh giá</p>
            </Modal>
        </Layout>
    );
};

export default BrandDetail;
