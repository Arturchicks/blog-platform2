import { useTheme } from "@emotion/react"
import { Box, Button, Theme } from "@mui/material"
import { forwardRef } from "react"

export const PopConfirm = forwardRef((props: { delete: () => void }, ref): JSX.Element => {
  const theme = useTheme() as Theme
  return (
    <Box
      className="rounded z-[1] flex flex-col gap-3 absolute bottom-[-95px] right-[90px] text-[12px] p-2"
      ref={ref}
      sx={{ bgcolor: theme.palette.mode === "dark" ? "#7f8185" : "#ebeef3" }}
    >
      <Box
        sx={{
          width: "20px",
          height: "20px",
          transform: "rotate(45deg)",
          borderRadius: "4px",
          position: "absolute",
          right: "40px",
          top: "-8px",
          zIndex: 0,
          bgcolor: theme.palette.mode === "dark" ? "#7f8185" : "#ebeef3",
        }}
      ></Box>
      Are you sure to delete this article?
      <Box className="flex gap-3 justify-center">
        <Button color="info" variant="text" onClick={() => props.delete()}>
          Yes
        </Button>
        <Button color="info" variant="text">
          No
        </Button>
      </Box>
    </Box>
  )
})
PopConfirm.displayName = "PopConfirm"
