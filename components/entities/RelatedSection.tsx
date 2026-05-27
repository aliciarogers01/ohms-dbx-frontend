import Image from "next/image";
import Link from "next/link";
import "./RelatedSection.css";

export type RelatedItem = {
  id: number;
  name: string;
  subtitle?: string | null;
  image_url?: string | null;
  href?: string;
};

type RelatedSectionProps = {
  title: string;
  emptyText: string;
  items: RelatedItem[];
  fallbackIcon: string;
  onLinkClick?: () => void;
  actionLabel?: string;
};

export default function RelatedSection({
  title,
  emptyText,
  items,
  fallbackIcon,
  onLinkClick,
  actionLabel = "+ ADD",
}: RelatedSectionProps) {
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

            return item.href ? (
              <Link className="related-card" href={item.href} key={item.id}>
                {card}
              </Link>
            ) : (
              <button type="button" className="related-card" key={item.id}>
                {card}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="related-empty">{emptyText}</p>
      )}

      <button type="button" className="related-section-action" onClick={onLinkClick}>
        {actionLabel}
      </button>
    </section>
  );
}