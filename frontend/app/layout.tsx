import BaseThemeProvider from "@/themes/BaseTheme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
//import Header from "components/Header";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import { headers } from "next/headers";
import * as ContextCommon from "@/packages/core/context/Common";
import * as ContextMapInfo from "@/packages/core/context/MapData";
import ModalContact from "@/packages/core/modal/Contact";
import MenuModal from "@/packages/core/modal/Menu";
import getThemeOptions from "@/functions/api/themeOptions";
import * as GtmScript from "@/packages/core/google/GtmScript";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host");
  // 本番環境ならhttps、そうでないならheadersList.get("x-forwarded-proto") || "https"
  const protocol =
    process.env.NODE_ENV === "production"
      ? "https"
      : headersList.get("x-forwarded-proto") || "https";

  const options = await getThemeOptions();

  return (
    <html lang="ja">
      <head>
        {process.env.NODE_ENV !== "production" && (
          <meta name="robots" content="noindex" />
        )}

        {/* GTMタグスクリプト */}
        <GtmScript.Header tag={""} />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mapttnou-domain" content={process.env.TTNOU_DOMAIN} />
        <meta
          name="mapttnou-wdc-api"
          content={process.env.MAP_JS_EVENTDATA_POST_API}
        />

        {/*<!-- プリロードを設定 --> */}
        <link
          rel="preload"
          as="image"
          href={`${protocol}://${host}/logo.svg`}
        />

        <script src={`${process.env.MAP_JS_EVENTDATA}`} async></script>
      </head>
      <CssBaseline />
      <ContextCommon.Provider>
        {/* パッケージ共通 */}
        <ContextMapInfo.Provider>
          {/* パッケージ共通：トトノウMA＋共通データ */}
          <body className={`bg-white text-black`}>
            {/* GTMタグスクリプト */}
            <GtmScript.Body tag={""} />

            <BaseThemeProvider options={options}>
              <Header />
              <main>{children}</main>
              <Footer />
            </BaseThemeProvider>
            <ModalContact />
            <MenuModal menus={[{ label: "について", href: "/about" }]} />
          </body>
        </ContextMapInfo.Provider>
      </ContextCommon.Provider>
    </html>
  );
}
