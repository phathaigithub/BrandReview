import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Cards({ id, name, image, status, priority, phone, google, location, facebookk, url_slug, rating, renderRatingIcons }) {
    console.log("Props:", { id, name, image, status, priority, phone, google, location, facebookk, url_slug, rating });
    const imageSrc = require("../../assets/" + image); // assuming the `brand.image` has only the filename
    return (
    <Col sm={6} lg={4} xl={3} className="mb-4">
      <Card className="overflow-hidden">
        <div className="overflow-hidden">
          <Card.Img variant="top" src= {imageSrc} />
        </div>
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div className="item_rating">{renderRatingIcons(rating)}</div>
            <div className="wishlist">
              <i class="bi bi-heart"></i>
            </div>
          </div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{location}</Card.Text>

          <div className="d-flex align-items-center justify-content-between">
            <div className="menu_price">
              <h5 className="mb-0">${rating}</h5>
            </div>
            <div className="add_to_card">
              <Link to="/">
                <i class="bi bi-bag me-2"></i>
                Add To Cart
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Cards;
