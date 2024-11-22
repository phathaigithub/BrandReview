import React, { useState, useEffect } from 'react';
import * as Components from './Components';
import { useHistory } from 'react-router-dom';
import "./UserRegister.css";
import { CContainer, CButton } from '@coreui/react'

function UserRegister() {
    const [signIn, setSignIn] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const history = useHistory();
    const isLoggedIn = () => {
        // Replace this with your actual authentication check
        const token = localStorage.getItem('authToken');
        return !!token; // Returns true if token exists, false otherwise
    };

    const handleToggle = (value) => {
        setErrorMessage(""); // Clear the error message
        setSignIn(value); // Set the view
    };
    useEffect(() => {
        if (isLoggedIn()) {
            // Redirect to home page if user is already logged in
            history.push('/');
        }
    }, [history]);
    const handleSignUpClick = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin để đăng ký.");
            return;
        }
        const regex = /^[\p{L}\s]+$/u;
        if (!regex.test(name)) {
            setErrorMessage("Họ và tên không hợp lệ");
            return;
        }
        if (/\s/.test(password)) {
            setErrorMessage("Mật khẩu không được có khoảng trống");
            return;
        }

        const userInfo = { name, email, password };
        console.log(userInfo);
        try {
            const response = await fetch("http://localhost:8080/user/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo)
            })
            if (!response.ok) {
                // Extract and display error message from the response
                const errorData = await response.json();
                console.log(errorData.message);
                setErrorMessage(errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
                setSuccessMessage("");
                return;
            }
            setName("");
            setEmail("");
            setPassword("");
            setErrorMessage(""); // Clear error after successful submission
            setSuccessMessage("Đăng ký thành công");
            console.log('User added:', await response.json());
        } catch (error) {
            console.error('Error adding user:', error);
        }

    };
    const handleSignInClick = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin để đăng nhập.");
            setSuccessMessage("");
            return;
        }
        if (password.includes(" ")) {
            setSuccessMessage("");
            setErrorMessage("Mật khẩu không được có khoảng trống");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/auth/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: 'include', // To send cookies if needed
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.result) {
                    localStorage.setItem('authToken', data.result.token);
                    history.push('/'); // Redirect to home page after successful login
                }
            } else {
                // Extract and display error message from the response
                const errorData = await response.json();
                console.log(errorData.message);
                setErrorMessage(errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
                return;

            }
        } catch (err) {
            setErrorMessage(' Vui lòng kiểm tra lại thông tin.');
        }
        console.log("Đăng nhập thành công");
        // Perform your sign-in logic here
    };
    return (
        <CContainer fluid className="container-fluid d-flex justify-content-center align-items-center"
            style={{
                height: '100vh',
                backgroundImage: 'url("http://localhost:3000/static/media/hero-1.c176491a87d1cc685bd3.jpg")',
                backgroundSize: '100% 100%',  // Stretches image to fit both width and height
                backgroundPosition: 'center',
                width: '100%'
            }}>
            <Components.Container>
                <CButton
                    className='sticky-top m-3'
                    color="secondary"
                    onClick={() => history.push('/')}>
                    <i className='bi bi-chevron-left'></i>
                </CButton>
                <Components.SignUpContainer isSignIn={signIn}>
                    <Components.Form>
                        <Components.Title>ĐĂNG KÝ TÀI KHOẢN</Components.Title>
                        <Components.Input
                            type='text'
                            placeholder='Họ và tên'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Components.Input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Components.Input
                            type='password'
                            placeholder='Mật khẩu'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {successMessage && <p style={{ color: 'green', fontSize: '15px' }}>{successMessage}</p>}
                        {errorMessage && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage}</p>}
                        <Components.Button onClick={handleSignUpClick}>Đăng ký</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer isSignIn={signIn}>
                    <Components.Form>
                        <Components.Title>ĐĂNG NHẬP</Components.Title>
                        <Components.Input
                            type='text'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Components.Input
                            type='password'
                            placeholder='Mật khẩu'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorMessage && <p style={{ color: 'red', fontSize: '15px' }}>{errorMessage}</p>}
                        <Components.Button onClick={handleSignInClick}>Đăng nhập</Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer isSignIn={signIn}>
                    <Components.Overlay isSignIn={signIn}>
                        <Components.LeftOverlayPanel isSignIn={signIn}>
                            <Components.Title>ĐIỀN THÔNG TIN TÀI KHOẢN</Components.Title>
                            <Components.Paragraph>Cảm ơn vì bạn đã tin tưởng chúng tôi!</Components.Paragraph>
                            <Components.GhostButton onClick={() => handleToggle(true)}>Đăng nhập</Components.GhostButton>
                        </Components.LeftOverlayPanel>
                        <Components.RightOverlayPanel isSignIn={signIn}>
                            <Components.Title>Hello, Friend!</Components.Title>
                            <Components.Paragraph>Đăng ký tài khoản để đánh giá các cửa hàng bạn mong muốn!</Components.Paragraph>
                            <Components.GhostButton onClick={() => handleToggle(false)}>Đăng ký ngay</Components.GhostButton>
                        </Components.RightOverlayPanel>
                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </CContainer>

    );
}

export default UserRegister;
