//export const dynamic = "force-dynamic";
import "./globals.css";
import * as ContextCommon from "@/contexts/Common";
import * as ContextMapInfo from "@/contexts/MapData";
import getThemeOptions from "@/lib/api/themeOption/index";
import getFormContent from "@/lib/api/contactForm/api";
import getOrganize from "@/lib/api/organize/index";
import ScriptContainer from "./Script";
import { tSiteInfo } from "@/lib/api/siteInfo/type";
import getHeader from "@/lib/api/header/index";
import BaseThemeProvider from "@/themes/BaseTheme";
import { CssBaseline } from "@mui/material";
import * as GtmScript from "@/components/google/GtmScript";
import { getPages } from "@/lib/api/page/index";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ 共通データの取得
  const { organize, options, cfItems, header, pages } = await api();

  if (!organize) {
    return <p>準備中</p>;
  }
  return (
    <html lang="ja">
      <head>
        {process.env.NODE_ENV !== "production" && (
          <meta name="robots" content="noindex" />
        )}

        <ScriptContainer info={null} />
        <SiteInfoHead info={null} />

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
          cfItems={cfItems}
          header={header}
          pages={pages}
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
    const [organize, options, cfItems, header, pages] = await Promise.all([
      getOrganize(),
      getThemeOptions(),
      getFormContent({
        url: `${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM}?${process.env.NEXT_PUBLIC_MAP_API_CONTACT_FORM_PARAM}`,
      }),
      getHeader(),
      getPages(),
    ]);

    return { organize, options, cfItems, header, pages };
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
