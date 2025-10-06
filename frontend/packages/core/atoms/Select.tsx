import { FormControl, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export function SmallSelect({
  id,
  label = "",
  value,
  items = [],
  cbValueChange,
  flgNoSelect = false,
  disabled = false,
}: {
  id: string;
  label?: string;
  value?: string;
  items: { id: number | string; label: string }[];
  cbValueChange: (value: string) => void;
  flgNoSelect?: boolean;
  disabled?: boolean;
}) {
  return (
    <>
      {label && <Typography variant="h6">{label}</Typography>}
      <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
        <Select
          labelId={`labelId-${id}`}
          value={value}
          onChange={(e: SelectChangeEvent<string>) => {
            const val = e.target.value;
            cbValueChange(val ? val : "");
          }}
          fullWidth={true}
          disabled={disabled}
        >
          {flgNoSelect && <MenuItem value={undefined}>{"(未選択)"}</MenuItem>}
          {items.map((item) => (
            <MenuItem
              key={`${name}-${item.id ? item.id.toString() : "init"}`}
              value={item.label}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
