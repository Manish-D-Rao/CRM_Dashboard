import { crmStyles, getStatusBadgeClass } from "../styles/crmStyles.js";

function CustomerTable({ customers, onEdit, onDelete, onCreateDeal }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className={crmStyles.tableHeader}>
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Phone</th>
            <th className="px-6 py-3 font-medium">Industry</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className={crmStyles.tableRow}>
              <td className={`px-6 py-4 font-medium ${crmStyles.primaryText}`}>
                {customer.name}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {customer.company}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {customer.email}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {customer.phone || "-"}
              </td>

              <td className={`px-6 py-4 ${crmStyles.secondaryText}`}>
                {customer.industry || "-"}
              </td>

              <td className="px-6 py-4">
                <span className={getStatusBadgeClass(customer.status)}>
                  {customer.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onCreateDeal(customer)}
                    className={`${crmStyles.actionBase} ${crmStyles.actions.neutral}`}
                  >
                    Create Deal
                  </button>

                  <button
                    onClick={() => onEdit(customer)}
                    className={`${crmStyles.actionBase} ${crmStyles.actions.edit}`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(customer.id)}
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

export default CustomerTable;
