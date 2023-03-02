import axios from 'axios';

export const getDbUsers = async () => {
  const response = await axios.get('/.netlify/functions/api/users');
  return JSON.parse(response.data.body);
};

export const getDbUser = async (uid: string) => {
  const response = await axios.get(`/.netlify/functions/api/user/${uid}`);
  return JSON.parse(response.data.body);
};

export const updateDbUser = async (
  displayName: string,
  lastSignInTime: string,
  timesLoggedIn: number,
  uid: string,
) => {
  await axios.put('/.netlify/functions/api/users', {
    displayName,
    lastSignInTime,
    timesLoggedIn,
    uid,
  });
};

export const addDbUser = async (
  uid: string,
  displayName: string,
  email: string,
  providerId: string,
  photoURL: string,
  creationTime: string,
  lastSignInTime: string,
  timesLoggedIn: number,
) => {
  await axios.post('/.netlify/functions/api/users', {
    uid,
    displayName,
    email,
    providerId,
    photoURL,
    creationTime,
    lastSignInTime,
    timesLoggedIn,
  });
};

export const deleteDbUser = async (uid: string) => {
  await axios.delete(`/.netlify/functions/api/user/${uid}`);
};

export const getDbLogEntries = async () => {
  const response = await axios.get('/.netlify/functions/api/access_logs');
  return JSON.parse(response.data.body);
};

export const getDbLogEntriesForUser = async (uid: string) => {
  const response = await axios.get(
    `/.netlify/functions/api/access_logs/${uid}`,
  );
  return JSON.parse(response.data.body);
};

export const addDbLogEntry = async (uid: string, entry: string) => {
  await axios.post('/.netlify/functions/api/access_logs', {
    uid,
    entry,
  });
};
