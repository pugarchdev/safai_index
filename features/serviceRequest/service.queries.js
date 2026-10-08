import { useQuery } from "@tanstack/react-query";
import ServiceApi from "@/features/serviceRequest/service.api"; // Adjust the import path to your actual api file

/* =====================================================
   QUERY KEYS
===================================================== */
export const serviceKeys = {
  all: ["service-requests"],
  lists: () => [...serviceKeys.all, "list"],
  list: (filters) => [...serviceKeys.lists(), filters],
};

/* =====================================================
   QUERIES
===================================================== */

export const useServiceRequests = (filters = {}) => {
  return useQuery({
    // Passing filters into the queryKey ensures the query automatically refetches 
    // whenever the city or requestType changes!
    queryKey: serviceKeys.list(filters),
    queryFn: async () => {
      const response = await ServiceApi.getServiceRequests(filters);
      
      // Force React Query into error state if the API fails
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch service requests");
      }
      
      // Return the full response so your component can access both .data and .count
      return response; 
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};