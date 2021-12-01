import Head from "next/head";

import MetadataJson from "../configs/metadata";

export default function Metadata({ page }) {
  const title = MetadataJson[page].title;
  const description = MetadataJson.description;

  return (
    <Head>
      {/* Recommended Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="language" content="ru" />
      <meta itemProp="language" content="ru" />
      <meta httpEquiv="content-type" content="text/html" />

      {/* Search Engine Optimization Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <meta name="distribution" content="web" />

      {/*
        Facebook Open Graph meta tags
        documentation: https://developers.facebook.com/docs/sharing/opengraph
      */}
      <meta name="og:title" content={title} />
      <meta name="og:type" content="site" />
      <meta name="og:image" content="/thumb.png" />
      <meta name="og:site_name" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:locale" content="ru" />

      {/* Meta Tags for HTML pages on Mobile */}
      <meta name="theme-color" content="#cd8360" />

      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />

      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-icon-192x192.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />

      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <meta name="application-name" content="Какой ты геймер?" />
      <meta httpEquiv="Content-Security-Policy" content="font-src 'self' data: fonts.gstatic.com;" />
    </Head>
  );
}
