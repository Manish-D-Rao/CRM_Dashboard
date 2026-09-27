import { useEffect, useState } from "react";
import { createDeal, updateDeal } from "../services/dealService";
import { getCustomers } from "../services/customerService";
import { crmStyles } from "../styles/crmStyles.js";

function DealForm({ deal, customer, onSuccess, onCancel }) {
  const isEditing = Boolean(deal);
  const customerIsFixed = Boolean(customer) && !isEditing;

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(() => ({
    title: deal?.title || "",
    customer_id: deal ? deal.customer_id || "" : customer?.id || "",
    value: deal?.value ?? "",
    stage: deal?.stage || "Lead",
    probability: deal?.probability ?? 10,
    expected_close_date: deal?.expected_close_date || "",
    owner: deal?.owner || "",
  }));

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers:", err);
        setError(err.message || "Unable to load customers.");
      } finally {
        setLoadingCustomers(false);
      }
    }

    loadCustomers();
  }, []);

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
      setSaving(true);
      setError("");

      const payload = {
        title: formData.title,
        customer_id: formData.customer_id,
        value: Number(formData.value),
        stage: formData.stage,
        probability: Number(formData.probability),
        expected_close_date: formData.expected_close_date || null,
        owner: formData.owner || null,
      };

      if (isEditing) {
        const updatedDeal = await updateDeal(deal.id, payload);

        onSuccess(updatedDeal);
      } else {
        const newDeal = await createDeal(payload);

        onSuccess(newDeal);
      }
    } catch (err) {
      console.error("Failed to save deal:", err);
      setError(
        err.message ||
          (isEditing ? "Unable to update deal." : "Unable to create deal."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={crmStyles.modalOverlay}>
      <div className={crmStyles.modal}>
        {/* Header */}
        <div
          className={`${crmStyles.modalHeader} flex items-center justify-between`}
        >
          <div>
            <h2 className="text-lg font-semibold text-[#27242A] dark:text-[#F3F3F3]">
              {isEditing ? "Edit Deal" : "Add Deal"}
            </h2>

            <p className="mt-1 text-xs text-[#6F6972] dark:text-[#A7A3AA]">
              {isEditing
                ? "Update deal information."
                : "Create a new sales opportunity."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-xl text-[#918B94] hover:text-[#27242A] dark:text-[#A7A3AA] dark:hover:text-[#F3F3F3]"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={`${crmStyles.modalScrollArea} space-y-5 p-6`}>
            {error && (
              <div className={`rounded-lg p-3 text-sm ${crmStyles.formError}`}>
                {error}
              </div>
            )}

            {/* Deal Title */}
            <div>
              <label className={crmStyles.formLabel}>Deal Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                placeholder="e.g. Enterprise CRM"
                className={crmStyles.formControl}
              />
            </div>

            {/* Customer */}
            <div>
              <label className={crmStyles.formLabel}>Customer</label>

              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                required
                disabled={loadingCustomers || customerIsFixed}
                className={crmStyles.formControl}
              >
                <option value="">
                  {loadingCustomers
                    ? "Loading customers..."
                    : "Select customer"}
                </option>

                {customerIsFixed && (
                  <option value={customer.id}>
                    {customer.company || customer.name}
                  </option>
                )}

                {customers
                  .filter(
                    (customerOption) =>
                      !customerIsFixed || customerOption.id !== customer.id,
                  )
                  .map((customerOption) => (
                    <option key={customerOption.id} value={customerOption.id}>
                      {customerOption.company || customerOption.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Value + Probability */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={crmStyles.formLabel}>Deal Value</label>

                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="50000"
                  className={crmStyles.formControl}
                />
              </div>

              <div>
                <label className={crmStyles.formLabel}>Probability (%)</label>

                <input
                  type="number"
                  name="probability"
                  value={formData.probability}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className={crmStyles.formControl}
                />
              </div>
            </div>

            {/* Stage */}
            <div>
              <label className={crmStyles.formLabel}>Stage</label>

              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className={crmStyles.formControl}
              >
                <option value="Lead">Lead</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>

            {/* Expected Close Date */}
            <div>
              <label className={crmStyles.formLabel}>Expected Close Date</label>

              <input
                type="date"
                name="expected_close_date"
                value={formData.expected_close_date}
                onChange={handleChange}
                className={crmStyles.formControl}
              />
            </div>

            {/* Owner */}
            <div>
              <label className={crmStyles.formLabel}>Owner</label>

              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Sales representative"
                className={crmStyles.formControl}
              />
            </div>
          </div>

          {/* Buttons */}
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
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DealForm;
