import React from 'react'
import { useNavigate } from 'react-router-dom';

function CreateRoomStore() {
  const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
      };
  return (
    <div>

    <div>CreateRoomStore</div>
    <button onClick={handleGoBack}>
        Quay lại
      </button>
    </div>
  )
}

export default CreateRoomStore