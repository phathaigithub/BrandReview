import React, { useState } from 'react';
import * as Components from './Components';
import "./UserRegister.css";

function UserRegister() {
    const [signIn, setSignIn] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    const handleToggle = (value) => {
        setErrorMessage(""); // Clear the error message
        setSignIn(value); // Set the view
    };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        
        if (!username || !email || !password) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin để đăng ký.");
            return;
        }
        
        const userInfo = { username, email, password };
        console.log(userInfo);

        fetch("http://localhost:8080/user/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInfo)
        }).then(() => {
            console.log("Added User");
        });

        setUsername("");
        setEmail("");
        setPassword("");
        setErrorMessage(""); // Clear error after successful submission
    };

    const handleSignInClick = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin để đăng nhập.");
            return;
        }
        
        console.log("Đăng nhập thành công");
        // Perform your sign-in logic here
    };

    return (
        <Components.Container>
            <Components.SignUpContainer isSignIn={signIn}>
                <Components.Form>
                    <Components.Title>ĐĂNG KÝ TÀI KHOẢN</Components.Title>
                    <Components.Input 
                        type='text' 
                        placeholder='Tên đăng nhập' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
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
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <Components.Button onClick={handleSignUpClick}>Đăng ký</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            <Components.SignInContainer isSignIn={signIn}>
                <Components.Form>
                    <Components.Title>ĐĂNG NHẬP</Components.Title>
                    <Components.Input 
                        type='text' 
                        placeholder='Tên đăng nhập' 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Components.Input 
                        type='password' 
                        placeholder='Mật khẩu' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
    );
}

export default UserRegister;
