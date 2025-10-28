import { useForm } from 'react-hook-form';

const OtpVerifyForm = ({ isLoading, onSubmit, mobile, resend }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: '' },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.otp))}
      className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow-card"
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Enter verification code</h2>
        <p className="mt-1 text-sm text-slate-500">
          We&apos;ve sent a 6-digit code to <span className="font-medium text-slate-700">{mobile}</span>.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        One-Time Passcode (OTP)
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-center text-lg tracking-widest text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          {...register('otp', {
            required: 'OTP is required',
            minLength: { value: 4, message: 'OTP must be at least 4 digits' },
          })}
        />
        {errors.otp && <span className="text-sm text-red-500">{errors.otp.message}</span>}
      </label>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <button type="button" onClick={resend} className="font-medium text-brand-600 hover:text-brand-700">
          Resend Code
        </button>
        <span>Expires in 5 minutes</span>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white shadow-card transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isLoading ? 'Verifying…' : 'Verify & Continue'}
      </button>
    </form>
  );
};

export default OtpVerifyForm;
