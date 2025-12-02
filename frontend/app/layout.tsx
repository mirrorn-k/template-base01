//export const dynamic = "force-dynamic";
import "./globals.css";
import * as ContextCommon from "@/contexts/Common";
import * as ContextMapInfo from "@/contexts/MapData";
import getThemeOptions from "@/lib/api/themeOption/index";
import getFormContent from "@/lib/api/contactForm/api";
import getMenus from "@/lib/api/menu/index";
import getOrganize from "@/lib/api/organize/index";
import ScriptContainer from "./Script";
import getSiteInfo from "@/lib/api/siteInfo/index";
import { tSiteInfo } from "@/lib/api/siteInfo/type";
import getHeader from "@/lib/api/header/index";
import BaseThemeProvider from "@/themes/BaseTheme";
import { CssBaseline } from "@mui/material";
import * as GtmScript from "@/components/google/GtmScript";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ 共通データの取得
  const { organize, siteInfo, options, cfItems, menus, header } = await api();

  if (!organize) {
    return <p>準備中</p>;
  }
  return (
    <html lang="ja">
      <head>
        {process.env.NODE_ENV !== "production" && (
          <meta name="robots" content="noindex" />
        )}

        <ScriptContainer info={siteInfo} />
        <SiteInfoHead info={siteInfo} />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mapttnou-domain" content={process.env.TTNOU_DOMAIN} />
        <meta
          name="mapttnou-wdc-api"
          content={process.env.NEXT_PUBLIC_MAP_JS_EVENTDATA_POST_API}
        />
      </head>

      <body>
        <ContextMapInfo.Provider
          organize={organize}
          menus={menus}
          cfItems={cfItems}
          header={header}
        >
          <ContextCommon.Provider>
            <BaseThemeProvider options={options}>
              <CssBaseline />
              {organize?.gtm_tag && <GtmScript.Body tag={organize.gtm_tag} />}
              {children}
            </BaseThemeProvider>
            {/*
          <BaseThemeProvider options={options}>
            <AsyncLayoutContent organize={organize}>
              {children}
            </AsyncLayoutContent>
          </BaseThemeProvider>
          */}
          </ContextCommon.Provider>
        </ContextMapInfo.Provider>
      </body>
    </html>
  );
}

/*
async function AsyncLayoutContent({
  organize,
  children,
}: {
  organize: tOrganize | null;
  children: React.ReactNode;
}) {
  return (
    <body className="bg-white text-black">
      <Suspense fallback={<Loading />}>
        <CssBaseline />
        {organize?.gtm_tag && <GtmScript.Body tag={organize.gtm_tag} />}
        <Header />
        <Box
          component="main"
          sx={{
            m: "auto",
            p: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {children}
        </Box>
        <Footer />
        <MenuModal />
        <ContactModal />
      </Suspense>
    </body>
  );
}
*/

async function api() {
  try {
    // 並列で取得（最速化）
    const [organize, siteInfo, options, cfItems, menus, header] =
      await Promise.all([
        getOrganize(),
        getSiteInfo(),
        getThemeOptions(),
        getFormContent({
          url: `${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM}?${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM_PARAM}`,
        }),
        getMenus(),
        getHeader(),
      ]);

    return { organize, siteInfo, options, cfItems, menus, header };
  } catch (e) {
    console.error("API ERROR IN LAYOUT:", e);
    throw e; // ← build を確実に止める
  }
}

const SiteInfoHead = ({ info }: { info: tSiteInfo | null }) => {
  if (!info) return null;
  return (
    <>
      {/* favicon */}
      {info.favicon?.url && (
        <link rel="icon" href={info.favicon.url} sizes="any" />
      )}

      {/* Apple Touch Icon */}
      {info.appleTouchIcon?.url && (
        <link rel="apple-touch-icon" href={info.appleTouchIcon.url} />
      )}

      {/* 外部CSS */}
      {info.externalCss && (
        <style dangerouslySetInnerHTML={{ __html: info.externalCss }} />
      )}
    </>
  );
};
