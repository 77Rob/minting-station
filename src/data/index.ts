import { OptionCardProps } from "@/components/OptionCard";

export const options: OptionCardProps[] = [
  {
    name: "GENERATIVE WITH TRAITS",
    description:
      "Generate NFT collection by providing and combining set of traits like body, hat, accessory etc. and deploy custom smart contract using these images",
    image: "/traits.svg",
    href: "/create/traits",
  },
  {
    name: "Provide images",
    description:
      "Provide images and create an nft collection. Supported IMAGE formats:  JPEG, PNG, GIF, WebP, AVIF, SVG and TIFF",
    image: "/image.svg",
    href: "/create/images",
  },
  {
    name: "AI GENERATED IMAGES",
    description:
      "provide a prompt to GENERATE IMAGES USING AI to create an nft collection.",
    image: "generative.svg",
    href: "/create/ai",
  },
  {
    name: "PROVIDE BASEURI",
    description: "PROVIDE BAse URI to deploy nft collection. ",
    image: "/link.svg",
    href: "/create/baseuri",
  },
];
