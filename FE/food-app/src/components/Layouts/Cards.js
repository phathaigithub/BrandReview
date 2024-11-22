import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Cards({ id, name, image, status, priority, phone, google, location, facebookk, slug, rating, type, reviews, renderRatingIcons }) {
    console.log("Props:", { id, name, image, status, priority, phone, google, location, facebookk, slug, type, rating, reviews });
    const imageSrc = image 
        ? "http://localhost:8080/uploads/" + image 
        : "http://localhost:8080/uploads/branddefault.jpg";
    const calc_avg_score = (reviews) => {
        if (!reviews || reviews.length === 0) {
          return 0; 
        }
        const totalScore = reviews.reduce((acc, review) => {
          const reviewAverage =
            (review.locationScore +
              review.priceScore +
              review.qualityScore +
              review.serviceScore +
              review.spaceScore) /
            5;
          return acc + reviewAverage;
        }, 0);
        const brandAverageScore = totalScore / reviews.length;
        return brandAverageScore; // Format to 2 decimal places
    };
    return (
        <Col sm={6} lg={4} xl={3} className="mb-4">
            <Link to={`/brand/${slug}`} className="overflow-hidden card">
                <div className="overflow-hidden">
                    <Card.Img variant="top" src={imageSrc} />
                </div>
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="menu_price">
                            <h5 className="mb-0">{calc_avg_score(reviews).toFixed(1)} <i class="bi bi-star-fill"></i></h5>
                        </div>
                        {/* <div className="item_rating">{renderRatingIcons(rating)}</div> */}
                        <div className="wishlist">
                            <i class="bi bi-heart"></i>
                        </div>
                    </div>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="hidden-two-line" style={{ minHeight: '48px' }}>{location}</Card.Text>

                    <div className="d-flex align-items-center justify-content-between">

                        <div className="add_to_card">
                            <Link to="/">
                                <i class="bi bi-bag me-2"></i>
                                Add To Cart
                            </Link>
                        </div>
                    </div>
                </Card.Body>
            </Link>
        </Col>
    );
}
export default Cards;
