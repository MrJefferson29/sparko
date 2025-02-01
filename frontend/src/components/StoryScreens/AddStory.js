import React, { useRef, useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthContext } from "../../Context/AuthContext";
import { FiArrowLeft } from "react-icons/fi";
import { Row, Col } from "react-bootstrap";
// import b2 from '../../Assets/b2.jpg'
import { AiOutlineUpload } from 'react-icons/ai';
import "../../Css/AddStory.css";

const AddStory = () => {
  const { config } = useContext(AuthContext);
  const imageEl = useRef(null);
  const editorEl = useRef(null);
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState("")
  const [weight, setWeight] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const clearInputs = () => {
    setTitle("");
    setContent("");
    setPrice("");
    setAge("");
    setWeight("");
    setImage("");
    editorEl.current.editor.setData("");
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const formdata = new FormData();
  formdata.append("title", title);
  formdata.append("my_file", file);  // Change 'image' to 'my_file'
  formdata.append("content", content);
  formdata.append("price", price);
  formdata.append("age", age);
  formdata.append("weight", weight);
  try {
    const { data } = await axios.post("https://sparko.onrender.com/story/addstory", formdata, config);
    setSuccess("Story posted successfully, GOOD JOB!");

    clearInputs();
    setTimeout(() => {
      setSuccess("");
    }, 7000);
  } catch (error) {
    setTimeout(() => {
      setError("");
    }, 7000);
    setError(error.response.data.error);
  }
};

  return (
    <div className="Inclusive-addStory-page ">
      <Link to={"/"}>
        <FiArrowLeft />
      </Link>
      <form onSubmit={handleSubmit} className="addStory-form">
        {error && <div className="error_msg">{error}</div>}
        {success && (
          <div className="success_msg">
            <span>{success}</span>
            <Link to="/" style={{ color: "bisque", fontWeight: "900" }}>
              Go home
            </Link>
          </div>
        )}

        <Row>
          <Col md="6">
            <input
              className="inp"
              type="text"
              id="title"
              required
              placeholder="Package name"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              autoFocus={true}
            />
            <input
              className="inp"
              type="text"
              required
              id="age"
              placeholder="What is the age"
              onChange={(e) => setAge(e.target.value)}
              value={age}
            />
             <input
              className="inp"
              type="text"
              required
              id="price"
              placeholder="What is the price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </Col>
          <Col md="6">
            <input
              className="inp"
              type="text"
              id="weight"
              placeholder="Package Weight"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
            />
             <input
              className="inp"
              type="text"
              id="content"
              placeholder="write a little about the puppy"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </Col>
        </Row>
        <div className="StoryImageField">
                    <AiOutlineUpload />
                    <div className="txt">
                        {file ? file.name : "Include a high-quality image to make it more inviting to readers."}
                    </div>
                    <input
                        name="image"
                        type="file"
                        ref={imageEl}
                        onChange={handleFileChange} 
                    />
                </div>
        <button type="submit" className="addStory-btn">
          Publish{" "}
        </button>
      </form>
    </div>
  );
};

export default AddStory;