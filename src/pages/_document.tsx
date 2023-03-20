import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>Minting Station</title>
      <body
        className="bg-base-300 bg-top bg-repeat-y color-white"
        style={{
          backgroundImage: "url('/ornament.png')",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
