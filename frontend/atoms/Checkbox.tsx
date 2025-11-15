import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { CheckboxProps } from "@mui/material/Checkbox";
import React from "react";

interface SmallTextFieldProps {
  label?: string;
  labelId?: string;
  props: CheckboxProps; // ここでpropsを定義します
}

export const SmallCheckbox: React.FC<SmallTextFieldProps> = ({
  label = "",
  //labelId = '',
  props,
}) => {
  return (
    <FormControlLabel
      control={<Checkbox size="small" {...props} />}
      label={<Typography variant="h6">{label}</Typography>}
      //id={labelId}
      labelPlacement="top" // ラベルをチェックボックスの上に配置
      sx={{
        display: "flex",
        flexDirection: "column-reverse", // 縦に配置し、ラベルを上に
        alignItems: "flex-start", // 左寄せ
      }}
    />
  );
};

interface CustomCheckboxProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkboxProps?: CheckboxProps;
}
export const CheckBox = ({
  name,
  label,
  checked,
  onChange,
  checkboxProps,
}: CustomCheckboxProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          onChange={onChange}
          checked={checked}
          {...checkboxProps}
        />
      }
      label={label}
      sx={{
        flexDirection: "column-reverse", // 縦に配置し、ラベルを上に
      }}
    />
  );
};
