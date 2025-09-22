import * as SoundPlayer from "../../../ui/components/media/SoundPlayer";

export default function Main(props: SoundPlayer.Props) {
  const newProps = { ...props };

  // 1~12時の音声ファイルをランダムに選ぶ
  if (!newProps.src) {
    const num = Math.floor(Math.random() * 12) + 1;
    newProps.src = `/sound/CuckooClock/Cuckoo_Clock${String(num).padStart(
      2,
      "0"
    )}.mp3`;
  }

  console.log("DoorSound: src=", newProps.src);

  return <SoundPlayer.default {...newProps} />;
}
