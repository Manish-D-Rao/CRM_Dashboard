export const crmStyles = {
  modalOverlay:
    "fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto overscroll-contain bg-black/40 p-4",
  card: "rounded-xl border border-[#D8D3DA] bg-[#FFFFFF] dark:border-[#3B383D] dark:bg-[#25232A]",
  modal:
    "flex min-h-0 max-h-[min(90vh,calc(100dvh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#D8D3DA] bg-[#FFFFFF] shadow-xl dark:border-[#3B383D] dark:bg-[#25232A]",
  modalHeader:
    "shrink-0 border-b border-[#D8D3DA] px-6 py-4 dark:border-[#3B383D]",
  modalScrollArea:
    "crm-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain",
  modalFooter:
    "flex shrink-0 justify-end gap-3 border-t border-[#D8D3DA] dark:border-[#3B383D]",
  tableHeader:
    "bg-[#F0EDF1] text-xs uppercase tracking-wide text-[#6F6972] dark:bg-[#2D2A30] dark:text-[#A7A3AA]",
  tableRow:
    "border-t border-[#E3DFE5] transition-colors hover:bg-[#F4F2F5] dark:border-[#3B383D] dark:hover:bg-[#2D2A30]",
  primaryText: "text-[#27242A] dark:text-[#F3F3F3]",
  secondaryText: "text-[#6F6972] dark:text-[#A7A3AA]",
  formLabel:
    "mb-1.5 block text-sm font-medium text-[#27242A] dark:text-[#F3F3F3]",
  formControl:
    "w-full rounded-lg border border-[#D8D3DA] bg-[#FFFFFF] px-3 py-2.5 text-sm text-[#27242A] outline-none transition placeholder:text-[#918B94] focus:border-[#7445D8] focus:ring-1 focus:ring-[#7445D8]/25 dark:border-[#3B383D] dark:bg-[#2D2A30] dark:text-[#F3F3F3] dark:placeholder:text-[#77727A] dark:focus:border-[#8050E8] dark:focus:ring-[#8050E8]/40",
  formError:
    "border border-[#E4C7C9] bg-[#F1DEDF] text-[#9A555A] dark:border-[#6B454A] dark:bg-[#36262A] dark:text-[#D9A2A5]",
  successNotice:
    "border border-[#C9D8CB] bg-[#DFE8E0] text-[#58705D] dark:border-[#3D5544] dark:bg-[#28372D] dark:text-[#BCC9BD]",
  primaryButton:
    "rounded-lg bg-[#27242A] px-4 py-2 text-sm font-medium text-[#FFFFFF] transition-colors hover:bg-[#3B383D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7445D8]/40 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8050E8] dark:text-[#F3F3F3] dark:hover:bg-[#8D62EA] dark:focus-visible:ring-[#8050E8]/40",
  secondaryButton:
    "rounded-lg border border-[#D8D3DA] px-4 py-2 text-sm font-medium text-[#6F6972] transition-colors hover:bg-[#F0EDF1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7445D8]/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#3B383D] dark:text-[#A7A3AA] dark:hover:bg-[#2D2A30] dark:focus-visible:ring-[#8050E8]/40",
  editButton:
    "rounded-lg bg-[#E8DFFF] px-4 py-2 text-sm font-medium text-[#6339BD] transition-colors hover:bg-[#DDD6E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7445D8]/40 dark:bg-[#8050E8]/20 dark:text-[#C4B0F2] dark:hover:bg-[#8050E8]/30 dark:focus-visible:ring-[#8050E8]/40",
  destructiveButton:
    "rounded-lg bg-[#F1DEDF] px-4 py-2 text-sm font-medium text-[#9A555A] transition-colors hover:bg-[#E4C7C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A555A]/30 dark:bg-[#36262A] dark:text-[#D9A2A5] dark:hover:bg-[#6B454A] dark:focus-visible:ring-[#D9A2A5]/30",
  badgeBase:
    "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
  actionBase:
    "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7445D8]/40 dark:focus-visible:ring-[#8050E8]/40",
  actions: {
    neutral:
      "bg-[#F0EDF1] text-[#6F6972] hover:bg-[#E8E5EA] dark:bg-[#2D2A30] dark:text-[#A7A3AA] dark:hover:bg-[#3B383D]",
    edit: "bg-[#E8DFFF] text-[#6339BD] hover:bg-[#DDD6E8] dark:bg-[#8050E8]/20 dark:text-[#C4B0F2] dark:hover:bg-[#8050E8]/30",
    convert:
      "bg-[#DFE8E0] text-[#58705D] hover:brightness-95 dark:bg-[#BCC9BD]/15 dark:text-[#BCC9BD] dark:hover:bg-[#BCC9BD]/25",
    delete:
      "bg-[#F1DEDF] text-[#9A555A] hover:bg-[#E4C7C9] dark:bg-[#36262A] dark:text-[#D9A2A5] dark:hover:bg-[#6B454A]",
  },
};

