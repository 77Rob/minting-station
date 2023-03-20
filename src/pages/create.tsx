import OptionCard from "../components/OptionCard";
import { options } from "@/data";

const Create = () => {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-5 mb-10">
        SELECT COLLECTION TYPE
      </h1>
      <div className="md:centered-grid gap-8 max-w-7xl mx-auto px-10">
        {options.map((option) => (
          <OptionCard key={option.name} {...option} />
        ))}
      </div>
    </div>
  );
};

export default Create;
