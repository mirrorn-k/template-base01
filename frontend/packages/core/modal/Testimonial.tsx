"use client";
import React, { useEffect, useState } from "react";
import Modal from "atoms/Modal";
import * as atomLink from "atoms/Link";
import Contents from "components/contents/Testimonial";
import { useContext } from "react";
import { CommonDataContext } from "@/contexts/Toppage";
import { tVoice } from "@/types/works";
import * as apiWorks from "@/functions/api/data/works";

interface Props {
  uuid: string;
}
export function TestimonialModalLink({ uuid }: Props) {
  const { handleUuidTestimonial } = useContext(CommonDataContext);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // ← 伝播を止める
    e.nativeEvent.stopImmediatePropagation(); // ← 最強伝播停止
    const searchParams = new URLSearchParams(window.location.search);
    const existingUuid = searchParams.get("testimonail-modal");
    if (existingUuid) {
      // 既存のUUIDがある場合はundefinedに設定
      handleUuidTestimonial(undefined);
    } else {
      // 新しいUUIDを設定
      handleUuidTestimonial(uuid);
    }
  };
  return (
    <atomLink.ButtonLink handleClick={handleClick} label="お客様の声＞＞" />
  );
}

interface MainProps {
  title?: string;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}
export const TestimonialModal = ({
  title = "お客様の声",
  width = false,
}: MainProps) => {
  const { uuidTestimonial, handleUuidTestimonial } =
    useContext(CommonDataContext);

  const handleClose = () => {
    handleUuidTestimonial(undefined);
  };

  // 対象のお客様の声が入るstate
  const [voice, setVoice] = useState<tVoice | null>(null);

  /**
   * URLパラメータを取得
   */
  useEffect(() => {
    // URLパラメータを取得
    const searchParams = new URLSearchParams(window.location.search);
    const uuid = searchParams.get("testimonail-modal");
    if (uuid) {
      handleUuidTestimonial(uuid);
    }
  }, []);

  /**
   * UUIDから対象のお客様の声を取得
   */
  useEffect(() => {
    const fetchData = async () => {
      if (uuidTestimonial) {
        const voices = await apiWorks.voices();
        if (!voices) return;

        // 連想配列を配列にする
        const voiceList: tVoice[] = Object.values(voices).flat();

        // uuidが一致するものを取得
        if (uuidTestimonial) {
          const voice = voiceList.find(
            (voice) => voice.uuid === uuidTestimonial
          );
          if (voice) {
            setVoice(voice);
          } else {
            setVoice(null);
          }
        }
      }
    };
    fetchData();
  }, [uuidTestimonial, setVoice]);

  return (
    <Modal
      title={title}
      open={uuidTestimonial ? true : false}
      onClose={handleClose}
      actions={<></>}
      width={width || "md"}
    >
      {voice ? <Contents data={voice} /> : <div>お客様の声がありません</div>}
    </Modal>
  );
};
