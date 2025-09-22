import MenuItem from "@mui/material/MenuItem";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { red } from "@mui/material/colors";

interface SmallTextFieldProps {
  label?: string;
  required?: boolean;
  props: TextFieldProps; // ここでpropsを定義します
}

const Master: React.FC<TextFieldProps> = (props) => {
  return <TextField fullWidth {...props} />;
};

export const SmallTextField: React.FC<SmallTextFieldProps> = ({
  label,
  required,
  props,
}) => {
  return (
    <>
      {label && (
        <Typography
          variant="h6"
          sx={{
            color: `${required && red[500]}`,
          }}
        >
          {label}
        </Typography>
      )}
      <Master {...props} size="small" hiddenLabel />
    </>
  );
};

export const TableCellTextField: React.FC<SmallTextFieldProps> = ({
  label = undefined,
  props,
}) => {
  return (
    <>
      {label && <Typography variant="h6">{label}</Typography>}
      <Master {...props} size="small" hiddenLabel />
    </>
  );
};

interface SelectTextFieldProps {
  label?: string;
  items: Record<string, string>[];
  selectedValue: string;
  props: TextFieldProps;
}
export const SelectTextField = ({
  label,
  items,
  selectedValue,
  props,
}: SelectTextFieldProps) => {
  return (
    <>
      {label && <Typography variant="h6">{label}</Typography>}
      <TextField
        select
        value={selectedValue}
        variant="outlined"
        fullWidth
        {...props}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};
