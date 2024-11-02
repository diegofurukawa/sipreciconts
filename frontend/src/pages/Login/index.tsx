// src/pages/Login/index.tsx
import { LoginHeader } from './components/LoginHeader';
import { LoginForm } from './components/LoginForm';
import { useLoginForm } from './hooks/useLoginForm';

const LoginPage = () => {
  const loginForm = useLoginForm();

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginHeader />
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm form={loginForm} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;