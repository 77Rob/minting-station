# Minting Station

Creating and deploying NFT smart contracts can be a daunting task for people with no coding skills. Additionally, generating art for NFTs can be a challenge even for experienced artists. This project aims to solve these problems by providing an easy-to-use platform that allows users to create art for NFTs and generate and deploy NFT smart contracts without any coding knowledge.

## The platform allows users to create NFTs in four ways:

- Upload Images: Users can upload their own images to use as the basis for their NFTs.
- AI-Generated Images: Users can generate unique images for their NFTs by prompting an AI algorithm.
- Base URI for Metadata: Users can provide a base URI for the metadata associated with their NFTs.
- Combined Traits: Users can combine multiple traits to generate unique images for their NFTs.

The project consists of two repositories:

- NextJS project for the front-end (This repository)
- NestJS project for the back-end

## Enviroment Variables

NEXT_PUBLIC_API_URL - BACKEND SERVICE API URL

## TechStack

- Redux
- NestJS
- Firebase Storage
- Web3Storage
- NextJS
- TailWindCss
- EthersJS

## Composability and Reusability

In this project Smart Contract deployment is completely sperated from the art and metadata creation. It means that it is very easy to add new ways of generating metadata without changing Smart Contract creation logic. Smart contract deployment is compeltely controlled by the
`<ContractSettings collectionType={CollectionType}/>` component which accepts `collectionType` as a property which it passes to `deployContract` function. In the `deployContract` function handleMetadata function is called. Images are processed and metadata is generated according to the`collectionType` property. This way it is very easy to add new ways of generating data without changing Smart Contract creation logic.

```tsx
// handleMetadata function
const handleMetadata = async ({ dispatch, getState, collectionType }: any) => {
  if (collectionType == CollectionType.ImagesProvided) {
    // Processes Images and creates metadata according to the collectionType
    await createMetadataImagesProvided({
      dispatch,
      getState,
    });
  }

  if (collectionType === CollectionType.BaseURIProvided) {
    await createMetadataTokenURIProvided({
      dispatch,
      getState,
    });
  }

  if (collectionType == CollectionType.AiGenerated) {
    await createMetadataAiGeneratedImages({
      dispatch,
      getState,
    });
  }
};
```

```tsx
// deployContract function
export const deployContract = async ({
  dispatch,
  getState,
  provider,
  signer,
  values,
  compiler,
  collectionType,
}: any) => {
  dispatch(submitContractValues(values));
  await handleMetadata({ dispatch, getState, collectionType });
  await prepareContract({ dispatch, compiler, getState });
  await initiateDeploymentTransaction({ dispatch, getState, provider, signer });
  await saveContractData({ dispatch, getState, signer });
};
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
