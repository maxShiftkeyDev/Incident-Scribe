import { Box, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  title: string;
  description: string;
  salesforceId: string;
};

export default function IncidentForm({
  onSubmit,
}: {
  onSubmit: (data: FormValues) => void;
}) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500 }}>
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: "Title is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        )}
      />
      <Button type="submit" variant="contained" color="primary">
        Create
      </Button>
    </Box>
  );
}
