import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FacilityCompanyApi from "@/features/facilityCompany/facilityCompany.api"; // Adjust import path as needed

/* =====================================================
   QUERY KEYS (Structured + Scalable)
===================================================== */
export const facilityCompanyKeys = {
  all: ["facility-companies"],
  lists: () => [...facilityCompanyKeys.all, "list"],
  list: (companyId, includeInactive) => [...facilityCompanyKeys.lists(), { companyId, includeInactive }],
  details: () => [...facilityCompanyKeys.all, "detail"],
  detail: (id) => [...facilityCompanyKeys.details(), id],
};

/* =====================================================
   QUERIES (Fetching Data)
===================================================== */

// 1. Get All Facility Companies
export const useFacilityCompanies = (company_id, includeInactive = false) => {
  return useQuery({
    queryKey: facilityCompanyKeys.list(company_id, includeInactive),
    queryFn: async () => {
      const response = await FacilityCompanyApi.getAll(company_id, includeInactive);
      if (!response.success) throw new Error(response.error || "Failed to fetch facility companies");
      // Returning the whole response to preserve access to response.count
      return response; 
    },
    enabled: !!company_id && company_id !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 2. Get Facility Company By ID
export const useFacilityCompanyById = (id) => {
  return useQuery({
    queryKey: facilityCompanyKeys.detail(id),
    queryFn: async () => {
      const response = await FacilityCompanyApi.getById(id);
      if (!response.success) throw new Error(response.error || "Failed to fetch facility company details");
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/* =====================================================
   MUTATIONS (Modifying Data)
===================================================== */

// 3. Create Facility Company
export const useCreateFacilityCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await FacilityCompanyApi.create(data);
      if (!response.success) throw new Error(response.error || "Failed to create facility company");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityCompanyKeys.lists() });
    },
  });
};

// 4. Update Facility Company
export const useUpdateFacilityCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await FacilityCompanyApi.update(id, data);
      if (!response.success) throw new Error(response.error || "Failed to update facility company");
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: facilityCompanyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facilityCompanyKeys.detail(variables.id) });
    },
  });
};

// 5. Delete Facility Company
export const useDeleteFacilityCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await FacilityCompanyApi.delete(id);
      if (!response.success) throw new Error(response.error || "Failed to delete facility company");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityCompanyKeys.lists() });
    },
  });
};

// 6. Toggle Facility Company Status
export const useToggleFacilityCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await FacilityCompanyApi.toggleStatus(id);
      if (!response.success) throw new Error(response.error || "Failed to toggle status");
      return response;
    },
    onSuccess: (data, variables) => {
      // variables is the `id` passed into the mutation
      queryClient.invalidateQueries({ queryKey: facilityCompanyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facilityCompanyKeys.detail(variables) });
    },
  });
};