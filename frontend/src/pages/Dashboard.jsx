import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { crmStyles, getStatusBadgeClass } from "../styles/crmStyles.js";

import { getDeals } from "../services/dealService";
import { getLeads } from "../services/leadService";
import { getCustomers } from "../services/customerService";

function Dashboard() {
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [dealsData, leadsData, customersData] = await Promise.all([
          getDeals(),
          getLeads(),
          getCustomers(),
        ]);

        setDeals(dealsData);
        setLeads(leadsData);
        setCustomers(customersData);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(
          err.message || "Unable to load dashboard data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const totalDeals = deals.length;

    const pipelineValue = deals.reduce(
      (total, deal) => total + Number(deal.value || 0),
      0,
    );

    const wonDeals = deals.filter(
      (deal) => deal.stage?.toLowerCase() === "closed won",
    );

    const closedDeals = deals.filter((deal) =>
      ["closed won", "closed lost"].includes(deal.stage?.toLowerCase()),
    );

    const totalRevenue = wonDeals.reduce(
      (total, deal) => total + Number(deal.value || 0),
      0,
    );

    const winRate =
      closedDeals.length > 0
        ? Math.round((wonDeals.length / closedDeals.length) * 100)
        : 0;

    const totalLeads = leads.length;

    const convertedLeads = leads.filter(
      (lead) => lead.status?.toLowerCase() === "converted",
    );

    const leadConversionRate =
      totalLeads > 0
        ? Math.round((convertedLeads.length / totalLeads) * 100)
        : 0;

    const totalCustomers = customers.length;

    return {
      totalDeals,
      pipelineValue,
      totalRevenue,
      winRate,
      totalLeads,
      totalCustomers,
      leadConversionRate,
    };
  }, [deals, leads, customers]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
      {/* Page Header */}
      <section>
        <h1 className="text-2xl font-bold text-[#27242A] dark:text-[#F3F3F3]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
          Here's an overview of your sales performance.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className={`mt-6 rounded-lg p-4 text-sm ${crmStyles.formError}`}
        >
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : formatCurrency(metrics.totalRevenue)}
          change="Closed deals"
        />

        <StatCard
          title="Pipeline Value"
          value={loading ? "..." : formatCurrency(metrics.pipelineValue)}
          change="Current pipeline"
        />

        <StatCard
          title="Total Leads"
          value={loading ? "..." : metrics.totalLeads}
          change={`${metrics.leadConversionRate}% converted`}
        />

        <StatCard
          title="Total Customers"
          value={loading ? "..." : metrics.totalCustomers}
          change="Current customers"
        />
      </section>

      {/* Secondary Metrics */}
      <section className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard
          title="Total Deals"
          value={loading ? "..." : metrics.totalDeals}
          change="All deals"
        />

        <StatCard
          title="Win Rate"
          value={loading ? "..." : `${metrics.winRate}%`}
          change="Won / closed deals"
        />
      </section>

      {/* Recent Deals */}
      <section className={`mt-8 overflow-hidden ${crmStyles.card}`}>
        <div className="flex items-center justify-between border-b border-[#D8D3DA] px-6 py-4 dark:border-[#3B383D]">
          <div>
            <h2 className="font-semibold text-[#27242A] dark:text-[#F3F3F3]">
              Recent Deals
            </h2>

            <p className="mt-1 text-xs text-[#6F6972] dark:text-[#A7A3AA]">
              Latest opportunities in your sales pipeline.
            </p>
          </div>

          <span className="rounded-full bg-[#E9E7EA] px-3 py-1 text-xs font-medium text-[#5F5962] dark:bg-[#3B383D] dark:text-[#BCC9BD]">
            {loading ? "Loading..." : `${deals.length} deals`}
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-[#6F6972] dark:text-[#A7A3AA]">
            Loading deals...
          </div>
        ) : deals.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-[#27242A] dark:text-[#F3F3F3]">
              No deals found
            </p>

            <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
              Create your first deal to start tracking your sales pipeline.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={crmStyles.tableHeader}>
                <tr>
                  <th className="px-6 py-3 font-medium">Company</th>

                  <th className="px-6 py-3 font-medium">Deal</th>

                  <th className="px-6 py-3 font-medium">Value</th>

                  <th className="px-6 py-3 font-medium">Stage</th>
                </tr>
              </thead>

              <tbody>
                {deals.slice(0, 10).map((deal) => (
                  <tr key={deal.id} className={crmStyles.tableRow}>
                    <td
                      className={`px-6 py-4 font-medium ${crmStyles.primaryText}`}
                    >
                      {deal.company || "-"}
                    </td>

                    <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                      {deal.title}
                    </td>

                    <td
                      className={`px-6 py-4 font-medium ${crmStyles.primaryText}`}
                    >
                      {formatCurrency(Number(deal.value || 0))}
                    </td>

                    <td className="px-6 py-4">
                      <span className={getStatusBadgeClass(deal.stage)}>
                        {deal.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
