export const dynamic = "force-dynamic";
import BaseThemeProvider from "@/themes/BaseTheme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import * as ContextCommon from "@/packages/core/context/Common";
import * as ContextMapInfo from "@/packages/core/context/MapData";
import MenuModal from "@/packages/core/menu/Modal";
import getThemeOptions from "@/functions/api/themeOptions";
import * as GtmScript from "@/packages/component/google/GtmScript";
import getFormContent from "@/packages/component/contactForm/api";
import ContactModal from "@/packages/component/contactForm/Modal";
import getMenus from "@/functions/api/menus";
import getOrganize from "@/packages/core/organize/api";
import getFooter from "@/functions/api/footer";
import { Suspense } from "react";
import HeadSiteInfo from "@/packages/component/siteInfo/Index";
import Loading from "./loading";
import getSiteInfo from "@/packages/component/siteInfo/api";
import { tOrganize } from "@/packages/core/organize/type";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [organize, siteInfo] = await Promise.all([
    getOrganize(),
    getSiteInfo(),
  ]);

  if (!organize) {
    <p>準備中</p>;
  }
  return (
    <html lang="ja">
      <head>
        {process.env.NODE_ENV !== "production" && (
          <meta name="robots" content="noindex" />
        )}

        {organize?.gtm_tag && <GtmScript.Header tag={organize.gtm_tag} />}
        <HeadSiteInfo info={siteInfo} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mapttnou-domain" content={process.env.TTNOU_DOMAIN} />
        <meta
          name="mapttnou-wdc-api"
          content={process.env.MAP_JS_EVENTDATA_POST_API}
        />
        <script src={`${process.env.MAP_JS_EVENTDATA}`} async></script>
      </head>

      <Suspense fallback={<Loading />}>
        <AsyncLayoutContent organize={organize}>{children}</AsyncLayoutContent>
      </Suspense>
    </html>
  );
}

async function AsyncLayoutContent({
  organize,
  children,
}: {
  organize: tOrganize | null;
  children: React.ReactNode;
}) {
  // ✅ 共通データの取得
  const { options, cfItems, menus, footer } = await api();

  return (
    <body className="bg-white text-black">
      <CssBaseline />
      {organize?.gtm_tag && <GtmScript.Body tag={organize.gtm_tag} />}
      <ContextMapInfo.Provider initialOrganize={organize}>
        <ContextCommon.Provider>
          <BaseThemeProvider options={options}>
            <Header
              menus={menus}
              organizeName={organize?.organization_name ?? ""}
            />
            <main>{children}</main> <Footer contents={footer} />
            <MenuModal menus={[{ label: "について", href: "/about" }]} />
            <ContactModal items={cfItems} />
          </BaseThemeProvider>
        </ContextCommon.Provider>
      </ContextMapInfo.Provider>
    </body>
  );
}

async function api() {
  // 並列で取得（最速化）
  const [siteInfo, options, cfItems, menus, footer] = await Promise.all([
    getSiteInfo(),
    getThemeOptions(),
    getFormContent({
      url: `${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM}?${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM_PARAM}`,
    }),
    getMenus(),
    getFooter(),
  ]);

  return { siteInfo, options, cfItems, menus, footer };
}
