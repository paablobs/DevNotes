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
      // primary: theme.palette.augmentColor({
      //   color: {
      //     main: "#FF5733",
      //   },
      // }),
      secondary: theme.palette.augmentColor({
        color: {
          main: "#588157",
        },
      }),
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
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
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
