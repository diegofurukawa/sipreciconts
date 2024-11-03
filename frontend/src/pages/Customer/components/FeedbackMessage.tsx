// src/pages/Customer/components/FeedbackMessage.tsx
interface FeedbackMessageProps {
    type: 'success' | 'error';
    message: string;
  }
  
  export const FeedbackMessage = ({ type, message }: FeedbackMessageProps) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    return (
      <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-md shadow-lg`}>
        {message}
      </div>
    );
  };
  