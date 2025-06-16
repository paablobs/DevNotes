import MainView from "./components/MainView/MainView";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
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
