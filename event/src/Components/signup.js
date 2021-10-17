import React, {useState} from  'react';
import axios from 'axios';
import "./signup.css"
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [userName,setUserName]=useState("");
    const [Email,setEmail]=useState("");
    const [Password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [warningMsg_UN,setWarningMsg_UN]=useState("hide-msg");
    const [warningMsg_E,setWarningMsg_E]=useState("hide-msg");
    const [warningMsg_P,setWarningMsg_P]=useState("hide-msg");
    const [warningMsg_Cp,setWarningMsg_Cp]=useState("hide-msg");
    const [passwordCheck,setPasswordCheck]=useState("hide-check-div");
    const [warningMsg_Cp_p,setWarningMsg_Cp_p]=useState("hide-error");
    const [warning_format,setWarningFormat]=useState("hide-format");
    const [userCharMsg,setUserCharMsg]=useState("hide-usermsg-div");
    const [userLengDiv,setUserLengDiv]=useState("hide-userlen-div");
    const [navLogin,setNavLogin]=useState(false);
    function handleSubmit(e){
        e.preventDefault()
    }
    function handleClickGetLabel(e){
        let getLabel=document.getElementsByClassName("hide-div");
        for(let i=0;i<getLabel.length;i++){
            if(getLabel[i].innerText===e.target.attributes[0].value){
                getLabel[i].className="display-div";
            }
        }
        e.target.attributes[0].value="";
    }
    function handleCheckValue(e){
        if(e.target.value!==""){
            if(e.target.value.indexOf(".com")===-1){
                return setWarningMsg_E("hide-msg",setWarningFormat("display-format"))
            }
            if(e.target.value.indexOf("@")===-1){
                return setWarningMsg_E("hide-msg",setWarningFormat("display-format"))
            }
            setWarningMsg_E("hide-msg",setWarningFormat("hide-format"))
        } 
    }
    function handleCheckPassword(e){
        setWarningMsg_P("hide-msg");
        setPasswordCheck("display-checkdiv");
        var passClass=document.getElementsByClassName("pass-check");
        if(new RegExp('(?=.*[a-z])').test(Password)){
            passClass[4].style.display="none";
        }else{
            passClass[4].style.display="block";
            passClass[4].style.color="red";
        }
        if(new RegExp('(?=.*[A-Z])').test(Password)){
            passClass[3].style.display="none";
        }else{
            passClass[3].style.display="block";
            passClass[3].style.color="red";
        }
        if(new RegExp('(?=.*[0-9])').test(Password)){
            passClass[2].style.display="none";
        }else{
            passClass[2].style.display="block";
            passClass[2].style.color="red";
        }
        if(new RegExp('(?=.*[@$!])').test(Password)){
            passClass[1].style.display="none";
        }else{
            passClass[1].style.display="block";
            passClass[1].style.color="red";
        }
        if(new RegExp('(?=.{8,})').test(Password)){
            passClass[0].style.display="none";
        }else{
            passClass[0].style.display="block"
            passClass[0].style.color="red";
        }

    }
    function handleSignup(){
        let format=/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(userName===""){
           return setWarningMsg_UN("display-msg");
        }
        if(Email===""){
           return setWarningMsg_E("display-msg");
        }
        if(Password===""){
            return setWarningMsg_P("display-msg");
        }
        if(confirmPassword===""){
            return setWarningMsg_Cp("display-msg");
        }
        if(userName.length<3 || userName.length>25){
            setUserCharMsg("hide-usermsg-div");
            return setUserLengDiv("display-userlen-div");
        }
        if(userName.length>3 || userName.length<25){
            setUserLengDiv("hide-userlen-div");
            if(format.test(userName)){
                return setUserCharMsg("display-usermsg-div");
            }else{
                setUserCharMsg("hide-usermsg-div");
            }
           
        }
        if(Email !==""){
            if(Email.trim().indexOf("@")===0 || Email.trim().indexOf(".com")===0 || Email.trim().indexOf(".com")-Email.trim().indexOf("@")===1){
                return setWarningMsg_E("hide-msg",setWarningFormat("display-format"))
            }else{
                setWarningMsg_E("hide-msg",setWarningFormat("hide-format"))
            }
        }
        
        let passClass=document.getElementsByClassName("pass-check");
        if(passClass[0].style.display==="none"&&passClass[1].style.display==="none"&&
        passClass[2].style.display==="none"&&passClass[3].style.display==="none" &&
        passClass[4].style.display==="none" && warningMsg_UN==="hide-msg"&&
        warningMsg_E==="hide-msg" &&warningMsg_P==="hide-msg"&&
        warningMsg_Cp==="hide-msg"&&warningMsg_Cp_p==="hide-error"&&
        warning_format==="hide-format"&&userCharMsg==="hide-usermsg-div"&&
        userLengDiv==="hide-userlen-div"){
            const obj={
                "UserName":userName.trim(),
                "Email":Email.trim(),
                "Password":Password.trim(),
                "ConfirmPassword":confirmPassword.trim()
            }
            axios({
                method:'POST',
                url:'http://localhost:8080/signup',
                headers:{'Content-Type':'application/json'},
                data:obj
            }).then(response=>{
                if(response.data.message==="user already exist"){
                    setUserName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    alert(response.data.message);
                    setNavLogin(true);
                }else{
                    setUserName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    alert(response.data.message);
                }
               
            })
      
        }
        
    }
    
    function handleCancel(){
       setUserName("");
       setEmail("");
       setPassword("");
       setConfirmPassword("");
       window.location.reload();
    }
    return ( 
        <React.Fragment>
            {navLogin===true && <Redirect to="/"/>}
            <form onSubmit={(e)=>handleSubmit(e)} id="signup-form">
                <h1 id="sign-up-heading">SignUp</h1>
                <div className="input-fields">
                <div className="hide-div">UserName</div>
                <input placeholder="UserName" spellCheck="false" type="text" value={userName}
                onChange={(e)=>setUserName(e.target.value)} onClick={(e)=>handleClickGetLabel(e,e.target.value===""&&setWarningMsg_UN("display-msg"))}
                onKeyUp={(e)=>e.target.value===""?setWarningMsg_UN("display-msg",setUserCharMsg("hide-usermsg-div"),setUserLengDiv("hide-userlen-div")):setWarningMsg_UN("hide-msg")}/>
                <div className={warningMsg_UN}>*Field is required</div>
                <div id={userCharMsg}>UserName Should not contain special symbols</div>
                <div id={userLengDiv}>User Name length should be minimum 3 Charecters and max 25</div>
                </div>

                <div className="input-fields">
                <div className="hide-div">Email</div>
                <input placeholder="Email" spellCheck="false" type="email" value={Email}
                 onChange={(e)=>setEmail(e.target.value)} onClick={(e)=>handleClickGetLabel(e,e.target.value===""&&setWarningMsg_E("display-msg"))}
                onKeyUp={(e)=>e.target.value===""? setWarningMsg_E("display-msg",setWarningFormat("hide-format")):handleCheckValue(e)}/>
                <div className={warningMsg_E}>*Field is required</div>
                <div id={warning_format}>Format should be example@example.com</div>
                </div>

                <div className="input-fields">
                <div className="hide-div">Password</div>
                <input placeholder="Password" type="password" value={Password}
                 onChange={(e)=>setPassword(e.target.value)} onClick={(e)=>handleClickGetLabel(e,e.target.value===""&&setWarningMsg_P("display-msg"))}
                 onKeyUp={(e)=>e.target.value===""?setWarningMsg_P("display-msg",setPasswordCheck("hide-check-div")):handleCheckPassword(e)}/>
                <div className={warningMsg_P}>*Field is required</div>
                <div id={passwordCheck}>
                <p className="pass-check">.Length Should be 8 to 20 characters only</p>
                <p className="pass-check">.Must contain any of the following symbols [@$!]</p>
                <p className="pass-check">.Must have one number in between[0-9]</p>
                <p className="pass-check">.Must contain at least one upper-case</p>
                <p className="pass-check">.Must contain at least one lower-case</p>
                </div>
                </div>

                <div className="input-fields">
                <div className="hide-div">ConfirmPassword</div>
                <input placeholder="ConfirmPassword" type="password" value={confirmPassword}
                 onChange={(e)=>setConfirmPassword(e.target.value)} onClick={(e)=>handleClickGetLabel(e,e.target.value===""&&setWarningMsg_Cp("display-msg"))}
                 onKeyUp={(e)=>e.target.value===""?setWarningMsg_Cp("display-msg",setWarningMsg_Cp_p("hide-error")):Password!==confirmPassword?setWarningMsg_Cp("hide-msg",setWarningMsg_Cp_p("error")):setWarningMsg_Cp("hide-msg",setWarningMsg_Cp_p("hide-error"))}/>
                <div className={warningMsg_Cp}>*Field is required</div>
                <div id={warningMsg_Cp_p}>Confirm Password Should be matched with Password</div>
                </div>

                <button id="btn-signup" onClick={handleSignup}>Signup</button>
                <button id="btn-cancel" onClick={handleCancel}>Cancel</button>
                <div style={{textAlign:"center",marginTop:20+"px"}}>account already exist?<Link to="/"><span style={{color:"blue"}}> Login</span></Link></div>
            </form>
        </React.Fragment>
    );
}
 
export default Signup;