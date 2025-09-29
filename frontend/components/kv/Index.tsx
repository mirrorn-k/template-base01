"use client";
import { Box, Typography } from "@mui/material";
import * as Image from "@/packages/core/media/Index";
import * as ContextCommon from "@/packages/core/context/Common";
import { tMedia } from "@/packages/core/media/type";
import { getResponsiveValue } from "@/packages/core/function/responsiveValue/index";
import { Responsive } from "@/packages/core/function/responsiveValue/type";
import { IMAGE_DEFAULT } from "@/const/Image";
import { SxProps, Theme } from "@mui/material/styles";
import { LinkButton } from "@/packages/core/atoms/Button";
import { TypographyProps } from "@mui/material";

export default function Mian(kv: Responsive<tMedia>) {
  const { screenSize } = ContextCommon.useContents();

  return (
    <Box
      id="kv"
      sx={{
        // imgのfillを使うならposition:relativeが必須
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "100vh",
        maxWidth: "100vw",
      }}
    >
      <Image.MediaImage
        media={getResponsiveValue<tMedia>(
          kv,
          screenSize,
          undefined,
          undefined,
          "down",
          true,
          true,
          IMAGE_DEFAULT
        )}
        objectFit="cover"
        fill={true}
        imgProps={{
          style: {
            zIndex: -1,
          },
        }}
      />

      <Image.MediaImage
        media={IMAGE_DEFAULT}
        fill={false}
        imgProps={{
          width: IMAGE_DEFAULT.width,
          height: IMAGE_DEFAULT.height,
          style: {
            objectFit: "contain",
            maxWidth: "300px",
            maxHeight: "300px",
          },
        }}
      />

      <Catchcopy
        catchcopy="ここにキャッチコピーが入ります"
        sx={{
          display: { xs: "none", sm: "block" },
          position: "absolute",
          bottom: { xs: "30vh", sm: "27vh", md: "25vh" },
          width: "90%",
          maxWidth: 680,
        }}
      />
      <LatestNews
        sx={{
          position: "absolute",
          bottom: "10vh",
          width: "90%",
          maxWidth: 680,
        }}
      />
    </Box>
  );
}

/**
 * 最新ニュース表示
 * @returns
 */
const LatestNews = (props: { sx?: SxProps<Theme> }) => {
  const style: SxProps<Theme> = {
    bgcolor: "rgba(255, 255, 255, 0.7)",
    boxShadow: 3,

    display: "flex",
    flexDirection: {
      xs: "column", // スマホでは縦並び
      sm: "column", // タブレットも縦並び
      md: "row", // PCでは横並び
    },
    alignItems: {
      xs: "flex-start",
      sm: "flex-start",
      md: "center",
    },
    gap: 0,

    "& .news-box": {
      flex: 1,
      padding: { xs: 1, sm: 1, md: 2 },

      display: "flex",
      flexDirection: {
        xs: "column", // モバイルは縦積み
        sm: "column",
        md: "row", // PCは横並び
      },
      alignItems: {
        xs: "flex-start",
        sm: "flex-start",
        md: "center",
      },
      gap: { xs: 1, sm: 1, md: 2 },

      "& .news-title": {
        fontWeight: "bold",
        mb: { xs: 1, sm: 1, md: 0 },
      },

      "& .divider": {
        display: { xs: "none", sm: "none", md: "block" }, // スマホ/タブレットでは非表示
        borderRight: "1px solid black",
        alignSelf: "stretch",
        mx: 2,
      },

      "& .news-latest": {
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
          md: "row",
        },
        alignItems: {
          xs: "flex-start",
          sm: "flex-start",
          md: "center",
        },
        gap: { xs: 0.5, sm: 1, md: 2 },

        "& span:nth-of-type(1)": {
          fontWeight: "bold",
          fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
        },
        "& span:nth-of-type(2)": {
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: { xs: "100%", sm: "100%", md: "60vw" },
        },
      },
    },

    "& .link-button": {
      alignSelf: "stretch", // Flex 親の中で縦方向に広げる
      minHeight: "auto",

      mt: { xs: 1, sm: 1, md: 0 },
      ml: { xs: 0, sm: 0, md: "auto" },
      fontWeight: "bold",
      borderRadius: 0,

      alignItems: { xs: "flex-end", sm: "flex-end", md: "center" },
    },

    ...props.sx,
  };

  return (
    <Box sx={style}>
      <Box className="news-box">
        <Typography variant="h5" className="news-title">
          NEWS
        </Typography>
        <Box className="divider"></Box>
        <Box className="news-latest">
          <Typography component="span" variant="body2">
            2025-08-31
          </Typography>
          <Typography component="span" variant="body1">
            サイトオープンしました
          </Typography>
        </Box>
      </Box>
      <LinkButton
        href="/news"
        variant="contained"
        size="small"
        className="link-button"
        sx={{
          difplay: "flex",
          flexDirection: "row",
          color: (theme: Theme) => theme.palette.primary.contrastText, // contrastTextを直指定
          fontFamily: (theme: Theme) => theme.typography.h5.fontFamily,
          fontSize: (theme: Theme) => theme.typography.h5.fontSize,
          "&::after": { ml: 1, content: '">"' },
        }}
      >
        一覧
      </LinkButton>
    </Box>
  );
};

const Catchcopy = (props: { catchcopy: string; sx?: SxProps<Theme> }) => {
  const { screenSize } = ContextCommon.useContents();

  const typoVariant: Responsive<TypographyProps["variant"]> = {
    xs: "h4",
    sm: "h3",
    md: "h2",
  };

  return (
    <Box
      sx={{
        ...props.sx,
        textAlign: "center",
        color: "white",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      }}
    >
      <Typography
        variant={getResponsiveValue<TypographyProps["variant"]>(
          typoVariant,
          screenSize
        )}
        component="h2"
        sx={{
          fontWeight: "bold",
        }}
        dangerouslySetInnerHTML={{ __html: props.catchcopy }} // 改行を反映させる場合はinnerHTMLで
      />
    </Box>
  );
};
