"use client";
import React, { useEffect, useState } from "react";
import Modal from "../atoms/Modal";
import Grid from "@mui/material/Grid2";
import { SmallTextField } from "../atoms/TextField";
import * as atomBtn from "../atoms/Button";
import { useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";
import * as TypeForm from "../form/type";
import * as apiEndInput from "../../api/map/endInput";
import * as ContextCommon from "../context/Common";
import * as ContextMap from "../context/MapData";

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

const Main = () => {
  const searchParams = useSearchParams();
  const { flgContactModal, setFlgContactModal } = ContextCommon.useContents();
  const { ContactFormItems } = ContextMap.Contents();
  const [values, setValues] = useState<Record<string, TypeForm.tInputValue>>(
    {}
  );

  const handleOnClick = async () => {
    //console.log(inputData);

    // postデータの作成
    const inputs: TypeForm.tInputItem[] = ContactFormItems.map((item) => {
      return {
        name: item.system_name,
        required: item.required,
        label: item.label,
        mulitiLine: item.type === "textarea" ? true : false,
        value: values[item.system_name],
      };
    });

    apiEndInput
      .post({
        type: "contact",
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
      actions={
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
      }
      width={"md"}
    >
      <Grid container spacing={2}>
        {ContactFormItems.map((item: TypeForm.tFormItem, index) => (
          <Grid key={index} size={{ xs: 12 }}>
            <SmallTextField
              label={item.label}
              required={item.required}
              props={{
                type: item.type,
                multiline: item.type === "textarea",
                rows: item.row,
                name: item.system_name,
                value: values[item.system_name],
                onChange: (e) =>
                  handleChangeValues(
                    e.target.value,
                    item.system_name,
                    setValues
                  ),
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Modal>
  );
};

export default Main;
