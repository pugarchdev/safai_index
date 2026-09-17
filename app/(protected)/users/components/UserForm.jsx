"use client";

import { useState, useEffect, useMemo } from "react";
import { useCompanyId } from "@/providers/CompanyProvider";
import { Search } from "lucide-react";
// TanStack Query Hooks
import { useDropdownRoles } from "@/features/dropdownList/dropdownlist.query";
import { useCompany } from "@/features/companies/queries/companies.queries";

export default function UserForm({
  initialData,
  onSubmit,
  isEditing = false,
  canSubmit = true,
  locations = [],           // ✅ Receiving locations from parent
  isLoadingLocations = false // ✅ Receiving loading state from parent
}) {
  const { companyId } = useCompanyId();

  // --- TANSTACK QUERIES ---
  const { data: companyData, isLoading: isLoadingCompany } = useCompany(companyId);
  const { data: rolesResponse, isLoading: isLoadingRoles } = useDropdownRoles();

  // --- DERIVED STATE ---
  const isLoadingData = isLoadingCompany || isLoadingRoles || isLoadingLocations;

  const allRoles = useMemo(() => {
    if (!rolesResponse) return [];

    // 1. Safely extract the array (handles both direct arrays and { data: [...] } objects)
    const extractedArray = Array.isArray(rolesResponse)
      ? rolesResponse
      : (rolesResponse.data || []);

    // 2. Final safety check before filtering
    const safeArray = Array.isArray(extractedArray) ? extractedArray : [];

    // 3. Filter out the Superadmin (id: 1)
    return safeArray.filter((role) => role.id !== 1);
  }, [rolesResponse]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role_id: "",
    company_id: companyId,
    location_ids: [],
  });

  const [locationSearch, setLocationSearch] = useState("");

  // --- EFFECTS ---

  // 1. Initialize Form Data
  useEffect(() => {
    if (initialData) {
      const assignments =
        initialData.location_assignments ||
        initialData.cleaner_assignments_as_cleaner ||
        [];

      const extractedLocationIds = assignments
        .filter((a) => a.is_active !== false && a.status !== "unassigned")
        .map((a) => (a.location_id || a.locations?.id)?.toString())
        .filter(Boolean);

      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        phone: initialData.phone || "",
        role_id: initialData.role_id ? initialData.role_id.toString() : "",
        company_id: initialData.company_id || companyId,
        location_ids: extractedLocationIds,
      });
    }
  }, [initialData, companyId]);

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    const strVal = value.toString();
    setFormData((prev) => {
      const currentIds = (prev.location_ids || []).map(String);
      return {
        ...prev,
        location_ids: checked
          ? [...currentIds, strVal]
          : currentIds.filter((id) => id !== strVal),
      };
    });
  };

  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return locations;
    return locations.filter((loc) =>
      loc.name?.toLowerCase().includes(locationSearch.toLowerCase().trim())
    );
  }, [locations, locationSearch]);

  const handleSelectAllLocations = () => {
    const filteredIds = filteredLocations.map((l) => l.id.toString());
    setFormData((prev) => {
      const currentSet = new Set((prev.location_ids || []).map(String));
      filteredIds.forEach((id) => currentSet.add(id));
      return { ...prev, location_ids: Array.from(currentSet) };
    });
  };

  const handleClearLocations = () => {
    setFormData((prev) => ({
      ...prev,
      location_ids: [],
    }));
  };

  const isFormValid = () => {
    const hasName = formData.name.trim().length > 0;
    const hasPhone = formData.phone.trim().length === 10;
    const hasRole = formData.role_id !== "";
    const hasPassword = isEditing || formData.password.trim().length >= 6;
    return hasName && hasPhone && hasRole && hasPassword;
  };

  // Flag to control visibility of location assignment
  const SHOW_LOCATION_ASSIGNMENT = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      company_id: formData.company_id || companyId,
      role_id: formData.role_id ? parseInt(formData.role_id) : null,
      location_ids: (formData.location_ids || []).map(String),
    };

    // If location assignment is hidden, omit location_ids so existing assignments aren't affected
    if (!SHOW_LOCATION_ASSIGNMENT) {
      delete dataToSend.location_ids;
    }

    // If nothing is entered in the email field, don't send it to the backend
    if (!dataToSend.email || !dataToSend.email.trim()) {
      delete dataToSend.email;
    } else {
      dataToSend.email = dataToSend.email.trim();
    }

    // Prevent sending empty password on edit
    if (isEditing && (!dataToSend.password || !dataToSend.password.trim())) {
      delete dataToSend.password;
    }

    onSubmit(dataToSend);
  };

  const inputClass = "w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all";
  const labelClass = "block text-xs font-semibold mb-2 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
      {/* Operation Node Section */}
      {SHOW_LOCATION_ASSIGNMENT && (
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--user-add-header-bg)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--user-add-accent)" }}
              aria-hidden="true"
            >
              <path d="M10 12h4" />
              <path d="M10 8h4" />
              <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
              <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
              <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
            </svg>
          </div>

          <div>
            <h3
              className="text-sm font-black uppercase tracking-tight"
              style={{ color: "var(--user-add-title)" }}
            >
              Assigned Operation Node
            </h3>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--user-add-subtitle)" }}
            >
              Select the operation node for this user
            </p>
          </div>
        </div>
      )}

      {/* User Information Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--user-form-accent)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h2
            className="text-base font-bold"
            style={{ color: "var(--user-form-text)" }}
          >
            User Information
          </h2>
        </div>

        <div>
          <label className={labelClass} style={{ color: "var(--user-form-label)" }}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
            style={{
              background: "var(--user-form-input-bg)",
              border: "1px solid var(--user-form-input-border)",
              color: "var(--user-form-text)",
            }}
            placeholder="Legal Name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--user-form-label)" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              aria-autocomplete="none"
              data-lpignore="true"
              className={inputClass}
              style={{
                background: "var(--user-form-input-bg)",
                border: "1px solid var(--user-form-input-border)",
                color: "var(--user-form-text)",
              }}
              placeholder="staff@saaf.ai"
            />
          </div>

          <div>
            <label className={labelClass} style={{ color: "var(--user-form-label)" }}>
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={10}
              pattern="[0-9]{10}"
              style={{
                background: "var(--user-form-input-bg)",
                border: "1px solid var(--user-form-input-border)",
                color: "var(--user-form-text)",
              }}
              placeholder="Mobile Number"
            />
          </div>
        </div>
      </div>

      {/* Access & Security Section */}
      <div className="space-y-5 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--user-form-accent)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2
            className="text-base font-bold"
            style={{ color: "var(--user-form-text)" }}
          >
            Access &amp; Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--user-form-label)" }}>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ color: "var(--user-form-label)" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Password {!isEditing && "*"}
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
              className={inputClass}
              placeholder="••••••"
              minLength={!isEditing ? 6 : undefined}
              style={{
                background: "var(--user-form-input-bg)",
                border: "1px solid var(--user-form-input-border)",
                color: "var(--user-form-text)",
              }}
            />
          </div>

          <div>
            <label className={labelClass} style={{ color: "var(--user-form-label)" }}>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ color: "var(--user-form-label)" }}
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Access Level *
              </span>
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              disabled={isLoadingData}
              className={inputClass}
              style={{
                background: "var(--user-form-input-bg)",
                border: "1px solid var(--user-form-input-border)",
                color: "var(--user-form-text)",
              }}
            >
              <option value="">
                {isLoadingData ? "Loading roles..." : "Select role"}
              </option>
              {allRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location Assignment */}
      {SHOW_LOCATION_ASSIGNMENT && (
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className={labelClass} style={{ color: "var(--user-form-label)", marginBottom: 0 }}>
              Assign Locations (Optional)
            </label>
            {locations.length > 0 && (
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span style={{ color: "var(--user-form-subtext)" }}>
                  Selected: {formData.location_ids.length} of {locations.length}
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllLocations}
                  className="cursor-pointer hover:underline text-xs"
                  style={{ color: "var(--user-form-accent)" }}
                >
                  Select All
                </button>
                <span style={{ color: "var(--user-form-subtext)" }}>|</span>
                <button
                  type="button"
                  onClick={handleClearLocations}
                  className="cursor-pointer hover:underline text-xs"
                  style={{ color: "var(--user-form-subtext)" }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Search input if more than 5 locations */}
          {locations.length > 5 && (
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--user-form-subtext)" }}
              />
              <input
                type="text"
                placeholder="Search locations..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none transition-all"
                style={{
                  background: "var(--user-form-input-bg)",
                  border: "1px solid var(--user-form-input-border)",
                  color: "var(--user-form-text)",
                }}
              />
            </div>
          )}

          <div
            className="p-3 rounded-lg max-h-56 overflow-y-auto space-y-1.5"
            style={{
              background: "var(--user-form-muted-bg)",
              border: "1px solid var(--user-form-border)",
            }}
          >
            {isLoadingLocations ? (
              <p className="text-sm p-2" style={{ color: "var(--user-form-subtext)" }}>
                Loading locations...
              </p>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => {
                const isChecked = (formData.location_ids || [])
                  .map(String)
                  .includes(loc.id.toString());
                return (
                  <label
                    key={loc.id}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    style={{ color: "var(--user-form-text)" }}
                  >
                    <input
                      type="checkbox"
                      name="location_ids"
                      value={loc.id.toString()}
                      checked={isChecked}
                      onChange={handleLocationChange}
                      className="h-4 w-4 rounded cursor-pointer"
                      style={{ accentColor: "var(--user-form-success)" }}
                    />
                    <span className="text-sm font-medium">{loc.name}</span>
                  </label>
                );
              })
            ) : (
              <p className="text-sm p-2" style={{ color: "var(--user-form-subtext)" }}>
                {locations.length === 0
                  ? "No locations available."
                  : "No matching locations found."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-[var(--user-form-border)]">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="cursor-pointer px-6 py-2.5 text-sm font-semibold rounded-lg"
          style={{ background: "var(--user-form-cancel-bg)", color: "var(--user-form-cancel-text)" }}
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={isLoadingData || !isFormValid() || !canSubmit}
          className="cursor-pointer px-6 py-2.5 text-sm font-semibold rounded-lg disabled:opacity-50"
          style={{ background: "var(--user-form-submit-bg)", color: "var(--user-form-submit-text)" }}
        >
          {isEditing ? "SAVE CHANGES" : "CREATE USER"}
        </button>
      </div>
    </form>
  );
}