import { crmStyles, getStatusBadgeClass } from "../styles/crmStyles.js";

function LeadTable({ leads, onEdit, onDelete, onConvert }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className={crmStyles.tableHeader}>
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Industry</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Source</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className={crmStyles.tableRow}>
              <td className={`px-6 py-4 font-medium ${crmStyles.primaryText}`}>
                {lead.name}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {lead.company}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {lead.industry || "-"}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {lead.email}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {lead.source}
              </td>

              <td className="px-6 py-4">
                <span className={getStatusBadgeClass(lead.status)}>
                  {lead.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className={`${crmStyles.actionBase} ${crmStyles.actions.edit}`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onConvert(lead.id)}
                    disabled={lead.status === "Converted"}
                    className={`${crmStyles.actionBase} ${crmStyles.actions.convert} disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    Convert
                  </button>

                  <button
                    onClick={() => onDelete(lead.id)}
                    className={`${crmStyles.actionBase} ${crmStyles.actions.delete}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
