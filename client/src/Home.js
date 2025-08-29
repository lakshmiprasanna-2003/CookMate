import React, { useState, useRef } from "react";

const Home = () => {
  const [data, setData] = useState({ text: "", prompt: "" });
  const [generated, setGenerated] = useState(""); // Gemini output

  // refs for textareas
  const textRef = useRef(null);
  const promptRef = useRef(null);

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

  return (
    <div>
      <center>
        <h1 className="m-4">CookMate</h1>
        <form onSubmit={submitHandler}>
          <div className="container">
            <div className="col-md-8 card shadow-lg p-4 rounded-3">
              <label className="text-start">Enter the Ingredients: </label>
              <textarea
                name="text"
                ref={textRef}
                value={data.text}
                className="mb-3 form-control"
                rows={1}
                onChange={changeHandler}
                style={{ overflow: "hidden", resize: "none" }}
              />
              <br />
              <label className="text-start">Enter the Prompt: </label>
              <textarea
                name="prompt"
                ref={promptRef}
                value={data.prompt}
                className="mb-4 form-control"
                rows={1}
                onChange={changeHandler}
                style={{ overflow: "hidden", resize: "none" }}
              />
              <br />
              <button className="btn btn-primary rounded-3">
                Generate the recipe
              </button>
            </div>
          </div>
        </form>

        {/* Show Gemini generated text */}
        {generated && (
        <div className="mt-4 card p-4 shadow-lg text-start rounded-3">
          <h3 className="mb-3 text-primary">🍴 Recipe Suggestion</h3>
          {generated.split("\n").map((line, index) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <h4 key={index} className="fw-bold text-success mt-3">
                  {line.replace(/\*\*/g, "")}
                </h4>
              );
            }

            if (line.includes(":")) {
              const [key, value] = line.split(":");
              return (
                <p key={index}>
                  <strong className="text-secondary">{key}:</strong> {value}
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
