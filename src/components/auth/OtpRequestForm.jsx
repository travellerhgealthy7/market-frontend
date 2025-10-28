import { useForm } from 'react-hook-form';

const OtpRequestForm = ({ isLoading, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { mobile: '' },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.mobile))}
      className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow-card"
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back 👋</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your mobile number to receive a one-time passcode. No passwords required.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Mobile Number
        <input
          type="tel"
          placeholder="e.g. +9779800000000"
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          {...register('mobile', {
            required: 'Mobile number is required',
            minLength: { value: 8, message: 'Mobile number looks too short' },
          })}
        />
        {errors.mobile && <span className="text-sm text-red-500">{errors.mobile.message}</span>}
      </label>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white shadow-card transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isLoading ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </form>
  );
};

export default OtpRequestForm;
