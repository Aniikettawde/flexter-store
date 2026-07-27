export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const PRODUCT = {
  id: "flexter-compression-tee-black",
  name: "Flexter Compression Tee",
  colorway: "Jet Black",
  price: 699,
  currency: "INR",
  sku: "FLX-CMP-001-BLK",
  fabric: "88% Nylon / 12% Elastane, 4-way compression stretch",
  fit: "Second-skin compression fit, true to size",
  care: "Cold machine wash, no bleach, hang dry, do not iron over print",
  description:
    "Built for the last rep, not the first. Four-way stretch compression fabric holds muscle in place, wicks sweat, and moves with you through every set. The Flexter mark sits printed, not stitched, so it stays flat against the skin.",
  bullets: [
    "4-way compression stretch, zero restriction",
    "Sweat-wicking, quick-dry finish",
    "Flatlock seams, zero chafe",
    "Tonal Flexter mark, printed not stitched",
  ],
  // NEW — add your product photos here, in the order you want them to appear
  images: [
    "/images/product/front.png",
    "/images/product/back.png",
    "/images/product/detail.png",
	"/images/product/gym.png",
 ],
} as const;