import { crmStyles, getStatusBadgeClass } from "../styles/crmStyles.js";

function DealDetails({ deal, onEdit, onDelete, onClose }) {
  if (!deal) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  return (
    <div className={crmStyles.modalOverlay}>
      <div className={crmStyles.modal}>
        {/* Header */}
        <div
          className={`${crmStyles.modalHeader} flex items-center justify-between`}
        >
          <div>
            <h2 className={`text-lg font-semibold ${crmStyles.primaryText}`}>
              Deal Details
            </h2>

            <p className={`mt-1 text-xs ${crmStyles.secondaryText}`}>
              View information about this sales opportunity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#918B94] transition-colors hover:text-[#27242A] dark:text-[#A7A3AA] dark:hover:text-[#F3F3F3]"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className={`${crmStyles.modalScrollArea} space-y-5 p-6`}>
          {/* Deal */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
            >
              Deal
            </p>

            <p
              className={`mt-1 text-lg font-semibold ${crmStyles.primaryText}`}
            >
              {deal.title}
            </p>
          </div>

          {/* Company */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
            >
              Company
            </p>

            <p className={`mt-1 text-sm ${crmStyles.primaryText}`}>
              {deal.company || "-"}
            </p>
          </div>

          {/* Value + Probability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
              >
                Deal Value
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${crmStyles.primaryText}`}
              >
                {formatCurrency(deal.value)}
              </p>
            </div>

            <div>
              <p
                className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
              >
                Probability
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${crmStyles.primaryText}`}
              >
                {deal.probability}%
              </p>
            </div>
          </div>

          {/* Stage */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
            >
              Stage
            </p>

            <span className={`mt-2 ${getStatusBadgeClass(deal.stage)}`}>
              {deal.stage}
            </span>
          </div>

          {/* Expected Close Date */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
            >
              Expected Close Date
            </p>

            <p className={`mt-1 text-sm ${crmStyles.primaryText}`}>
              {deal.expected_close_date || "-"}
            </p>
          </div>

          {/* Owner */}
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${crmStyles.secondaryText}`}
            >
              Owner
            </p>

            <p className={`mt-1 text-sm ${crmStyles.primaryText}`}>
              {deal.owner || "-"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={`${crmStyles.modalFooter} px-6 py-4`}>
          <button
            type="button"
            onClick={onClose}
            className={crmStyles.secondaryButton}
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(deal);
            }}
            className={crmStyles.editButton}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(deal.id);
            }}
            className={crmStyles.destructiveButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DealDetails;
