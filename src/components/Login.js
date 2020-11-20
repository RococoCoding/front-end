import React, {useState} from "react";
import * as yup from "yup";
import schema from "./validation/loginSchema"
import Styled from "styled-components";

import Axios from "axios";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveUser } from "../actions/userActions";
import { clearState } from "../actions/classActions";

const initialValues = {
    username: "",
    password: "",
}

const initialErrors = {
    username: "",
    password: "",
}

const Login  = () => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrors);

    const { push } = useHistory();
    const dispatch = useDispatch();
    
    const Change = (evt) => {
        const correctValue = evt.target.value.trim();
        const validation = () => {
            yup
            .reach(schema, evt.target.name)
            .validate(correctValue)
            .then((res) => {
                setErrors({...errors, [evt.target.name] : ""})
                // console.log(res)
            })
            .catch((err) => {

                setErrors({...errors,[evt.target.name] : err.message})
            })
        }
        validation()
        setValues({...values,[evt.target.name] : correctValue});
    }

    const submit = (evt) => {
        evt.preventDefault();
        Axios.post(`https://bw-back-end.herokuapp.com/api/auth/login`, values)
            .then(res => {
                localStorage.setItem("token", res.data.token);
                let user = {
                    name: res.data.user.name,
                    email: res.data.user.email,
                    id: res.data.user.id,
                    role: res.data.user.role,
                    username: res.data.user.username
                }
                dispatch(saveUser(user)) //sets user
                dispatch(clearState()) //clears class state  -- need to change if loading classes from api 
                push("/dashboard");
            })
            .catch(err => console.log(err))
    }

    return(
        
        <ContainerDiv>
        <div></div>    
        <StyledForm className="logIn-container" onSubmit={submit}>
            <StyledLabel>
                <StyledInput 
                type="text" 
                name="username" 
                placeholder="Username"
                value={values.username}
                onChange={Change}
                ></StyledInput>
            </StyledLabel>
            {errors.username ? <div>{errors.username}</div> : ""}
            <br/>
            <StyledLabel>
                <StyledInput 
                type="password" 
                name="password" 
                placeholder="Password"
                value={values.password}
                onChange={Change}
                ></StyledInput>
            </StyledLabel>
            {errors.password ? <div>{errors.password}</div> : ""}
            <br/>
            <button id="logInBtn" >Login</button>
        </StyledForm>
        <div></div>
        </ContainerDiv>
    );
};

export default Login;


const ContainerDiv = Styled.div`
display: flex;
flex-direction: column;
align-items: center;
background-color: #3F51B5;
padding:1%;
div {
    padding: 1.5%;
    width: 97%;
}
button {
    /* remove default behavior */
    appearance:none;
    -webkit-appearance:none;

    /* usual styles */
    font-size: 1.2rem;
    padding:15px;
    border:solid #3F51B5;
    background-color:#3F51B5;
    color:#fff;
    font-weight:600;
    border-radius:7px;
    margin-top: 5%;
    margin-bottom: -5%;
    width:40%;
    transition: 0.5s;
}
button:hover{
    cursor: pointer;
    background-color: #fff;
    color: #3F51B5;
}

`

const StyledForm = Styled.form`
display: flex;
flex-direction: column;
align-items: center;
width: 30%;
/* height: 40%; */
box-shadow:0 0 25px 15px rgba(0,0,0,0.26);
padding: 15%;
color: red;
background-color: white;
`

const StyledLabel = Styled.label`
display: flex;
justify-content: center;
 
`

const StyledInput = Styled.input`
padding:10px;
border:0;
box-shadow:0 0 15px 5px rgba(0,0,0,0.13);
margin:10px 0px;  //add top and bottom margin
width: 100%;
font-size: 1.5rem;
`


