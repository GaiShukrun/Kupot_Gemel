import React from 'react';

function smoothScroll(targetId, duration = 2000) {
    const targetElement = document.getElementById(targetId);
    const targetPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - 50; // Adjust the offset as needed
    let start = null;

    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const ease = easeInOutCubic(progress / duration);
        window.scrollTo(0, startPosition + distance * ease);
        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, startPosition + distance); // Ensure it ends at the correct position
        }
    });

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

const ScrollButton = ({ targetId, duration, className, text}) => {
    const handleClick = () => {
        smoothScroll(targetId, duration); // Pass the targetId and duration to the scroll function
    };

    return (
        <button className={`${className}`} onClick={handleClick}>
            {text}
        </button>
    );
};

export default ScrollButton;