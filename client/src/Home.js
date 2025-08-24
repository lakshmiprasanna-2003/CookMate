import React, { useState } from "react";

const Home = () => {
  const [data, setData] = useState({ text: "", prompt: "" });
  const [generated, setGenerated] = useState(""); // Gemini output
  const [email, setEmail] = useState(""); // receiver email

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
        to: email, // dynamic receiver
        subject: "Generated Text from Note Genie",
        mailText: generated || "Your generated text will appear here",
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

  // New function: send email with generated text
  const sendMailHandler = () => {
    if (!email) {
      alert("Please enter recipient email");
      return;
    }
    fetch("http://localhost:5000/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Generated Text from Note Genie",
        text: generated,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        alert(resData.message || "Email sent successfully!");
      })
      .catch((err) => console.log("Error:", err));
  };

  return (
    <div>
      <center>
        <h1>NOTE GENIE</h1>
        <form onSubmit={submitHandler}>
          <div className="container">
            <div className="col-md-8 card shadow-lg p-4 rounded-3">
              <label className="text-start">Enter the Text: </label>
              <input
                type="text"
                name="text"
                
                className="mb-3 form-control "
                onChange={changeHandler}
              />
              <br />
              <label className="text-start">Enter the Prompt: </label>
              <input
                type="text"
                name="prompt"
                className="mb-4 form-control"
                onChange={changeHandler}
              />
              <br />
              <label className="text-start">Recipient Email: </label>
              <input
                type="email"
                className="mb-4 form-control"
                placeholder="Enter receiver email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <button className="btn btn-primary rounded-3">
                Generate the text
              </button>
            </div>
          </div>
        </form>

        {/* Show Gemini generated text */}
        {generated && (
          <div className="mt-4 card p-3 shadow">
            <h3>Generated Text:</h3>
            <p>{generated}</p>
            <button
              className="btn btn-success mt-3"
              onClick={sendMailHandler}
            >
              Send via Email
            </button>
          </div>
        )}
      </center>
    </div>
  );
};

export default Home;
