import React, { useState } from 'react';
import { Form, Input, Button, Slider, Row, Col, Alert } from 'antd';
import axios from 'axios';
import ImageUpload from './ImageUpload'; // Assuming ImageUpload is your custom image upload component

const { TextArea } = Input;

const ReviewForm = ({ tokenData, brandID }) => {
    let userID = tokenData ? tokenData.id : null;
    const [formData, setFormData] = useState({
        userID: userID,
        brandID: brandID,
        content: '',
        quality: 10,
        price: 10,
        service: 10,
        location: 10,
        space: 10,
        images: [], // To store uploaded images
    });
    const [message, setMessage] = useState({ type: '', content: '' });
    console.log(formData);
    const onFinish = async () => {
        try {
            const form = new FormData();

            // Append form fields to FormData
            form.append("userID", formData.userID);
            form.append("brandID", formData.brandID);
            form.append("content", formData.content);
            form.append("quality", formData.quality);
            form.append("price", formData.price);
            form.append("service", formData.service);
            form.append("location", formData.location);
            form.append("space", formData.space);

            // Append images to FormData
            formData.images.forEach(image => {
                form.append("images", image); // Assuming image is a Blob or File object
            });

            const response = await fetch('http://localhost:8080/review/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // If using JWT
                },
                body: form,
                credentials: 'include', // To send cookies if needed
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.message || 'Đánh giá thất bại, vui lòng thử lại');
                setMessage({ type: 'error', content: errorData.message || 'Đánh giá thất bại, vui lòng thử lại' });
                return;
            }
            console.log('Review saved', response);
            setMessage({ type: 'success', content: 'Đánh giá thành công' });
        } catch (error) {
            console.error('Error saving review', error);
            setMessage({ type: 'error', content: 'Đánh giá thất bại, vui lòng thử lại' });
        }
    };

    const onImageUpload = (images) => {
        setFormData((prevData) => ({
            ...prevData,
            images,
        }));
    };

    return (
        <Form
            layout="vertical"
            name="review-form"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            autoComplete="off"
        >
            <Form.Item label="Nội dung đánh giá">
                <TextArea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Quality">
                        <Slider
                            value={formData.quality}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(value) => setFormData({ ...formData, quality: value })}
                        />
                    </Form.Item>
                    <Form.Item label="Price">
                        <Slider
                            value={formData.price}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(value) => setFormData({ ...formData, price: value })}
                        />
                    </Form.Item>
                    <Form.Item label="Service">
                        <Slider
                            value={formData.service}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(value) => setFormData({ ...formData, service: value })}
                        />
                    </Form.Item>
                    <Form.Item label="Location">
                        <Slider
                            value={formData.location}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(value) => setFormData({ ...formData, location: value })}
                        />
                    </Form.Item>
                    <Form.Item label="Space">
                        <Slider
                            value={formData.space}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(value) => setFormData({ ...formData, space: value })}
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Image Upload">
                        <ImageUpload onUpload={onImageUpload} />
                    </Form.Item>
                </Col>
            </Row>
            {message.content && (
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Alert
                        type={message.type}
                        message={message.content}
                        showIcon
                        closable
                        onClose={() => setMessage({ type: '', content: '' })}
                    />
                </Form.Item>
            )}
            <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                    Xác nhận
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ReviewForm;
