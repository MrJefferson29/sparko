import React from 'react';
import { Link } from 'react-router-dom';

const Story = ({ story }) => {
  const editDate = (createdAt) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date(createdAt);
    return d.getDate() + " " + monthNames[d.getMonth()] + ", " + d.getFullYear();
  };

  const truncateContent = (content) => {
    return content.substr(0, 73);
  };

  const truncateTitle = (title) => {
    return title.substr(0, 69);
  };

  return (
    <div className="story-card">
      <Link to={`/story/${story.slug}`} className="story-link">
        <img
          className="story-image"
          src={story.imageUrl}
          alt={story.title}
        />
        <div className="story-content-wrapper">
          <h5 className="story-title">
            {story.title.length > 76 ? truncateTitle(story.title) + "..." : story.title}
          </h5>
          <p
            className="story-text"
            dangerouslySetInnerHTML={{ __html: truncateContent(story.content) + "..." }}
          />
          <div className="story-footer">
            <p className="story-createdAt">£ {story.price}</p>
            <button className="get-me-now-button">Get me now</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Story;
