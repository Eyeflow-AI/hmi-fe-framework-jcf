import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import LayoutConstructor from "../layoutConstructor";

export default function LayoutBox({ name, style, components, componentsInfo }) {
  const [_style, _setStyle] = useState({});

  useEffect(() => {
    if (style) {
      _setStyle(style);
    } else {
      _setStyle({
        borderRadius: 1,
        width: "100%",
        height: "100%",
        display: "flex",
      });
    }
  }, [style]);

  return (
    <Box
      sx={{
        ..._style,
      }}
      key={name}
    >
      <LayoutConstructor
        config={{ components }}
        componentsInfo={componentsInfo}
      />
    </Box>
  );
}
