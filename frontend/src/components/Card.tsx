import React from 'react';

const Card = ({ title, children, onClick }) => {
  return (
    <div
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
