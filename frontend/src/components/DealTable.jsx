const deals = [
  {
    company: "Acme Corporation",
    deal: "Enterprise CRM",
    value: "₹5,00,000",
    stage: "Negotiation",
  },
  {
    company: "TechNova",
    deal: "Sales Platform",
    value: "₹3,20,000",
    stage: "Proposal",
  },
  {
    company: "GlobalSoft",
    deal: "CRM Integration",
    value: "₹1,80,000",
    stage: "Qualified",
  },
];

function DealTable() {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold text-gray-900">
          Recent Deals
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Deal</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Stage</th>
            </tr>
          </thead>

          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal.deal}
                className="border-t border-gray-100"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {deal.company}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {deal.deal}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {deal.value}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {deal.stage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DealTable;