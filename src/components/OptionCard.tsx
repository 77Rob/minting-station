import Button from "@/components/Button";
import Link from "next/link";

export interface OptionCardProps {
  name: string;
  description: string;
  image: string;
  href: string;
}

const OptionCard = ({ name, description, image, href }: OptionCardProps) => {
  return (
    <div
      key={name}
      className="card mb-2 md:centered-grid-item flex items-center text-center flex-col"
    >
      <img src={image} alt={name} className="w-24 mb-4" />
      <h1 className="uppercase text-xl mb-2 font-semibold">{name}</h1>
      <p className="text-xs uppercase text-[#ADB9C7] mb-6">{description}</p>
      <Link href={href} className="mt-auto">
        <Button>Select</Button>
      </Link>
    </div>
  );
};

export default OptionCard;
