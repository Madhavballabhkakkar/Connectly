// redux/actions/userActions.ts
import axios from 'axios';
import {showFlashMessage} from 'components/showFlashMessage';
import {Utils} from '@Utils';

// Login API
export const loginUserAPI = async (params: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      'https://dummyjson.com/auth/login',
      params,
      {headers: {'Content-Type': 'application/json'}},
    );

    console.log('Login Response:', response.data);

    if (response.data) {
      Utils.loggedInUser = response.data; // store globally
      return response.data;
    }

    throw new Error('No data received');
  } catch (error: any) {
    console.error('Login failed:', error?.response?.data);
    error?.response?.data?.message &&
      showFlashMessage(error?.response?.data?.message);
  }
};

// ✅ Get Users API (Paginated)
export const getUserCartsAPI = async ({
  limit = 10,
  skip = 0,
  select = '',
}: {
  limit?: number;
  skip?: number;
  select?: string;
}) => {
  try {
    const url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}${
      select ? `&select=${select}` : ''
    }`;

    console.log('Fetching users from:', url);

    const response = await axios.get(url, {
      headers: {'Content-Type': 'application/json'},
    });
    if (response.data?.users) {
      return response.data;
    }

    throw new Error('No data received');
  } catch (error: any) {
    console.error('Fetching users failed:', error?.response?.data);
    error?.response?.data?.message &&
      showFlashMessage(error?.response?.data?.message);
  }
};
