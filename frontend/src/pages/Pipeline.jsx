import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../services/apiError.js";
import { crmStyles, getStatusBadgeClass } from "../styles/crmStyles.js";

const API_URL = "http://127.0.0.1:8000";

const stages = [
  "Lead",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${API_URL}/api/deals/`);

        if (!response.ok) {
          throw new Error(
            await getApiErrorMessage(response, "Unable to load pipeline."),
          );
        }

        const data = await response.json();
        setDeals(data);
      } catch (err) {
        setError(err.message || "Unable to load pipeline.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const groupedDeals = useMemo(() => {
    const grouped = {};

    stages.forEach((stage) => {
      grouped[stage] = [];
    });

    deals.forEach((deal) => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      }
    });

    return grouped;
  }, [deals]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
        <h1 className="text-2xl font-semibold text-[#27242A] dark:text-[#F3F3F3]">
          Pipeline
        </h1>

        <p className="mt-2 text-[#6F6972] dark:text-[#A7A3AA]">
          Loading pipeline...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
        <h1 className="text-2xl font-semibold text-[#27242A] dark:text-[#F3F3F3]">
          Pipeline
        </h1>

        <div className={`mt-6 rounded-lg p-4 ${crmStyles.formError}`}>
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-[#F4F2F5] p-6 dark:bg-[#111111] lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#27242A] dark:text-[#F3F3F3]">
          Sales Pipeline
        </h1>

        <p className="mt-1 text-[#6F6972] dark:text-[#A7A3AA]">
          Track deals through each stage of your sales process.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {stages.map((stage) => {
          const stageDeals = groupedDeals[stage];

          const totalValue = stageDeals.reduce(
            (sum, deal) => sum + Number(deal.value || 0),
            0,
          );

          return (
            <div
              key={stage}
              className="flex min-h-[500px] flex-col rounded-xl border border-[#D8D3DA] bg-[#F0EDF1] dark:border-[#3B383D] dark:bg-[#25232A]"
            >
              {/* Column Header */}
              <div className="rounded-t-xl border-b border-[#D8D3DA] bg-[#FFFFFF] p-4 dark:border-[#3B383D] dark:bg-[#2D2A30]">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[#27242A] dark:text-[#F3F3F3]">
                    {stage}
                  </h2>

                  <span className="rounded-full bg-[#E9E7EA] px-2.5 py-1 text-xs font-medium text-[#5F5962] dark:bg-[#3B383D] dark:text-[#A7A3AA]">
                    {stageDeals.length}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
                  {formatCurrency(totalValue)}
                </p>
              </div>

              {/* Deals */}
              <div className="flex flex-1 flex-col gap-3 p-3">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-[#6F6972] dark:text-[#A7A3AA]">
                      No deals
                    </p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="rounded-lg border border-[#D8D3DA] bg-[#FFFFFF] p-4 shadow-sm dark:border-[#3B383D] dark:bg-[#25232A]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="min-w-0 font-medium text-[#27242A] dark:text-[#F3F3F3]">
                          {deal.title}
                        </h3>

                        <span
                          className={`shrink-0 ${getStatusBadgeClass(stage)}`}
                        >
                          {stage}
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-lg font-semibold text-[#27242A] dark:text-[#F3F3F3]">
                          {formatCurrency(deal.value)}
                        </p>

                        <p className="mt-1 text-sm text-[#6F6972] dark:text-[#A7A3AA]">
                          Probability: {deal.probability}%
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Pipeline;
