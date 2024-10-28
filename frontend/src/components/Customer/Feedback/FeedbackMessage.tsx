import React from 'react';

interface FeedbackMessageProps {
  type: 'success' | 'error';
  message: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ type, message }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      {message}
    </div>
  );
};

export default FeedbackMessage;