const statusColors = {
  new: "bg-[#E6EDF6] text-[#526B88] dark:bg-[#263340] dark:text-[#B5C9E0]",
  prospect: "bg-[#E6EDF6] text-[#526B88] dark:bg-[#263340] dark:text-[#B5C9E0]",
  contacted:
    "bg-[#F4EBC9] text-[#8A7020] dark:bg-[#3A3320] dark:text-[#E7CA63]",
  pending: "bg-[#F4EBC9] text-[#8A7020] dark:bg-[#3A3320] dark:text-[#E7CA63]",
  qualified:
    "bg-[#DFE8E0] text-[#58705D] dark:bg-[#28372D] dark:text-[#BCC9BD]",
  active: "bg-[#DFE8E0] text-[#58705D] dark:bg-[#28372D] dark:text-[#BCC9BD]",
  success: "bg-[#DFE8E0] text-[#58705D] dark:bg-[#28372D] dark:text-[#BCC9BD]",
  won: "bg-[#DFE8E0] text-[#58705D] dark:bg-[#28372D] dark:text-[#BCC9BD]",
  "closed won":
    "bg-[#DFE8E0] text-[#58705D] dark:bg-[#28372D] dark:text-[#BCC9BD]",
  converted:
    "bg-[#E8DFFF] text-[#6339BD] dark:bg-[#8050E8]/20 dark:text-[#C4B0F2]",
  lost: "bg-[#F1DEDF] text-[#9A555A] dark:bg-[#36262A] dark:text-[#D9A2A5]",
  failed: "bg-[#F1DEDF] text-[#9A555A] dark:bg-[#36262A] dark:text-[#D9A2A5]",
  deleted: "bg-[#F1DEDF] text-[#9A555A] dark:bg-[#36262A] dark:text-[#D9A2A5]",
  "closed lost":
    "bg-[#F1DEDF] text-[#9A555A] dark:bg-[#36262A] dark:text-[#D9A2A5]",
  negotiation:
    "bg-[#F4EBC9] text-[#8A7020] dark:bg-[#3A3320] dark:text-[#E7CA63]",
  lead: "bg-[#E9E7EA] text-[#5F5962] dark:bg-[#3B383D] dark:text-[#BCC9BD]",
  proposal: "bg-[#E9E7EA] text-[#5F5962] dark:bg-[#3B383D] dark:text-[#A7A3AA]",
  inactive: "bg-[#E9E7EA] text-[#5F5962] dark:bg-[#3B383D] dark:text-[#A7A3AA]",
  neutral: "bg-[#E9E7EA] text-[#5F5962] dark:bg-[#3B383D] dark:text-[#A7A3AA]",
};

export function getStatusBadgeClass(status) {
  const key = String(status || "").toLowerCase();
  return `${crmStyles.badgeBase} ${statusColors[key] || statusColors.neutral}`;
}
