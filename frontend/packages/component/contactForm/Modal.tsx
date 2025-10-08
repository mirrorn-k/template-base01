"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/packages/core/atoms/Modal";
import Grid from "@mui/material/Grid2";
import { SmallTextField } from "@/packages/core/atoms/TextField";
import * as atomBtn from "@/packages/core/atoms/Button";
import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import * as TypeForm from "@/packages/core/form/type";
import * as apiEndInput from "@/packages/api/map/endInput";
import * as ContextCommon from "@/packages/core/context/Common";
import { tFormItem } from "./type";
import { SmallSelect } from "@/packages/core/atoms/Select";

/**
 * Hash型の入力フォームの変更を処理する関数
 * @param value
 * @param state
 * @param setState
 */
const handleChangeValues = (
  value: string | number,
  name: string | number,
  setState: React.Dispatch<
    React.SetStateAction<Record<string, TypeForm.tInputValue>>
  >
) => {
  setState((prev: Record<string, TypeForm.tInputValue>) => ({
    ...prev,
    [name]: value,
  }));
};

const Main = ({ items = [] }: { items: tFormItem[] }) => {
  const searchParams = useSearchParams();
  const { flgContactModal, setFlgContactModal } = ContextCommon.useContents();
  const [values, setValues] = useState<Record<string, TypeForm.tInputValue>>(
    {}
  );

  const handleOnClick = async () => {
    //console.log(inputData);

    // postデータの作成
    const inputs: TypeForm.tInputItem[] = items.map((item) => {
      return {
        name: item.systemName,
        required: item.required,
        label: item.label,
        mulitiLine: item.type === "textarea" ? true : false,
        value: values[item.label],
      };
    });

    apiEndInput
      .post({
        input: inputs,
        referrer: window.location.href,
      })
      .then((res) => {
        if (res.status !== 200) throw res;

        alert("送信しました。");

        handleClose();
      })
      .catch(() => {
        alert("送信に失敗しました。");
      });
  };

  const handleClose = () => {
    // URLパラメータを削除
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("contact-modal");
    const newUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, "", newUrl);

    setFlgContactModal(false);
  };

  useEffect(() => {
    //const searchParams = new URLSearchParams(window.location.search);
    const val = searchParams.get("contact-modal");
    if (val) {
      setFlgContactModal(true);
    }
  }, [searchParams, setFlgContactModal]);

  return (
    <Modal
      title={"お問い合わせ"}
      open={flgContactModal}
      onClose={handleClose}
      width={"md"}
    >
      <Grid container spacing={2}>
        {items.map((item: TypeForm.tFormItem, index) => (
          <Grid key={index} size={{ xs: 12 }}>
            <InputComponent item={item} values={values} setValues={setValues} />
          </Grid>
        ))}
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <atomBtn.Main
            variant="contained"
            color={"primary"}
            onClick={() => {
              console.log(values);
              handleOnClick();
            }}
          >
            <Typography variant="h5" className="font-text">
              送信
            </Typography>
          </atomBtn.Main>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default Main;

const InputComponent = ({
  item,
  values,
  setValues,
}: {
  item: tFormItem;
  values: Record<string, TypeForm.tInputValue>;
  setValues: React.Dispatch<
    React.SetStateAction<Record<string, TypeForm.tInputValue>>
  >;
}) => {
  if (item.type === "select") {
    return <Select item={item} values={values} setValues={setValues} />;
  } else {
    return <TextItem item={item} values={values} setValues={setValues} />;
  }
};

interface inputProps {
  item: tFormItem;
  values: Record<string, TypeForm.tInputValue>;
  setValues: React.Dispatch<
    React.SetStateAction<Record<string, TypeForm.tInputValue>>
  >;
}

const TextItem = ({ item, values, setValues }: inputProps) => {
  return (
    <SmallTextField
      label={item.label}
      required={item.required}
      props={{
        type: item.type,
        multiline: item.type === "textarea",
        rows: item.row,
        value: values[item.label],
        onChange: (e) =>
          handleChangeValues(e.target.value, item.label, setValues),
      }}
    />
  );
};

const Select = ({ item, values, setValues }: inputProps) => {
  return (
    <SmallSelect
      id={"select-" + item.uuid}
      flgNoSelect={!item.required}
      label={item.label}
      items={item.options?.map((opt) => ({ id: opt, label: opt })) || []}
      value={values[item.label] ? String(values[item.label]) : ""}
      cbValueChange={(val) => {
        handleChangeValues(val, item.label, setValues);
      }}
    />
  );
};
