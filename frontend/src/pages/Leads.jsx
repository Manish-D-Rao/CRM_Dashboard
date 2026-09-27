import { useEffect, useState } from "react";
import { getLeads, deleteLead, convertLead } from "../services/leadService";

import LeadTable from "../components/LeadTable";
import LeadForm from "../components/LeadForm";
import { crmStyles } from "../styles/crmStyles.js";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        console.error("Failed to load leads:", err);
        setError(err.message || "Unable to load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  // CREATE / UPDATE
  const handleFormSuccess = (savedLead) => {
    setLeads((currentLeads) => {
      const exists = currentLeads.some((lead) => lead.id === savedLead.id);

      if (exists) {
        return currentLeads.map((lead) =>
          lead.id === savedLead.id ? savedLead : lead,
        );
      }

      return [savedLead, ...currentLeads];
    });

    setShowForm(false);
    setEditingLead(null);
  };

  // EDIT
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteLead(id);

      setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
    } catch (err) {
      console.error("Failed to delete lead:", err);
      setError(err.message || "Unable to delete lead. Please try again.");
    }
  };

  // CONVERT
  const handleConvert = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to convert this lead?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      const convertedCustomer = await convertLead(id);

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                status: "Converted",
                converted_customer_id: convertedCustomer.id,
              }
            : lead,
        ),
      );
    } catch (err) {
      console.error("Failed to convert lead:", err);
      setError(err.message || "Unable to convert lead. Please try again.");
    }
  };

  // CLOSE FORM
  const handleCancel = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
      {/* Page Header */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#27242A] dark:text-[#F3F3F3]">
              Leads
            </h1>

            <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
              Track and manage your sales leads.
            </p>
          </div>

          {/* Add Lead */}
          <button
            onClick={() => {
              setEditingLead(null);
              setShowForm(true);
            }}
            className={crmStyles.primaryButton}
          >
            + Add Lead
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className={`mt-6 rounded-lg p-4 text-sm ${crmStyles.formError}`}>
          {error}
        </div>
      )}

      {/* Lead List */}
      <section className={`mt-8 overflow-hidden ${crmStyles.card}`}>
        <div className="border-b border-[#D8D3DA] px-6 py-4 dark:border-[#3B383D]">
          <h2 className="font-semibold text-[#27242A] dark:text-[#F3F3F3]">
            Lead List
          </h2>

          <p className="mt-1 text-xs text-[#6F6972] dark:text-[#A7A3AA]">
            Your current sales leads.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[#6F6972] dark:text-[#A7A3AA]">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-[#27242A] dark:text-[#F3F3F3]">
              No leads found
            </p>

            <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
              Leads will appear here once they are added.
            </p>
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvert={handleConvert}
          />
        )}
      </section>

      {/* Lead Form */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}

export default Leads;
