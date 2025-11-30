import MainView from "./components/MainView/MainView";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

function App() {
  let theme = createTheme({
    // Theme customization goes here as usual, including tonalOffset and/or
    // contrastThreshold as the augmentColor() function relies on these
  });

  theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0a0908",
      },
      secondary: theme.palette.augmentColor({
        color: {
          main: "#2e442e",
        },
      }),
      error: theme.palette.augmentColor({
        color: {
          main: "#942020",
        },
      }),
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "'JetBrains Mono', monospace",
    },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          slotProps: { paper: { elevation: 2 } },
        },
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainView />
      </ThemeProvider>
    </>
  );
}

export default App;
