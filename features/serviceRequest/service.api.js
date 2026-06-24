import axiosInstance from "@/shared/api/axios.instance.js"; 

const ServiceApi = {
  getServiceRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.city) {
        params.append("city", filters.city);
      }

      if (filters.requestType) {
        params.append("requestType", filters.requestType);
      }

      const response = await axiosInstance.get(
        `/service-req?${params.toString()}`
      );

      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error) {
      console.error("Error fetching service requests:", error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Failed to fetch service requests",
      };
    }
  },
};

export default ServiceApi;
