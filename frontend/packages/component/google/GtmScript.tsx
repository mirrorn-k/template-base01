import Script from "next/script";

interface Props {
  tag?: string;
}

/**
 * GTMのscriptタグ
 * @returns
 */
export const Header = (props: Props) => {
  if (!props.tag) return null;
  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${props.tag}');`}
    </Script>
  );
};

/**
 * GTMのnoscriptタグ
 * @returns
 */
export const Body = (props: Props) => {
  if (!props.tag) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${props.tag}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      ></iframe>
    </noscript>
  );
};
