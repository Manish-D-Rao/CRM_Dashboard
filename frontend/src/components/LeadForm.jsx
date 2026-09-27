import { useState } from "react";
import { createLead, updateLead } from "../services/leadService";
import { crmStyles } from "../styles/crmStyles.js";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  source: "Website",
  status: "New",
};

function LeadForm({ lead, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(() =>
    lead
      ? {
          name: lead.name || "",
          company: lead.company || "",
          email: lead.email || "",
          phone: lead.phone || "",
          industry: lead.industry || "",
          source: lead.source || "Website",
          status: lead.status || "New",
        }
      : { ...initialForm },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(lead);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        industry: formData.industry.trim() || null,
        source: formData.source,
        status: formData.status,
      };

      const savedLead = isEditing
        ? await updateLead(lead.id, payload)
        : await createLead(payload);

      onSuccess(savedLead);
    } catch (err) {
      console.error("Failed to save lead:", err);
      setError(
        err.message ||
          (isEditing
            ? "Unable to update lead. Please try again."
            : "Unable to create lead. Please try again."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={crmStyles.modalOverlay}>
      <div className={crmStyles.modal}>
        {/* Header */}
        <div className={crmStyles.modalHeader}>
          <h2 className="text-lg font-semibold text-[#27242A] dark:text-[#F3F3F3]">
            {isEditing ? "Edit Lead" : "Add Lead"}
          </h2>

          <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
            {isEditing
              ? "Update the lead information."
              : "Add a new sales lead."}
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
                placeholder="Enter lead name"
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
                placeholder="Enter company name"
                className={crmStyles.formControl}
              />
            </div>

            {/* Industry */}
            <div>
              <label className={crmStyles.formLabel}>
                Industry
                <span className="ml-1 font-normal text-[#918B94] dark:text-[#A7A3AA]">
                  (optional)
                </span>
              </label>

              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Technology"
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
                placeholder="name@company.com"
                className={crmStyles.formControl}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={crmStyles.formLabel}>
                Phone
                <span className="ml-1 font-normal text-[#918B94] dark:text-[#A7A3AA]">
                  (optional)
                </span>
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={crmStyles.formControl}
              />
            </div>

            {/* Source + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={crmStyles.formLabel}>Source</label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className={crmStyles.formControl}
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email">Email</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={crmStyles.formLabel}>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={crmStyles.formControl}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`${crmStyles.modalFooter} px-6 pb-6 pt-5`}>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className={crmStyles.secondaryButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={crmStyles.primaryButton}
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeadForm;
