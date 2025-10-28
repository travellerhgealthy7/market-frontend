import { useState } from 'react';
import httpClient from '../services/httpClient.js';
import useAuthStore from '../stores/authStore.js';

const useOtpFlow = () => {
  const [step, setStep] = useState('request');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);

  const requestOtp = async (mobileNumber) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await httpClient.post('/auth/send-otp', { mobile: mobileNumber });
      setMobile(mobileNumber);
      setStep('verify');
      setOtpSentMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await httpClient.post('/auth/verify-otp', { mobile, otp });
      login({ token: response.data.token, user: response.data.user });
      setStep('completed');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    mobile,
    isLoading,
    error,
    otpSentMessage,
    requestOtp,
    verifyOtp,
  };
};

export default useOtpFlow;
