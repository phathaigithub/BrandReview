import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Cards({ id, name, image, status, priority, phone, google, location, facebookk, slug, rating, type, renderRatingIcons }) {
    console.log("Props:", { id, name, image, status, priority, phone, google, location, facebookk, slug, type, rating });
    const imageSrc = require("../../assets/" + image); // assuming the `brand.image` has only the filename
    return (
        <Col sm={6} lg={4} xl={3} className="mb-4">
            <Link to={`/brand/${slug}`} className="overflow-hidden card">
                <div className="overflow-hidden">
                    <Card.Img variant="top" src={imageSrc} />
                </div>
                <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="menu_price">
                            <h5 className="mb-0">{rating.toFixed(1)} <i class="bi bi-star-fill"></i></h5>
                        </div>
                        {/* <div className="item_rating">{renderRatingIcons(rating)}</div> */}
                        <div className="wishlist">
                            <i class="bi bi-heart"></i>
                        </div>
                    </div>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="hidden-two-line">{location}</Card.Text>

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
