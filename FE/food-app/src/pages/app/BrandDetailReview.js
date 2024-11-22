// ReviewTab.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col } from "react-bootstrap";
import "../../styles/HomeStyle.css";
import "../../styles/Custom.css";
import React, { useEffect, useState } from 'react';
import { Image, Modal } from 'antd';
import { CFormRange } from '@coreui/react';
import { jwtDecode } from 'jwt-decode';

function BrandDetailReview({ review }) {
    console.log(review);
  
    const avatar = "http://localhost:8080/uploads/" + review.user.avatar;
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReport = async () => {
        // Get token and check user ID
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.id === review.user.id) {
                Modal.error({
                    content: 'Không thể tự báo cáo đánh giá của bạn!'
                });
                setIsModalOpen(false);
                return;
            }
        }

        try {
            const response = await fetch(`http://localhost:8080/review/report/${review.id}`, {
                method: 'PUT',
            });
            if (response.ok) {
                Modal.success({
                    content: 'Báo cáo đã được gửi thành công',
                });
            }
        } catch (error) {
            console.error('Error reporting review:', error);
            Modal.error({
                content: 'Có lỗi xảy ra khi gửi báo cáo',
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div class="bg-white review mb-3 d-flex flex-column" style={{ minHeight: '250px' }}>
            <div class="p-3 flex-grow-1">
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
                        <div className="ms-4 position-relative" style={{ top: '-10px' }}>
                            <i 
                                className="bi bi-flag-fill text-danger" 
                                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                onClick={() => setIsModalOpen(true)}
                            ></i>
                        </div>
                    </Col>
                </div>
                <div class="review_body">
                    <p>{review.content}</p>
                    <h6 class="border-top"></h6>
                    {images.length != 0 && (
                        <div>
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

            <Modal
                title="Xác nhận báo cáo"
                open={isModalOpen}
                onOk={handleReport}
                onCancel={() => setIsModalOpen(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ 
                    style: { backgroundColor: '#dc3545', borderColor: '#dc3545' } 
                }}
            >
                <p>Bạn có chắc chắn muốn báo cáo đánh giá này?</p>
            </Modal>
        </div>
    );
};
export default BrandDetailReview;
