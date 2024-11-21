// ReviewTab.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col } from "react-bootstrap";
import "../../styles/HomeStyle.css";
import "../../styles/Custom.css";
import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { CFormRange } from '@coreui/react';

function BrandDetailReview({ review }) {
    console.log(review);
  
    const avatar = require("../../assets/avatar/" + review.user.avatar)
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };
    const ScoreToText = (input) => {
        if (input == null)
            return "0.0";
        if (input === 10)
            return input.toFixed(0);
        return input.toFixed(1);
    }
    const images = review.images.map(image => {
        // Assuming `image.path` is something like '/uploads/dc1f0ce6-0482-4331-a211-5d2e10cf3d60_1732191208419.jpg'
        return "http://localhost:8080/uploads/" + image.path;
    });
    return (
        <div class="bg-white review mb-3">
            <div class="p-3">
                <div className="review_header d-flex pb-2">
                    <img class="user_avatar" src={avatar}></img>
                    <div class="user_name">
                        <h7 class="fw-bold text-black ps-2">{review.user.name}</h7>
                        <h7 class="review_date ps-2">{formatDate(review.initDate)}</h7>
                    </div>
                    <Col className="d-flex align-items-center ms-4 justify-content-end">
                        <div className="brand_score_container mx-2  ">
                            <div className={`fw-bold review_score ${review.qualityScore <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(review.qualityScore)}</div>
                            <h7 class="score_tag">Quality</h7>
                        </div>
                        <div className="brand_score_container ms-4  ">
                            <div className={`fw-bold review_score ${review.priceScore <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(review.priceScore)}</div>
                            <h7 class="score_tag">Price</h7>
                        </div>
                        <div className="brand_score_container ms-4  ">
                            <div className={`fw-bold review_score ${review.serviceScore <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(review.serviceScore)}</div>
                            <h7 class="score_tag">Service</h7>
                        </div>
                        <div className="brand_score_container ms-4  ">
                            <div className={`fw-bold review_score ${review.locationScore <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(review.locationScore)}</div>
                            <h7 class="score_tag">Location</h7>
                        </div>
                        <div className="brand_score_container ms-4  ">
                            <div className={`fw-bold review_score ${review.spaceScore <= 5 ? "red" : "green"} mb-0`}>{ScoreToText(review.spaceScore)}</div>
                            <h7 class="score_tag">Space</h7>
                        </div>
                    </Col>
                </div>
                <div class="review_body">
                    <p>{review.content}</p>
                    {images.length != 0 && (
                        <div>
                            <h6 class=" border-top"></h6>
                            <div>
                                <Row className="">
                                    <Image.PreviewGroup
                                        preview={{
                                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                        }}
                                    >
                                        {images.map((src, index) => (
                                            <Image key={index} width={100} height={100} src={src} />
                                        ))}
                                    </Image.PreviewGroup>
                                </Row>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="grey_bar">

            </div>
        </div>
    );
};
export default BrandDetailReview;
