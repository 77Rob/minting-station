import Link from "next/link";

interface IOption {
  name: string;
  description: string;
  image: string;
  href: string;
}

const options: IOption[] = [
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
  {
    name: "PROVIDE METADATA FILES",
    description:
      "PROVIDE JSON METADATA FILES to deploy nft collection. Files will be uploaded to IPFS before deployment.",
    image: "folder_closed.svg",
    href: "/create/metadata",
  },
];

const OptionCard = ({ name, description, image, href }: IOption) => {
  return (
    <div
      key={name}
      className="card mb-2 md:centered-grid-item flex items-center text-center flex-col"
    >
      <img src={image} className="w-24 mb-4" />
      <h1 className="uppercase text-xl mb-2 font-semibold">{name}</h1>
      <p className="text-xs uppercase text-[#ADB9C7] mb-6">{description}</p>
      <Link href={href} onClick={() => console.log(href)} className="mt-auto">
        <button className="btn-primary ">SELECT</button>
      </Link>
    </div>
  );
};

const Create = () => {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-5 mb-10">
        SELECT COLLECTION TYPE
      </h1>
      <div className="md:centered-grid gap-8 max-w-7xl mx-auto px-10">
        {options.map((option) => (
          <OptionCard {...option} />
        ))}
      </div>
    </div>
  );
};

export default Create;
