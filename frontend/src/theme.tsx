// src/theme.tsx
import { createTheme } from "@mui/material/styles";
import type { LinkProps } from "@mui/material/Link";
import LinkBehavior from "./components/LinkBehavior";
import type {} from "@mui/x-data-grid/themeAugmentation"; // This augments types for DataGrid

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgb(67, 67, 67)",
            color: "white",
            borderRadius: "0px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
        },
      },
    },
  },
});

export default theme;
