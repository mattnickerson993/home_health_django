import { CheckCircleOutline, HighlightOff } from "@mui/icons-material"
import { InputAdornment } from "@mui/material"

export const errorIcon = (
    <InputAdornment position="end">
        <HighlightOff style={{color: 'red', height: 30, width: 30}} />
    </InputAdornment>
)

export const validIcon = (
    <InputAdornment position="end">
        <CheckCircleOutline style={{color: 'green', height: 30, width: 30}} />
    </InputAdornment>
)
