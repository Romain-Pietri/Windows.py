import React, { useState, useEffect, useRef } from 'react';

const Postit: React.FC = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const postitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (postitRef.current && postitRef.current.dataset.dragging === 'true') {
        setPosition({
          x: event.clientX - postitRef.current.offsetWidth / 2,
          y: event.clientY - postitRef.current.offsetHeight / 2,
        });
      }
    };

    const handleMouseUp = () => {
      if (postitRef.current) {
        postitRef.current.dataset.dragging = 'false';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    if (postitRef.current) {
      postitRef.current.dataset.dragging = 'true';
    }
  };

  return (
    <div
      className="postit"
      ref={postitRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <textarea className="postit-content" placeholder="Write your note here..."></textarea>
    </div>
  );
};

export default Postit;