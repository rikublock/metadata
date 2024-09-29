import React from "react";

import { Box, Button, Tooltip } from "@mui/joy";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const threshold = 100;

type Props = {
  children: React.ReactNode;
};

function ScrollTop({ children }: Props) {
  const [scrollPosition, setSrollPosition] = React.useState<number>(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setSrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (
        (event.target as HTMLDivElement).ownerDocument || document
      ).querySelector("#anchor-back-to-top");

      if (anchor) {
        anchor.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    [],
  );

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "fixed",
        bottom: 48,
        right: 48,
        visibility: scrollPosition > threshold ? "visible" : "hidden",
        opacity: scrollPosition > threshold ? 1 : 0,
        transition:
          scrollPosition > threshold
            ? undefined
            : "opacity 250ms ease-in, visibility 0ms ease-in 250ms",
        transitionDelay: scrollPosition > threshold ? "0ms" : undefined,
      }}
    >
      {children}
    </Box>
  );
}

export default function ScrollTopButton() {
  return (
    <ScrollTop>
      <Tooltip title="Scroll to top" enterDelay={800}>
        <Button
          sx={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            zIndex: 1050,
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px",
          }}
          color="neutral"
          variant="soft"
        >
          <KeyboardArrowUpIcon />
        </Button>
      </Tooltip>
    </ScrollTop>
  );
}
