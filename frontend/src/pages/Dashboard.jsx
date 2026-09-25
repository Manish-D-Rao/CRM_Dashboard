import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { getDeals } from "../services/dealService";

function Dashboard() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDeals();
        setDeals(data);
      } catch (err) {
        console.error("Failed to load deals:", err);
        setError("Unable to load deals. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  const metrics = useMemo(() => {
    const totalDeals = deals.length;

    const pipelineValue = deals.reduce(
      (total, deal) => total + Number(deal.value || 0),
      0
    );

    const closedDeals = deals.filter(
      (deal) => deal.stage?.toLowerCase() === "closed"
    );

    const totalRevenue = closedDeals.reduce(
      (total, deal) => total + Number(deal.value || 0),
      0
    );

    const winRate =
      totalDeals > 0
        ? Math.round((closedDeals.length / totalDeals) * 100)
        : 0;

    return {
      totalDeals,
      pipelineValue,
      totalRevenue,
      winRate,
    };
  }, [deals]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-8">
      {/* Page Header */}
      <section>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your sales performance.
        </p>
      </section>

      {/* Error State */}
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={
            loading
              ? "..."
              : formatCurrency(metrics.totalRevenue)
          }
          change="Closed deals"
        />

        <StatCard
          title="Pipeline Value"
          value={
            loading
              ? "..."
              : formatCurrency(metrics.pipelineValue)
          }
          change="Current pipeline"
        />

        <StatCard
          title="Total Deals"
          value={loading ? "..." : metrics.totalDeals}
          change="All deals"
        />

        <StatCard
          title="Win Rate"
          value={loading ? "..." : `${metrics.winRate}%`}
          change="Closed / total"
        />
      </section>

      {/* Recent Deals */}
      <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Deals
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Latest opportunities in your sales pipeline.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {loading ? "Loading..." : `${deals.length} deals`}
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Loading deals...
          </div>
        ) : deals.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-gray-900">
              No deals found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Create your first deal to start tracking your sales pipeline.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">
                    Company
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Deal
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Value
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Stage
                  </th>
                </tr>
              </thead>

              <tbody>
                {deals.slice(0, 10).map((deal) => (
                  <tr
                    key={deal._id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {deal.company}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {deal.title}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(Number(deal.value || 0))}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
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
