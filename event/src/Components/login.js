import React, {useState} from 'react';
import axios from 'axios';
import "./login.css"
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import App from '../App';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '3px',
        backgroundColor:"white",
        border: 'solid 2px brown',
        width: '64%',
        height: '62%',
    }
};

const Login = () => {
    const [Email,setEmail]=useState("");
    const [Password,setPassword]=useState("");
    const [warningMsg_E,setWarningMsg_E]=useState("login-hide-msg");
    const [warningMsg_FE,setWarningMsg_FE]=useState("loginf-hide-msg");
    const [warningMsg_P,setWarningMsg_P]=useState("login-hide-msg");
    const [navSignUp,setNavSignUp]=useState(false);
    const [modalIsOpen,setModal]=useState(false);
    const [passwordModalIsOpen,setPasswordModal]=useState(false);
    const [FEmail,setFEmail]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [warningMsg_NP,setWarningMsg_NP]=useState("hide-new-msg");
    const [newPasswordCheck,setNewPasswordCheck]=useState("hide-pass-check-div")
    const [userId,setUserId]=useState("");
    const [navCalender,setNavCalender]=useState(false);
    const [tok,setToken]=useState("");

    function handleSubmit(e){
        e.preventDefault()
    }

    function handleClickGetLabel(e){
        let getLabel=document.getElementsByClassName("login-hide-div");
        for(let i=0;i<getLabel.length;i++){
            if(getLabel[i].innerText===e.target.attributes[0].value){
                getLabel[i].className="login-display-div";
            }
        }
        e.target.attributes[0].value="";
    }

    function handleClickGetFLabel(e){
        let getLabel=document.getElementById("loginf-hide-div");
        if(getLabel){
            getLabel.id="loginf-display-div";
        }
            
        e.target.attributes[0].value="";
    }
    function handleLogin(){
        if(Email===""){
            return setWarningMsg_E("display-msg");
        }
        if(Password===""){
            return setWarningMsg_P("display-msg");
        }
        if(warningMsg_E==="login-hide-msg" || warningMsg_P==="login-hide-msg"){
            const obj={
                "Email":Email.trim(),
                "Password":Password.trim(),
            }
            axios({
                method:'POST',
                url:'http://localhost:8080/login',
                headers:{'Content-Type':'application/json'},
                data:obj
            }).then(response=>{
                if(response.data.msg==="User does not Exist"){
                    setEmail("");
                    setPassword("");
                    alert(response.data.msg);
                    setNavSignUp(true);
                }if(response.data.msg==="Invalid user"){
                    alert(response.data.msg + " Check Password and Email")
                }if(response.data.msg==="Loggin successfully"){
                    setEmail("");
                    setPassword("");
                    setToken(response.data.userToken);
                    alert(response.data.msg);
                    setNavCalender(true);
                }
               
            })
        }
    }
    function handleCancel(){
       setEmail("");
       setPassword("");
       window.location.reload();
    }
    function handleForgetPassword(){
        setEmail("");
        setPassword("");
        setModal(true);
    }
    function handleClose(){
        setWarningMsg_FE("loginf-hide-msg");
        setFEmail("");
        setModal(false);
    }
    function handleProceed(){
        if(FEmail===""){
            return setWarningMsg_FE("loginf-display-msg");
        }
        const obj={
            "Email":FEmail.trim()
        }
        axios({
            method:'POST',
            url:'http://localhost:8080/forgetpassword',
            headers:{'Content-Type':'application/json'},
            data:obj
        }).then(response=>{
            if(response.data.msg==="User does not Exist"){
                setFEmail("");
                alert(response.data.msg);
                setNavSignUp(true);
            }else{
                setUserId(response.data.id);
                setFEmail("");
                setModal(false);
                setPasswordModal(true);
            }
        })
    }
    function handleClickGetPasswordLabel(e){
        let getLabel=document.getElementById("password-hide-div");
        if(getLabel){
            getLabel.id="password-display-div";
        }
            
        e.target.attributes[0].value="";
    }
    function handleCheckNewPassword(){
        setWarningMsg_NP("hide-new-msg");
        setNewPasswordCheck("display-pass-check-div");
        var passClass=document.getElementsByClassName("pass-check");
        if(new RegExp('(?=.*[a-z])').test(newPassword)){
            passClass[4].style.display="none";
        }else{
            passClass[4].style.display="block";
            passClass[4].style.color="red";
        }
        if(new RegExp('(?=.*[A-Z])').test(newPassword)){
            passClass[3].style.display="none";
        }else{
            passClass[3].style.display="block";
            passClass[3].style.color="red";
        }
        if(new RegExp('(?=.*[0-9])').test(newPassword)){
            passClass[2].style.display="none";
        }else{
            passClass[2].style.display="block";
            passClass[2].style.color="red";
        }
        if(new RegExp('(?=.*[@$!])').test(newPassword)){
            passClass[1].style.display="none";
        }else{
            passClass[1].style.display="block";
            passClass[1].style.color="red";
        }
        if(new RegExp('(?=.{8,})').test(newPassword)){
            passClass[0].style.display="none";
        }else{
            passClass[0].style.display="block"
            passClass[0].style.color="red";
        }
    }
    function handleNewProceed(){
        if(newPassword===""){
            return setWarningMsg_NP("display-new-msg");
        }
        let passClass=document.getElementsByClassName("pass-check");
        if(passClass[0].style.display==="none"&&passClass[1].style.display==="none"&&
        passClass[2].style.display==="none"&&passClass[3].style.display==="none" &&
        passClass[4].style.display==="none"&&warningMsg_NP==="hide-new-msg"){
            const obj={
                "Password":newPassword.trim()
            }
            axios({
                method:'POST',
                url:'http://localhost:8080/updatePassword/'+userId,
                headers:{'Content-Type':'application/json'},
                data:obj
            }).then(response=>{
                if(response.data.msg==="password updated successfully"){
                    setNewPassword("");
                    setPasswordModal(false);
                    return alert(response.data.msg);
                }
            })
        }
    }
    function handleCloseNew(){
        setWarningMsg_NP("hide-new-msg");
        setPasswordModal(false);
    }

    return ( 
        <React.Fragment>
            {navSignUp===true && <Redirect to="/signup" />}
            {navCalender===true? <App token={tok}/>:
            <form onSubmit={(e)=>handleSubmit(e)} id="login-form">
                <h1 id="Login-heading">Login</h1>
                <div className="login-input-fields">
                <div className="login-hide-div">Email</div>
                <input placeholder="Email" spellCheck="false" type="email" value={Email}
                 onChange={(e)=>setEmail(e.target.value)} onClick={(e)=>handleClickGetLabel(e,e.target.value===""&&setWarningMsg_E("login-display-msg"))}
                onKeyUp={(e)=>e.target.value===""? setWarningMsg_E("login-display-msg"):setWarningMsg_E("login-hide-msg")}/>
                <div className={warningMsg_E}>*Field is required</div>
                </div>

                <div className="login-input-fields">
                <div className="login-hide-div">Password</div>
                <input placeholder="Password" type="password" value={Password}
                 onChange={(e)=>setPassword(e.target.value)} onClick={(e)=>handleClickGetLabel(e,e.target.value===""&&setWarningMsg_P("login-display-msg"))}
                 onKeyUp={(e)=>e.target.value===""?setWarningMsg_P("login-display-msg"):setWarningMsg_P("login-hide-msg")}/>
                <div className={warningMsg_P}>*Field is required</div>
                </div>


                <button id="btn-login" onClick={handleLogin}>Login</button>
                <button  id="btn-log-fg"  onClick={handleForgetPassword}>ForgetPassword</button>
                <button id="btn-cancel-login" onClick={handleCancel}>Cancel</button>
                <div style={{textAlign:"center",marginTop:20+"px"}}>Create an account?<Link to="/signup"><span style={{color:"blue"}}> SignUp</span></Link></div>
                
            </form>}

            <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                ariaHideApp={false}
            >
                <button className="btn btn-sm btn-danger" style={{ float: 'right'}} onClick={handleClose}>❌</button>
                <h3 style={{textAlign:"center",fontSize:20+"px",letterSpacing:1+"px",marginTop:20+"px"}}>Forget Password</h3>
                <div id="loginf-input-fields">
                <div id="loginf-hide-div">Email</div>
                <input placeholder="Email" spellCheck="false" type="email" value={FEmail}
                 onChange={(e)=>setFEmail(e.target.value)} onClick={(e)=>handleClickGetFLabel(e,e.target.value===""&&setWarningMsg_FE("loginf-display-msg"))}
                onKeyUp={(e)=>e.target.value===""? setWarningMsg_FE("loginf-display-msg"):setWarningMsg_FE("loginf-hide-msg")}/>
                <div id={warningMsg_FE}>*Field is required</div>
                </div>
                <button id="pr-btn" onClick={handleProceed}>Proceed</button>      
            </Modal>
            <Modal
                isOpen={passwordModalIsOpen}
                style={customStyles}
                ariaHideApp={false}
            >
                <button className="btn btn-sm btn-danger" style={{ float: 'right'}} onClick={handleCloseNew}>❌</button>
                <h3 style={{textAlign:"center",fontSize:20+"px",letterSpacing:1+"px",marginTop:20+"px"}}>New Password</h3>
                <div id="password-input-fields">
                <div id="password-hide-div">Password</div>
                <input placeholder="Password" type="password" value={newPassword}
                 onChange={(e)=>setNewPassword(e.target.value)} onClick={(e)=>handleClickGetPasswordLabel(e,e.target.value===""&&setWarningMsg_NP("display-new-msg"))}
                 onKeyUp={(e)=>e.target.value===""?setWarningMsg_NP("display-new-msg",setNewPasswordCheck("hide-pass-check-div")):handleCheckNewPassword()}/>
                <div id={warningMsg_NP}>*Field is required</div>
                <div id={newPasswordCheck}>
                <p className="pass-check">.Length Should be 8 to 20 characters only</p>
                <p className="pass-check">.Must contain any of the following symbols [@$!]</p>
                <p className="pass-check">.Must have one number in between[0-9]</p>
                <p className="pass-check">.Must contain at least one upper-case</p>
                <p className="pass-check">.Must contain at least one lower-case</p>
                </div>
                </div>
                <button id="pr-new-btn" onClick={handleNewProceed}>Proceed</button>
            </Modal>
        </React.Fragment>

    );
}
 
export default Login;