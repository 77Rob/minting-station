import { Html, Head, Main, NextScript } from "next/document";
import Header from "@/components/Header";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
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
