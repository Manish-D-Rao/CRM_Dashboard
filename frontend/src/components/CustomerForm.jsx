import { useState } from "react";
import { createCustomer, updateCustomer } from "../services/customerService";
import { crmStyles } from "../styles/crmStyles.js";

function CustomerForm({ customer, onSuccess, onCancel }) {
  const isEditing = Boolean(customer);

  const [formData, setFormData] = useState(() => ({
    name: customer?.name || "",
    company: customer?.company || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    industry: customer?.industry || "",
    status: customer?.status || "Active",
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      let savedCustomer;

      if (isEditing) {
        savedCustomer = await updateCustomer(customer.id, formData);
      } else {
        savedCustomer = await createCustomer(formData);
      }

      onSuccess(savedCustomer);
    } catch (err) {
      console.error("Failed to save customer:", err);
      setError(
        err.message ||
          (isEditing
            ? "Unable to update customer. Please try again."
            : "Unable to create customer. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={crmStyles.modalOverlay}>
      <div className={crmStyles.modal}>
        {/* Header */}
        <div className={crmStyles.modalHeader}>
          <h2 className="text-lg font-semibold text-[#27242A] dark:text-[#F3F3F3]">
            {isEditing ? "Edit Customer" : "Add Customer"}
          </h2>

          <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
            {isEditing
              ? "Update customer information."
              : "Add a new customer to your CRM."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={`${crmStyles.modalScrollArea} space-y-5 p-6`}>
            {error && (
              <div className={`rounded-lg p-3 text-sm ${crmStyles.formError}`}>
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className={crmStyles.formLabel}>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                placeholder="Customer name"
                className={crmStyles.formControl}
              />
            </div>

            {/* Company */}
            <div>
              <label className={crmStyles.formLabel}>Company</label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                placeholder="Company name"
                className={crmStyles.formControl}
              />
            </div>

            {/* Email */}
            <div>
              <label className={crmStyles.formLabel}>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={150}
                placeholder="customer@example.com"
                className={crmStyles.formControl}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={crmStyles.formLabel}>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className={crmStyles.formControl}
              />
            </div>

            {/* Industry */}
            <div>
              <label className={crmStyles.formLabel}>Industry</label>

              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Technology"
                className={crmStyles.formControl}
              />
            </div>

            {/* Status */}
            <div>
              <label className={crmStyles.formLabel}>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={crmStyles.formControl}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className={`${crmStyles.modalFooter} px-6 pb-6 pt-5`}>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={crmStyles.secondaryButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={crmStyles.primaryButton}
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Customer"
                  : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;
