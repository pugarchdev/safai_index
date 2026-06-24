"use client";

import { useState } from "react";
import { MapPin, CalendarDays, Filter } from "lucide-react";

// ✅ Import your new TanStack Query hook (Adjust the path if needed)
import { useServiceRequests } from "@/features/serviceRequest/service.queries"; 

const REQUEST_TYPE_OPTIONS = [
  { label: "All Requests", value: "" },
  { label: "City Not Available", value: "CITY_NOT_AVAILABLE" },
  { label: "No Toilet Within Radius", value: "NO_TOILET_WITHIN_RADIUS" },
];

export default function ServiceRequestsPage() {
  // 1. Local state for the input fields
  const [city, setCity] = useState("");
  const [requestType, setRequestType] = useState("");

  // 2. State for the filters that have actually been applied via the button
  const [appliedFilters, setAppliedFilters] = useState({
    city: "",
    requestType: "",
  });

  // 3. Fetch data via TanStack Query (automatically refetches when appliedFilters changes)
  const { 
    data: response, 
    isLoading: loading, 
    isError, 
    error 
  } = useServiceRequests(appliedFilters);

  // Safely extract the requests array
  const requests = response?.data || [];

  // 4. Update the applied filters when the button is clicked
  const handleFilter = () => {
    setAppliedFilters({
      city,
      requestType,
    });
  };

  return (
    <div className="min-h-screen  p-6 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Service Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage incoming service requests
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-end transition-colors">

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              City
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              // Trigger filter apply on Enter key press as well for better UX
              onKeyDown={(e) => e.key === "Enter" && handleFilter()} 
              className="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition"
              placeholder="Enter city"
            />
          </div>

          <div className="flex flex-col min-w-[220px]">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Request Type
            </label>

            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition"
            >
              {REQUEST_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleFilter}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition active:scale-95"
          >
            <Filter size={14} />
            Apply Filters
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">

          {loading && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              Loading...
            </div>
          )}

          {isError && (
            <div className="p-8 text-center text-red-500">
              {error?.message || "An unexpected error occurred"}
            </div>
          )}

          {!loading && !isError && requests.length === 0 && (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
              No service requests found.
            </div>
          )}

          {!loading && !isError && requests.length > 0 && (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide
  bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                        {req.request_type === "CITY_NOT_AVAILABLE"
                          ? "City Not Available"
                          : "No Toilet Within Radius"}
                      </span>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={14} />
                        {req.city || "N/A"}, {req.state || "N/A"}
                      </div>

                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        Lat: {req.latitude} | Lng: {req.longitude}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <CalendarDays size={14} />
                      {new Date(req.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}