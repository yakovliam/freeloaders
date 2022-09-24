import { grommet } from "grommet";
import { deepFreeze, deepMerge } from "grommet/utils";

export const theme = deepMerge(
  grommet,
  deepFreeze({
    global: {
      colors: {
        brand: "#0072c6",
        control: {
          dark: "#f8f8f8",
          light: "#444444",
        },
        "accent-1": "#fa6800",
        "accent-2": "#128023",
        "accent-3": "#0050ef",
        "accent-4": "#d80073",
        "neutral-1": "#a4c400",
        "neutral-2": "#00aba9",
        "neutral-3": "#BF5A15",
        "neutral-4": "#8F6C53",
      },
      control: {
        border: {
          radius: "0px",
        },
      },
      drop: {
        background: "#005696",
      },
      focus: {
        border: {
          color: {
            "0": "f",
            "1": "o",
            "2": "c",
            "3": "u",
            "4": "s",
            light: "#0072c6",
            dark: "#003967",
          },
        },
      },
      hover: {
        background: {
          dark: "#0093ff",
          light: "#003967",
        },
        color: {
          dark: "#333333",
          light: "#ffffff",
        },
      },
    },
    anchor: {
      color: {
        dark: "#ffffff",
        light: "#0078D4",
      },
    },
    button: {
      border: {
        radius: "0px",
      },
    },
    checkBox: {
      border: {
        color: {
          light: "rgba(0, 98, 186, 0.5)",
        },
      },
      check: {
        radius: "0px",
      },
      toggle: {
        color: {
          dark: "#bdbdbd",
          light: "#0072c6",
        },
        radius: "0px",
      },
    },
    layer: {
      border: {
        radius: "0px",
      },
    },
    radioButton: {
      border: {
        color: {
          light: "rgba(0, 98, 186, 0.5)",
        },
      },
    },
  })
);
