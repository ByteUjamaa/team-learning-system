import React from 'react';

const InfoCards = ({ currentUser }) => {
  const cards = [
    { title: "Account Status", value: "Active", color: "green" },
    { title: "Member Since", value: "2023", color: "blue" },
    { title: "Role", value: currentUser?.role || "Member", color: "purple" },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{card.title}</h3>
          <p className={`text-lg font-bold text-${card.color}-600`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;