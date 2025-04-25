import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8081/myapp/api/business/employee";

const getAuthConfig = () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    toast.error("Không tìm thấy access token!");
    throw new Error("Access token not found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

const employeeApi = {
  getAll: async () => {
    try {
      const res = await axios.get(BASE_URL, getAuthConfig());
      return res.data;
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách nhân viên");
      throw error;
    }
  },

  deleteById: async (empId) => {
    try {
      await axios.delete(`${BASE_URL}/${empId}`, getAuthConfig());
    } catch (error) {
      toast.error("Lỗi khi xoá nhân viên");
      throw error;
    }
  },

  getById: async (empId) => {
    try {
      const res = await axios.get(`${BASE_URL}/${empId}`, getAuthConfig());
      return res.data;
    } catch (error) {
      toast.error("Lỗi khi tìm nhân viên");
      throw error;
    }
  },

  update: async (empId, data) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/${empId}`,
        data,
        getAuthConfig()
      );
      return res.data;
    } catch (error) {
      toast.error("Lỗi khi cập nhật nhân viên");
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await axios.post(BASE_URL, data, getAuthConfig());
      return res.data;
    } catch (error) {
      toast.error("Lỗi khi tạo nhân viên");
      throw error;
    }
  },

  findByAccount: async (account) => {
    try {
      const res = await axios.get(`${BASE_URL}/findEmployeeByAccount`, {
        ...getAuthConfig(),
        params: { account },
      });
      return res.data;
    } catch (error) {
      toast.error("Không tìm thấy nhân viên theo tài khoản");
      throw error;
    }
  },
};

export default employeeApi;
