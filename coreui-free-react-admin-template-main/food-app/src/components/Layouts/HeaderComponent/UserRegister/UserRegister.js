import React, { useEffect } from 'react';
import * as Components from './Components';

// import "./styles.css"
function UserRegister() {
    
    const [signIn, toggle] = React.useState(true);

    useEffect(() => {
        // Create a link element for the CSS file
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./styles.cssstyles.css";
        link.id = "user-register-css";

        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);
    
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleClick = (e) => {
        e.preventDefault()
        const userInfo = {username, email, password}
        console.log(userInfo)

        fetch("http://localhost:8080/user/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(userInfo)
        }).then(()=>{
            console.log("Added User")
        })
        setUsername("");
        setEmail("");
        setPassword("");
    }
     return(
         <Components.Container>
             <Components.SignUpContainer isSignIn={signIn}>
                 <Components.Form>
                     <Components.Title>Create Account</Components.Title>
                     <Components.Input type='text' placeholder='Tên đăng nhập' value={username} onChange={(e) => setUsername(e.target.value)}/>
                     <Components.Input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                     <Components.Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                     <Components.Button onClick={handleClick}>Sign Up</Components.Button>
                 </Components.Form>
             </Components.SignUpContainer>

             <Components.SignInContainer isSignIn={signIn}>
                  <Components.Form>
                      <Components.Title>Sign in</Components.Title>
                      <Components.Input type='email' placeholder='Email' />
                      <Components.Input type='password' placeholder='Password' />
                      <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                      <Components.Button>Sigin In</Components.Button>
                  </Components.Form>
             </Components.SignInContainer>

             <Components.OverlayContainer isSignIn={signIn}>
                 <Components.Overlay isSignIn={signIn}>

                 <Components.LeftOverlayPanel isSignIn={signIn}>
                     <Components.Title>Welcome Back!</Components.Title>
                     <Components.Paragraph>
                         To keep connected with us please login with your personal info
                     </Components.Paragraph>
                     <Components.GhostButton onClick={() => toggle(true)}>
                         Sign In
                     </Components.GhostButton>
                     </Components.LeftOverlayPanel>

                     <Components.RightOverlayPanel isSignIn={signIn}>
                       <Components.Title>Hello, Friend!</Components.Title>
                       <Components.Paragraph>
                           Enter Your personal details and start journey with us
                       </Components.Paragraph>
                           <Components.GhostButton onClick={() => toggle(false)}>
                               Sigin Up
                           </Components.GhostButton> 
                     </Components.RightOverlayPanel>
 
                 </Components.Overlay>
             </Components.OverlayContainer>

         </Components.Container>
     )
}

export default UserRegister;