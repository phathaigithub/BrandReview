import React, { useState } from "react";
import { Container, Nav, Navbar, Modal, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";
import "../../styles/HeaderStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { jwtDecode } from "jwt-decode";
import HeaderDropDown from "./HeaderDropdown";
// import UserHeaderDropdown from "./UserHeaderDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
const Header = () => {
    const [nav, setNav] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [supportForm, setSupportForm] = useState({
        name: '',
        phone: '',
        content: ''
    });
    const [phoneError, setPhoneError] = useState('');

    // Xử lý đóng/mở modal
    const handleClose = () => setShowSupport(false);
    const handleShow = () => setShowSupport(true);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // Kiểm tra nếu input không phải số
            if (!/^\d*$/.test(value)) {
                setPhoneError('Vui lòng chỉ nhập số');
                return;
            }
            setPhoneError('');
        }
        
        setSupportForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8080/contact/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: supportForm.name,
                    phone: supportForm.phone,
                    content: supportForm.content,
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Hiển thị thông báo thành công
                toast.success('Gửi yêu cầu hỗ trợ thành công!');
                // Đóng modal
                handleClose();
                // Reset form
                setSupportForm({ name: '', phone: '', content: '' });
            } else {
                // Hiển thị thông báo lỗi
                toast.error('Có lỗi xảy ra: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi gửi yêu cầu');
        }
    };

    const isLoggedIn = () => {
        // Replace this with your actual authentication check
        const token = localStorage.getItem('authToken');
        return !!token; // Returns true if token exists, false otherwise
    };
    let tokenData = null;
    if(isLoggedIn()){
        tokenData = jwtDecode(localStorage.getItem('authToken'));
    }
    const avatar = tokenData ? tokenData.avatar : "default.png";
    const name = tokenData ? tokenData.name : "Người dùng";
    // Scroll Navbar
    const changeValueOnScroll = () => {
        const scrollValue = document?.documentElement?.scrollTop;
        scrollValue > 100 ? setNav(true) : setNav(false);
    };

    window.addEventListener("scroll", changeValueOnScroll);

    return (
        <header>
            <Navbar
                collapseOnSelect
                expand="lg"
                className={`${nav === true ? "sticky" : ""}`}
            >
                <Container>
                    <Navbar.Brand href="/">
                        <Link to="/" className="logo">
                            <img src={Logo} alt="Logo" className="img-fluid" />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link 
                                onClick={handleShow} 
                                className="text-center me-3 d-flex align-items-center"
                            >
                                Liên hệ/ Hỗ trợ
                            </Nav.Link>
                            {/* <Nav.Link as={Link} to="/">
                                Home
                            </Nav.Link> */}
                            {isLoggedIn() == false &&
                                (<Nav.Link as={Link} to="/register">
                                    Đăng nhập/Đăng ký
                                </Nav.Link>)
                            }
                            {isLoggedIn() == true &&
                                <HeaderDropDown 
                                avatar={avatar}
                                name={name}
                                 />
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modal Hỗ trợ */}
            <Modal show={showSupport} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Hỗ trợ khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={supportForm.name}
                                onChange={handleInputChange}
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={supportForm.phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                required
                                isInvalid={!!phoneError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {phoneError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={supportForm.content}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Nhập nội dung"
                                required
                            />
                        </Form.Group>

                        <div className="text-end">
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Đóng
                            </Button>
                            <Button variant="primary" type="submit">
                                Gửi yêu cầu
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </header>
    );
};

export default Header;
