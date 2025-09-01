import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login';

const Register = () => {
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
const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  });

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async e => {
    e.preventDefault();

    const { username, email, password, confirmpassword } = data;

    if (!username || !email || !password || !confirmpassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmpassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
        confirmpassword
      });
      alert(res.data, Login); 
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(err.response?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <div  style={backgroundStyle}>
        <div  className="text-center p-4 shadow rounded bg-transparent w-25">
      <center>
        <h1 style={{color:'#fc8144ff'}} ><b>Register</b></h1>
        <form onSubmit={submitHandler} className='text-start'>
          <div className="form-group mb-3" >
            <label>Enter Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={data.username}
              onChange={changeHandler}
              required
            />
          </div>
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
          <div className="form-group mb-4">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmpassword"
              value={data.confirmpassword}
              onChange={changeHandler}
              required
            />
          </div>
          <div className='d-flex justify-content-center'>
            <input type="submit" className="btn w-50 fw-bold" value="Register" style={{background:"#fc8144ff", color:'white'}} />
          </div>
        </form>
      </center>
      </div>
    </div>
  );
};

export default Register;
