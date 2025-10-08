// components/bubble/BubbleOptions.tsx
"use client";

import * as React from "react";
import { Grid, Button } from "@mui/material";
import { Stack, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useArrayList } from "@/packages/core/useReducer/customHook";
import { ChoiceOption } from "@/packages/ui/components/chat-scenario/type";

type ChoiceProps = {
  options: ChoiceOption[]; // 表示する選択肢
  onSelect: (arg: ChoiceOption) => void; // 選ばれた文字列を返す
  columns?: number; // 列数（デフォルト1）
};

export function Choice({ options, onSelect, columns = 1 }: ChoiceProps) {
  return (
    <Grid container spacing={1}>
      {options.map((opt: ChoiceOption, idx) => (
        <Grid item xs={12 / columns} key={`Choice-${idx}`}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => onSelect(opt)}
            sx={{ textTransform: "none" }}
          >
            {opt.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

type SelectProps = {
  options: string[]; // 表示する選択肢
  onSelect: (strs: string[]) => void; // 選ばれた文字列を返す
  columns?: number; // 列数（デフォルト1）
};

export function Select({ options, onSelect, columns = 1 }: SelectProps) {
  const selected = useArrayList<string>([]);

  const onClickBtn = (label: string) => {
    selected.switch(label);
  };

  return (
    <Grid container spacing={1}>
      {options.map((opt, idx) => (
        <Grid item xs={12 / columns} key={`select-${idx}`}>
          <Button
            variant={selected.find(opt) >= 0 ? "contained" : "outlined"}
            size="small"
            fullWidth
            onClick={() => onClickBtn(opt)}
          >
            {opt}
          </Button>
        </Grid>
      ))}
      <Grid item xs={12} key={`select-end`}>
        <Button
          variant="contained"
          color={"secondary"}
          size="small"
          fullWidth
          onClick={() => onSelect(selected.list)}
          sx={{ textTransform: "none" }}
        >
          {`決定`}
        </Button>
      </Grid>
    </Grid>
  );
}

type TextProps = {
  onSubmit: (text: string) => void;
  placeholder?: string;
  minRows?: number; // 最小行数
  maxRows?: number; // 最大行数
  disabled?: boolean;
};

export function Text({
  onSubmit,
  placeholder = "入力してください...",
  minRows = 1,
  maxRows = 5,
  disabled,
}: TextProps) {
  const [value, setValue] = React.useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth
        multiline
        minRows={minRows}
        maxRows={maxRows}
        variant="outlined"
        size="small"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            // Enter 単体で送信
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSubmit}
        disabled={disabled}
        aria-label="send"
      >
        <SendIcon />
      </IconButton>
    </Stack>
  );
}
