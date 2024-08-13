// LazyImage.js
import React, { useState, useEffect } from 'react';

const LazyImage = ({ src, alt, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: '75%',
        }
      );
      observer.observe(imageRef);
    }
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
      didCancel = true;
    };
  }, [src, imageSrc, imageRef, placeholder]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      style={{ transition: 'opacity 0.3s', opacity: imageSrc === placeholder ? 0.5 : 1 }}
    />
  );
};

export default LazyImage;