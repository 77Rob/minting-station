import ContractSettings from "@/components/ContractSettings";
import { CollectionType } from "@/store/reducers/contractReducer";

const BaseUri = () => {
  return (
    <div className="flex max-w-xl mx-auto my-8 ">
      <ContractSettings collectionType={CollectionType.BaseURIProvided} />
    </div>
  );
};

export default BaseUri;
