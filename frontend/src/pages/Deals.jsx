import { useEffect, useState } from "react";
import { getDeals, deleteDeal } from "../services/dealService";
import DealTable from "../components/DealTable";
import DealForm from "../components/DealForm";
import DealDetails from "../components/DealDetails";
import { crmStyles } from "../styles/crmStyles.js";

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        const data = await getDeals();
        setDeals(data);
      } catch (err) {
        console.error("Failed to load deals:", err);
        setError(err.message || "Unable to load deals. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  // CREATE / UPDATE
  const handleFormSuccess = (savedDeal) => {
    setDeals((currentDeals) => {
      const exists = currentDeals.some((deal) => deal.id === savedDeal.id);

      if (exists) {
        return currentDeals.map((deal) =>
          deal.id === savedDeal.id ? savedDeal : deal,
        );
      }

      return [savedDeal, ...currentDeals];
    });

    setShowForm(false);
    setEditingDeal(null);
  };

  // EDIT
  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleView = (deal) => {
    setSelectedDeal(deal);
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deal?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteDeal(id);

      setDeals((currentDeals) => currentDeals.filter((deal) => deal.id !== id));
    } catch (err) {
      console.error("Failed to delete deal:", err);
      setError(err.message || "Unable to delete deal. Please try again.");
    }
  };

  // CLOSE FORM
  const handleCancel = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
      {/* Page Header */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${crmStyles.primaryText}`}>
              Deals
            </h1>

            <p className={`mt-1 text-sm ${crmStyles.secondaryText}`}>
              Manage and track your sales opportunities.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingDeal(null);
              setShowForm(true);
            }}
            className={crmStyles.primaryButton}
          >
            + Add Deal
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className={`mt-6 rounded-lg p-4 text-sm ${crmStyles.formError}`}>
          {error}
        </div>
      )}

      {/* Deal List */}
      <section className={`mt-8 overflow-hidden ${crmStyles.card}`}>
        <div className="border-b border-[#D8D3DA] px-6 py-4 dark:border-[#3B383D]">
          <h2 className={`font-semibold ${crmStyles.primaryText}`}>
            Deal List
          </h2>

          <p className={`mt-1 text-xs ${crmStyles.secondaryText}`}>
            Current opportunities in your sales pipeline.
          </p>
        </div>

        {loading ? (
          <div
            className={`px-6 py-12 text-center text-sm ${crmStyles.secondaryText}`}
          >
            Loading deals...
          </div>
        ) : deals.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className={`font-medium ${crmStyles.primaryText}`}>
              No deals found
            </p>

            <p className={`mt-1 text-sm ${crmStyles.secondaryText}`}>
              Create your first deal to start tracking opportunities.
            </p>
          </div>
        ) : (
          <DealTable
            deals={deals}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      {/* Deal Form */}
      {showForm && (
        <DealForm
          deal={editingDeal}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}
      {selectedDeal && (
        <DealDetails
          deal={selectedDeal}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </main>
  );
}

export default Deals;
