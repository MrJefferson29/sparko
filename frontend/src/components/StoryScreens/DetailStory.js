import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiMail, FiHeart } from "react-icons/fi";
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeUser, setActiveUser] = useState({});
  const [story, setStory] = useState({});
  const [storyLikeUser, setStoryLikeUser] = useState([]);
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const slug = useParams().slug;
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const navigate = useNavigate();

  const handleEmailClick = () => {
    const email = "frenchbulldogkennel.help@gmail.com";
    const subject = `Purchase of ${story.name}`;
    const body =
      `Dear Adoption Team,\n\n` +
      `I am interested in adopting ${story.name} as part of my family\n\n` +
      `Could you please provide more details regarding its availability and delivery arrangements?\n\n` +
      `Thank you!\n\n` +
      `[Your Name]`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true);
      var activeUser = {};
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user;
        setActiveUser(activeUser);
      } catch (error) {
        setActiveUser({});
      }

      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser });
        setStory(data.data);
        setLikeStatus(data.likeStatus);
        setLikeCount(data.data.likeCount);
        setStoryLikeUser(data.data.likes);
        setLoading(false);

        const story_id = data.data._id;

        if (activeUser.readList) {
          if (!activeUser.readList.includes(story_id)) {
            setStoryReadListStatus(false);
          } else {
            setStoryReadListStatus(true);
          }
        }
      } catch (error) {
        setStory({});
        navigate("/not-found");
      }
    };
    getDetailStory();
  }, [slug, setLoading]);

  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus);
    }, 1500);

    try {
      const { data } = await axios.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setLikeCount(data.data.likeCount);
      setStoryLikeUser(data.data.likes);
    } catch (error) {
      setStory({});
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post")) {
      try {
        await axios.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate();
    return datestring;
  };

  const addStoryToReadList = async () => {
    try {
      const { data } = await axios.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setStoryReadListStatus(data.status);
      document.getElementById("readListLength").textContent = data.user.readListLength;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GunDetailsStyles>
      <div className="carousel-wrapper">
        {activeUser && story.author &&
          story.author._id === activeUser._id ?
          <div className="top_story_transactions">
            <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
              <FiEdit />
            </Link>
            <span className='deleteStoryLink' onClick={handleDelete}>
              <RiDeleteBin6Line />
            </span>
          </div> : null
        }
        <div className="slide">
          <img
            src={`http://localhost:5000/storyImages/${story.image}`}
            alt={story.name}
            className="carousel-img"
          />
        </div>
        {/* </Slider> */}
      </div>
      <div className="details-content">
        <h1 className="name">{story.title}</h1>
        <p className="description">{story.content}</p>
        <div className="info">
          <div className="info-left">
            <p style={{ fontSize: '20px' }}>
              <strong style={{ color: "#ff9900" }}>Price:</strong> € {story.price}
            </p>
            <p>
              <strong style={{ color: "#ff9900" }}>Weight:</strong> {story.weight} lbs
            </p>
            <p>
              <strong>Health Status: Healthy and Vetted</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="hero-box">
        <FiHeart
          onClick={handleLike}
          style={{
            color: '#ff9900',
            fill: "#ff9900",
            fontSize: "2.4rem",
            cursor: "pointer",
          }}
        />
        <div
          className="block"
          onClick={handleEmailClick}
        >
          <FiMail
            style={{ fontSize: "2.4rem", marginRight: "1.5rem" }}
            className="mail"
          />
          <button className="send">
            Message
          </button>
        </div>
      </div>
    </GunDetailsStyles>
  );
};

export default DetailStory;

const GunDetailsStyles = styled.div`
  margin: 2rem auto;
  max-width: 1000px; /* Reduced for larger screens */
  font-family: "Arial", sans-serif;
  overflow-x: hidden;

  .carousel-wrapper {
    width: 100%;
    margin-bottom: 2rem;
    margin-top: 2.5rem;
    overflow: hidden;
  }

  .carousel-img {
    width: 100%;
    height: 450px;
    object-fit: cover;
    border-radius: 2px;
    transition: transform 0.3s ease-in-out;
  }

  .carousel-img:hover {
    transform: scale(1.05);
  }

  .details-content {
    width: 100%;
    text-align: left;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  .name {
    font-size: 2rem; /* Slightly reduced for larger screens */
    font-weight: 700;
    margin-bottom: 1rem;
    color: #333;
  }

  .description {
    font-size: 1.1rem; /* Slightly reduced for larger screens */
    line-height: 1.6;
    margin-bottom: 1.5rem;
    color: #555;
  }

  .info {
    display: flex;
    flex-direction: column;
    font-size: 1rem; /* Slightly reduced for larger screens */
    font-weight: 400;
    color: #333;
  }

  .info-left {
    padding-bottom: 1rem;
  }

  .info-left p {
    margin: 0.5rem 0;
  }

  .hero-box {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 600px;
    background-color: #f0f0f0;
    color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    text-align: center;
    padding: 15px;
    font-size: 1.2rem; /* Slightly reduced for larger screens */
    font-weight: bold;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
  }

  .mail {
    color: black;
    transition: 1.5s;
  }

  .send {
    background-color: #ff9900;
    transition: 1.5s;
    border: none;
    padding: 10px 20px;
    font-size: 1.4rem;
    color: white;
    cursor: pointer;
  }

  .send:hover {
    background-color: #e87b00;
  }
    .top_story_transactions {
    margin: 30px;
    display: flex;
    align-items: space-between;
    font-size: 1.8rem;
}

.top_story_transactions a {
    margin-right: 20px;
    color: black;
}

.top_story_transactions span {
    color: #0063a5;
    cursor: pointer;
}
    .BsThreeDots_opt:hover .delete_or_edit_story {
    display: flex;
}

.delete_or_edit_story {
    cursor: pointer;
    position: absolute;
    top: -50px;
    background-color: white;
    box-shadow: 0 0 10px rgba(204, 204, 204, 0.6);
    right: 0px;
    border-radius: 6px;
    padding: 0.6rem 10px 0;
    font-size: 0.7rem;
    display: none;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

.delete_or_edit_story p {
    color: black;
    font-family: 'Inter';
    font-weight: bold;
    padding: 0;
    text-decoration: none;
}

.delete_or_edit_story a {
    text-decoration: none;
}

`;
