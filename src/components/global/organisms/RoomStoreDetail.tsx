import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoomStoreDetail() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      <h1>RoomStoreDetail</h1>
      <button onClick={handleGoBack}>
        Quay lại
      </button>
    </div>
  );
}

export default RoomStoreDetail;
