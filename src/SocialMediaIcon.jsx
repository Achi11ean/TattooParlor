const SocialMediaIcon = ({ platform }) => {
    const icons = {
      facebook: <i className="fab fa-facebook text-blue-600"></i>, // FontAwesome or custom SVG
      instagram: <i className="fab fa-instagram text-pink-500"></i>,
      twitter: <i className="fab fa-twitter text-blue-400"></i>,
      linkedin: <i className="fab fa-linkedin text-blue-700"></i>,
      // Add more platforms as needed
    };
  
    return icons[platform.toLowerCase()] || <i className="fas fa-link text-gray-500"></i>; // Default icon
  };
  