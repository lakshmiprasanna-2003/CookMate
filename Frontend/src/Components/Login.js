import React, { useContext, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';
import { store } from '../App';


const Login = () => {
    const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/chat-bg1.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
    const[token,setToken]=useContext(store)
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
  });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      alert("Please fill in both fields.");
      return;
    }

    axios.post('http://localhost:5000/login', data)
   .then(res => {console.log(setToken(res.data.token)); // ✅ Check token or user data
    alert("Login successful!");
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    navigate('/home');
    
   })
      .catch(err => {
        if (err.response && err.response.data) {
          alert(err.response.data);
        } else {
          alert("Login failed. Please try again.");
        }
      });
  };

  return (
    <div  style={backgroundStyle}>
        <div  className="text-center p-4 shadow rounded bg-transparent w-25">
      <center>
        <h1 style={{color:'#fc8144ff'}} ><b>Login</b></h1>
        <form onSubmit={submitHandler} autoComplete='off' className='text-start'>
          <div className="form-group mb-3">
            <label>Enter Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={data.email}
              onChange={changeHandler}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Enter Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={data.password}
              onChange={changeHandler}
              required
            />
          </div>
          <div className="d-flex justify-content-center">
            <input

              type="submit"
              style={{background:"#fc8144ff", color:'white'}}
              className="btn w-50 fw-bold"
              value="Login"
            />
          </div>
        </form>
      </center>
      </div>
    </div>
  );
};

export default Login;
