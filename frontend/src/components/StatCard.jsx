import { crmStyles } from "../styles/crmStyles.js";

function StatCard({ title, value, change }) {
  return (
    <article className={`${crmStyles.card} p-6`}>
      <p className={`text-sm font-medium ${crmStyles.secondaryText}`}>
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-bold tracking-tight ${crmStyles.primaryText}`}
      >
        {value}
      </p>

      <p className={`mt-2 text-xs ${crmStyles.secondaryText}`}>{change}</p>
    </article>
  );
}

export default StatCard;
