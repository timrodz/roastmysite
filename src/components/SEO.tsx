import Head from "next/head";

interface Image {
  url: string;
  alt: string;
  width: string;
  height: string;
}

interface Props {
  title: string;
  description: string;
  type: "website";
  /** www */
  url: string;
  /** without the www */
  bareDomain: string;
  image: Image;
}

export default function SEO(props: Props) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />

      {/* Open graph */}
      <meta property="og:site_name" content="Resume Beaver" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:type" content={props.type} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={props.url} />
      <meta property="og:image" content={props.image.url} />
      <meta property="og:image:alt" content={props.image.alt} />
      <meta property="og:image:width" content={props.image.width} />
      <meta property="og:image:height" content={props.image.height} />

      {/* Twitter Graph */}
      <meta property="twitter:title" content={props.title} />
      <meta property="twitter:description" content={props.description} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={props.url} />
      <meta property="twitter:url" content={props.url} />
      <meta property="twitter:image" content={props.image.url} />
      <meta property="twitter:image:alt" content={props.image.alt} />
      <meta property="twitter:image:width" content={props.image.width} />
      <meta property="twitter:image:height" content={props.image.height} />
      <meta property="twitter:site" content="@timrodz" />
      <meta property="twitter:creator" content="@timrodz" />
      <meta property="twitter:creator:id" content="timrodz" />

      {/* Misc */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
