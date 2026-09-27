import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../services/customerService";

import CustomerTable from "../components/CustomerTable";
import CustomerForm from "../components/CustomerForm";
import DealForm from "../components/DealForm";
import { crmStyles } from "../styles/crmStyles.js";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedCustomerForDeal, setSelectedCustomerForDeal] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers:", err);
        setError(err.message || "Unable to load customers. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  // CREATE / UPDATE
  const handleFormSuccess = (savedCustomer) => {
    setCustomers((currentCustomers) => {
      const exists = currentCustomers.some(
        (customer) => customer.id === savedCustomer.id,
      );

      if (exists) {
        return currentCustomers.map((customer) =>
          customer.id === savedCustomer.id ? savedCustomer : customer,
        );
      }

      return [savedCustomer, ...currentCustomers];
    });

    setShowForm(false);
    setEditingCustomer(null);
  };

  // EDIT
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCreateDeal = (customer) => {
    setError(null);
    setSuccessMessage("");
    setSelectedCustomerForDeal(customer);
    setShowDealForm(true);
  };

  const handleDealSuccess = (savedDeal) => {
    setShowDealForm(false);
    setSelectedCustomerForDeal(null);
    setSuccessMessage(`Deal "${savedDeal.title}" created successfully.`);
  };

  const handleDealCancel = () => {
    setShowDealForm(false);
    setSelectedCustomerForDeal(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      await deleteCustomer(id);

      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer.id !== id),
      );
    } catch (err) {
      console.error("Failed to delete customer:", err);
      setError(err.message || "Unable to delete customer. Please try again.");
    }
  };

  // CLOSE FORM
  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
      {/* Page Header */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#27242A] dark:text-[#F3F3F3]">
              Customers
            </h1>

            <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
              Manage and track your customers.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCustomer(null);
              setShowForm(true);
            }}
            className={crmStyles.primaryButton}
          >
            + Add Customer
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className={`mt-6 rounded-lg p-4 text-sm ${crmStyles.formError}`}>
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className={`mt-6 rounded-lg border p-4 text-sm ${crmStyles.successNotice}`}
        >
          {successMessage}
        </div>
      )}

      {/* Customer List */}
      <section className={`mt-8 overflow-hidden ${crmStyles.card}`}>
        <div className="border-b border-[#D8D3DA] px-6 py-4 dark:border-[#3B383D]">
          <h2 className="font-semibold text-[#27242A] dark:text-[#F3F3F3]">
            Customer List
          </h2>

          <p className="mt-1 text-xs text-[#6F6972] dark:text-[#A7A3AA]">
            Your current customers.
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[#6F6972] dark:text-[#A7A3AA]">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-[#27242A] dark:text-[#F3F3F3]">
              No customers found
            </p>

            <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
              Add your first customer to get started.
            </p>
          </div>
        ) : (
          <CustomerTable
            customers={customers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateDeal={handleCreateDeal}
          />
        )}
      </section>

      {/* Customer Form */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      {showDealForm && selectedCustomerForDeal && (
        <DealForm
          customer={selectedCustomerForDeal}
          onSuccess={handleDealSuccess}
          onCancel={handleDealCancel}
        />
      )}
    </main>
  );
}

export default Customers;
