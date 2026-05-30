import Image from "next/image";
import Link from "next/link";
import "./RelatedSection.css";

export type RelatedItem = {
  id: number;
  name: string;
  subtitle?: string | null;
  image_url?: string | null;
  href?: string;
  onUnlink?: () => void;
};

type RelatedSectionProps = {
  title: string;
  emptyText: string;
  items: RelatedItem[];
  fallbackIcon: string;
  onLinkClick?: () => void;
  onActionClick?: () => void;
  actionLabel?: string;
};

export default function RelatedSection({
  title,
  emptyText,
  items,
  fallbackIcon,
  onLinkClick,
  onActionClick,
  actionLabel = "+ ADD",
}: RelatedSectionProps) {
  const handleActionClick = onActionClick ?? onLinkClick;

  return (
    <section className="related-section">
      <div className="related-section-header">
        <h3>{title}</h3>
      </div>

      {items.length > 0 ? (
        <div className="related-card-list">
          {items.map((item) => {
            const card = (
              <>
                <Image
                  src={item.image_url || fallbackIcon}
                  alt={item.name}
                  width={54}
                  height={54}
                  className="related-card-image"
                />

                <span>
                  <strong>{item.name}</strong>
                  {item.subtitle && <small>{item.subtitle}</small>}
                </span>
              </>
            );

            return (
              <div className="related-card-shell" key={item.id}>
                {item.href ? (
                  <Link className="related-card" href={item.href}>
                    {card}
                  </Link>
                ) : (
                  <button type="button" className="related-card">
                    {card}
                  </button>
                )}

                {item.onUnlink && (
                  <button
                    type="button"
                    className="related-unlink-button"
                    onClick={item.onUnlink}
                    aria-label={`Unlink ${item.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="related-empty">{emptyText}</p>
      )}

      <button
        type="button"
        className="related-section-action"
        onClick={handleActionClick}
      >
        {actionLabel}
      </button>
    </section>
  );
}