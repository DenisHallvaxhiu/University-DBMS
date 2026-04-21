export default function DeleteConfirmModal({
  isOpen,
  itemName,
  isDeleting,
  onClose,
  onConfirm,
  entityName = "item",
  relatedRecordsText = "This will also delete related records.",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">
            Delete {entityName}?
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-200">{itemName}</span>?
          </p>

          <p className="mt-2 text-sm text-red-300">{relatedRecordsText}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
