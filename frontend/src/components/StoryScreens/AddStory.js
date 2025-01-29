import React, { useRef, useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthContext } from "../../Context/AuthContext";
import { FiArrowLeft } from "react-icons/fi";
import { Row, Col } from "react-bootstrap";
import { AiOutlineUpload } from 'react-icons/ai'

import "../../Css/AddStory.css";

const AddStory = () => {
  const { config } = useContext(AuthContext);
  const editorEl = useRef(null);
  const imageEl = useRef(null)
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [age, setAge] = useState("")
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const clearInputs = () => {
    setTitle("");
    setContent("");
    setWeight("");
    setPrice("");
    setAge("")
    setImage("");
    editorEl.current.editor.setData("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("image", image);
    formdata.append("content", content);
    formdata.append("price", price);
    formdata.append("weight", weight);
    formdata.append("age", age);

    try {
      const { data } = await axios.post("https://sparko.onrender.com/story/addstory", formdata, config);
      setSuccess("Chi Posted Succesfully, GOOD JOB!");

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
              placeholder="Pet Name"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              autoFocus={true}
            />

            <input
              className="inp"
              type="text"
              required
              id="price"
              placeholder="Input a price in Euro"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
             <input
              className="inp"
              type="text"
              required
              id="content"
              placeholder="Write a little about this pet"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
             <input
              className="inp"
              type="text"
              required
              id="weight"
              placeholder="Estimate the weight of this pet"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
            />
             <input
              className="inp"
              type="text"
              required
              id="age"
              placeholder="Estimate the age of this pet"
              onChange={(e) => setAge(e.target.value)}
              value={age}
            />
          </Col>
          <div class="StoryImageField">
                    <AiOutlineUpload />
                    <div class="txt">
                        {image ? image.name :
                            " Include a high-quality image in your story to make it more inviting to readers."
                        }
                    </div>
                    <input
                        name="image"
                        type="file"
                        ref={imageEl}
                        onChange={(e) => {
                            setImage(e.target.files[0])
                        }}
                    />
                </div>
        </Row>
        <button type="submit" className="addStory-btn">
          Publish{" "}
        </button>
      </form>
    </div>
  );
};

export default AddStory;
