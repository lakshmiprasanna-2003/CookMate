import React, { useState, useRef, useContext } from "react";
import { Navigate } from 'react-router-dom';
import { store } from './App';

const Home = () => {
  const [data, setData] = useState({ text: "", prompt: "" });
  const [generated, setGenerated] = useState(""); // Gemini output
  const [token, setToken] = useContext(store);
  // refs for textareas
  const textRef = useRef(null);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    // auto-resize
    if (e.target.scrollHeight > e.target.clientHeight) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: data.text,
        prompt: data.prompt,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData);
        if (resData.geminiResponse) {
          setGenerated(resData.geminiResponse);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => console.log("Error:", err));
  };
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="p-5">
      <center>
        <h1><b>🍳 What's cooking <span style={{ color: "#ff5601" }}>today?</span></b></h1>
        <p>
          Tell me what ingredients you have, and I’ll help you create something amazing. <br />
          Perfect for busy professionals who want great meals without the hassle.
        </p>
        <form onSubmit={submitHandler}>
          <div className="container">
            <div className="col-md-6 p-2 rounded-3">
              <label className="text-start fw-bold"> </label>
              <textarea
                name="text"
                ref={textRef}
                value={data.text}
                className="mb-3 form-control "
                rows={1}
                placeholder="What ingredients do you have? (like Chicken, rice, 20 minutes, mood)"
                onChange={changeHandler}
                style={{
                  overflow: "hidden",
                  resize: "none",
                  borderColor: "#ff5601",        // orange border
                  boxShadow: "none",             // remove Bootstrap’s default glow
                }}
              />
              <button 
                className="btn rounded-3" 
                style={{ background: "#ff5601ff", color: "#ffff" }}
              >
                <b>Search</b>
              </button>

            </div>
          </div>
        </form>

        {/* Show Gemini generated text */}
        {generated && (
          <div className="mt-4 p-4 text-start rounded-3 bg-white shadow">
            <h3 className="mb-3 text-center" style={{color:'#fc8144ff'}}><b>🍴 Recipe Suggestion</b></h3>
            <br />
            {generated.split("\n").map((line, index) => {
              if (line.startsWith(" ") && line.endsWith(" ")) {
                return (
                  <h4 key={index} className="fw-bold mt-3" style={{color:'#fc8144ff'}}>
                    {line.replace(/\\/g, "")}
                  </h4>
                );
              }

              if (line.includes(":")) {
                const [key, value] = line.split(":");
                return (
                  <p key={index}>
                    <strong >{key}:</strong> {value}
                  </p>
                );
              }
              return (
                <p key={index} className="mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        )}
      </center>
    </div>
  );
};

export default Home;
