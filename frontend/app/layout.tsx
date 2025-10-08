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
import getOrganize from "@/packages/api/map/organize";
import getFooter from "@/functions/api/footer";
import { Suspense } from "react";
import HeadSiteInfo from "@/packages/component/siteInfo/Index";
import Loading from "./loading";
import getSiteInfo from "@/packages/component/siteInfo/api";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Suspense fallback={<Loading />}>
        <AsyncLayoutContent>{children}</AsyncLayoutContent>
      </Suspense>
    </html>
  );
}

async function AsyncLayoutContent({ children }: { children: React.ReactNode }) {
  // ✅ 共通データの取得
  const { organize, siteInfo, options, cfItems, menus, footer } = await api();

  console.log("[layout] siteInfo", siteInfo);
  return (
    <>
      <head>
        {process.env.NODE_ENV !== "production" && (
          <meta name="robots" content="noindex" />
        )}

        {organize.gtm_tag && <GtmScript.Header tag={organize.gtm_tag} />}
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

      <body className="bg-white text-black">
        <CssBaseline />
        {organize.gtm_tag && <GtmScript.Body tag={organize.gtm_tag} />}
        <ContextMapInfo.Provider initialOrganize={organize}>
          <ContextCommon.Provider>
            <BaseThemeProvider options={options}>
              <Header menus={menus} organizeName={organize.organization_name} />
              <main>{children}</main> <Footer contents={footer} />
              <MenuModal menus={[{ label: "について", href: "/about" }]} />
              <ContactModal items={cfItems} />
            </BaseThemeProvider>
          </ContextCommon.Provider>
        </ContextMapInfo.Provider>
      </body>
    </>
  );
}

async function api() {
  // 並列で取得（最速化）
  const [organize, siteInfo, options, cfItems, menus, footer] =
    await Promise.all([
      getOrganize(),
      getSiteInfo(),
      getThemeOptions(),
      getFormContent({
        url: `${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM}?${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM_PARAM}`,
      }),
      getMenus(),
      getFooter(),
    ]);

  return { organize, siteInfo, options, cfItems, menus, footer };
}
