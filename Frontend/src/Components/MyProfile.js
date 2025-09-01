import React from "react";

const MyProfile = ({ favorites = [] }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Favorite Items</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-600">No favorite items yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p>⏱ {item.duration}</p>
              <p>⚡ {item.difficulty}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
