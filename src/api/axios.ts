import axios from 'axios';

const HOST = process.env.NEXT_PUBLIC_HOST_URL;

const axiosInstance = axios.create({ baseURL: `${HOST}/api` });

interface RequestProps {
  url: string;
  method: string;
  accessToken?: string;
  data?: any;
  params?: any;
  formdata?: boolean;
}

export const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    accessToken,
    data,
    params,
    formdata,
  }: RequestProps) => {
    try {
      const response = await axiosInstance({
        url,
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': formdata ? 'multipart/form-data' : 'application/json',
        },
        data,
        params,
      });
      return { data: response.data };
    } catch (err) {
      return {
        error: {
          status: err.response?.status,
          message: err.response?.data?.message || err.message,
        },
      };
    }
  };

export default axiosInstance;
