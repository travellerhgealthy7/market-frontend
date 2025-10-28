import httpClient from './httpClient.js';

export const updateProfile = async ({ userType, profile }) => {
  const response = await httpClient.post('/auth/update-profile', {
    userType,
    profile,
  });

  return response.data.user;
};
