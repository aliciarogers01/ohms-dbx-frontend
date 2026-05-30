"use client";

import "./RelatedActionMenu.css";

type RelatedActionMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddNew: () => void;
  onSearchExisting: () => void;
  addLabel: string;
  searchLabel: string;
};

export default function RelatedActionMenu({
  isOpen,
  onClose,
  onAddNew,
  onSearchExisting,
  addLabel,
  searchLabel,
}: RelatedActionMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="related-action-backdrop" onClick={onClose}>
      <div
        className="related-action-menu"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onAddNew}>
          {addLabel}
        </button>

        <button type="button" onClick={onSearchExisting}>
          {searchLabel}
        </button>
      </div>
    </div>
  );
}
