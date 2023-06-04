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
}

export default function SEO(props: Props) {
  const type = "website";
  const url = "https://www.TODO:.com";
  const bareDomain = "www.TODO:.com";
  const image = {
    url: "https://TODO:.com/thumbnail.jpg",
    alt: "Roast My Site",
    width: "1200",
    height: "630",
  };

  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />

      {/* Open graph */}
      <meta property="og:site_name" content="Resume Beaver" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image.url} />
      <meta property="og:image:alt" content={image.alt} />
      <meta property="og:image:width" content={image.width} />
      <meta property="og:image:height" content={image.height} />

      {/* Twitter Graph */}
      <meta property="twitter:title" content={props.title} />
      <meta property="twitter:description" content={props.description} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={bareDomain} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:image" content={image.url} />
      <meta property="twitter:image:alt" content={image.alt} />
      <meta property="twitter:image:width" content={image.width} />
      <meta property="twitter:image:height" content={image.height} />
      <meta property="twitter:site" content="@timrodz" />
      <meta property="twitter:creator" content="@timrodz" />
      <meta property="twitter:creator:id" content="timrodz" />

      {/* Misc */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
