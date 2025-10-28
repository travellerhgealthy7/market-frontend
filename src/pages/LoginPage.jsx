import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpRequestForm from '../components/auth/OtpRequestForm.jsx';
import OtpVerifyForm from '../components/auth/OtpVerifyForm.jsx';
import useOtpFlow from '../hooks/useOtpFlow.js';
import useAuthStore from '../stores/authStore.js';

const LoginPage = () => {
  const { step, isLoading, error, otpSentMessage, requestOtp, verifyOtp, mobile } = useOtpFlow();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.isProfileComplete ? '/' : '/profile', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const renderContent = () => {
    if (step === 'verify') {
      return (
        <OtpVerifyForm
          isLoading={isLoading}
          onSubmit={verifyOtp}
          mobile={mobile}
          resend={() => requestOtp(mobile)}
        />
      );
    }

    return <OtpRequestForm isLoading={isLoading} onSubmit={requestOtp} />;
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
          Secure login
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          ShopEase – try, shop, and enjoy locally
        </h1>
        <p className="max-w-xl text-sm text-slate-500 sm:text-base">
          Continue with your mobile number to discover curated pasals nearby, access try-on experiences,
          and schedule deliveries in minutes.
        </p>
      </div>
      {otpSentMessage && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {otpSentMessage}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {renderContent()}
    </section>
  );
};

export default LoginPage;
