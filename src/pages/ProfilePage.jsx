import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import { updateProfile } from '../services/authService.js';

const buildAddressPayload = ({ line1, line2, city, latitude, longitude }) => {
  const hasValues = line1 || line2 || city || latitude || longitude;
  if (!hasValues) {
    return undefined;
  }

  const payload = {
    line1: line1 || undefined,
    line2: line2 || undefined,
    city: city || undefined,
  };

  if (latitude !== '') {
    payload.latitude = Number(latitude);
  }

  if (longitude !== '') {
    payload.longitude = Number(longitude);
  }

  return payload;
};

const buildPreferencesPayload = (categoriesString) => {
  if (!categoriesString) {
    return undefined;
  }

  const categories = categoriesString
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (categories.length === 0) {
    return undefined;
  }

  return { categories };
};

const buildSellerDetailsPayload = ({ userType, shopName, businessRegistrationNumber, deliveryRadius }) => {
  if (userType !== 'seller') {
    return undefined;
  }

  return {
    shopName: shopName || undefined,
    businessRegistrationNumber: businessRegistrationNumber || undefined,
    deliveryRadius: deliveryRadius ? Number(deliveryRadius) : undefined,
  };
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore((state) => ({
    user: state.user,
    updateUser: state.updateUser,
  }));

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(() => ({
    userType: user?.userType ?? 'buyer',
    fullName: user?.profile?.fullName ?? '',
    avatarUrl: user?.profile?.avatarUrl ?? '',
    line1: user?.profile?.address?.line1 ?? '',
    line2: user?.profile?.address?.line2 ?? '',
    city: user?.profile?.address?.city ?? '',
    latitude: user?.profile?.address?.latitude ?? '',
    longitude: user?.profile?.address?.longitude ?? '',
    categories: (user?.profile?.preferences?.categories ?? []).join(', '),
    shopName: user?.profile?.sellerDetails?.shopName ?? '',
    businessRegistrationNumber: user?.profile?.sellerDetails?.businessRegistrationNumber ?? '',
    deliveryRadius: user?.profile?.sellerDetails?.deliveryRadius ?? '',
  }), [user]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const userType = watch('userType');

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      setServerError('');
      setSuccessMessage('');

      const payload = {
        userType: values.userType,
        profile: {
          fullName: values.fullName,
          avatarUrl: values.avatarUrl || undefined,
          address: buildAddressPayload(values),
          preferences: buildPreferencesPayload(values.categories),
          sellerDetails: buildSellerDetailsPayload({
            userType: values.userType,
            shopName: values.shopName,
            businessRegistrationNumber: values.businessRegistrationNumber,
            deliveryRadius: values.deliveryRadius,
          }),
        },
      };

      const updatedUser = await updateProfile(payload);
      updateUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');

      if (updatedUser.isProfileComplete) {
        navigate('/');
      }
    } catch (error) {
      setServerError(error.response?.data?.message ?? 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col gap-6 py-10">
      <div className="flex flex-col gap-2 text-left">
        <span className="inline-flex max-w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
          Complete your experience
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Tell us more about you</h1>
        <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
          Finish your profile to unlock personalized recommendations, delivery preferences, and seller tools.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {successMessage}
        </div>
      )}
      {serverError && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 rounded-2xl bg-white p-6 shadow-card md:grid-cols-[2fr_3fr]"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Account Type</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              {...register('userType', { required: true })}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Full Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && <span className="text-sm text-red-500">{errors.fullName.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Avatar URL</label>
            <input
              type="url"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              placeholder="https://"
              {...register('avatarUrl')}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Preferred Categories</label>
            <textarea
              rows="3"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              placeholder="Clothing, Electronics, Services"
              {...register('categories')}
            />
            <span className="text-xs text-slate-400">Separate categories with commas for personalized AI suggestions.</span>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Primary Address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                Address Line 1
                <input
                  type="text"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  {...register('line1')}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                Address Line 2
                <input
                  type="text"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  {...register('line2')}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                City/Area
                <input
                  type="text"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  {...register('city')}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                  Latitude
                  <input
                    type="number"
                    step="0.000001"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    {...register('latitude')}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                  Longitude
                  <input
                    type="number"
                    step="0.000001"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    {...register('longitude')}
                  />
                </label>
              </div>
            </div>
          </div>

          {userType === 'seller' && (
            <div className="grid gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Seller Details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                  Shop Name
                  <input
                    type="text"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    {...register('shopName', {
                      required: userType === 'seller' ? 'Shop name is required' : false,
                    })}
                  />
                  {errors.shopName && <span className="text-sm text-red-500">{errors.shopName.message}</span>}
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                  Business Registration Number
                  <input
                    type="text"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    {...register('businessRegistrationNumber')}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                  Delivery Radius (km)
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    {...register('deliveryRadius', {
                      min: { value: 0, message: 'Min 0 km' },
                      max: { value: 50, message: 'Max 50 km' },
                    })}
                  />
                  {errors.deliveryRadius && (
                    <span className="text-sm text-red-500">{errors.deliveryRadius.message}</span>
                  )}
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 font-semibold text-white shadow-card transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {isSubmitting ? 'Saving profile…' : 'Save & Continue'}
            </button>
            <p className="text-xs text-slate-400">
              Your details help personalize recommendations and connect you with nearby pasals matching your needs.
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProfilePage;
