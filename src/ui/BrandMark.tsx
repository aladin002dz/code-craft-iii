/**
 * Code Craft mark: code brackets around a cut gem. The brackets stand for code, the faceted
 * gem for craft. public/favicon.svg draws the same shape for the browser tab.
 */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#14203a" />
      <path d="M10.5 10 5.5 16l5 6M21.5 10l5 6-5 6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10.5 20 16l-4 5.5-4-5.5Z" fill="#2f6fe8" />
      <path d="M16 10.5 20 16h-8Z" fill="#8db4ff" />
      <path d="M12 16h8" stroke="#14203a" strokeWidth="0.6" opacity="0.35" />
    </svg>
  )
}
