import { useState, useEffect } from 'react';

const Avatar = ({ src, alt, className, fallback = '/default-avatar.png' }) => {
  const [imgSrc, setImgSrc] = useState(fallback);
  const [hasError, setHasError] = useState(false);

  // Update imgSrc when the src prop changes
  useEffect(() => {
    if (src) {
      console.log('Avatar src changed:', src);
      // Extract filename from path and use API endpoint
      let fullSrc;
      if (src.startsWith('http')) {
        fullSrc = src;
      } else if (src.startsWith('/uploads/avatars/')) {
        // Extract filename from /uploads/avatars/filename
        const filename = src.split('/').pop();
        fullSrc = `http://localhost:5000/api/users/avatar/${filename}`;
      } else {
        fullSrc = `http://localhost:5000${src}`;
      }
      setImgSrc(fullSrc);
      setHasError(false); // Reset error state when src changes
    } else {
      setImgSrc(fallback);
      setHasError(false);
    }
  }, [src, fallback]);

  const handleError = () => {
    console.log('Avatar load error for:', imgSrc);
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img 
      className={className}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default Avatar;
