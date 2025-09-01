import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { pink } from "@mui/material/colors";

import FavoriteIcon from "@mui/icons-material/Favorite";
import RestoreIcon from "@mui/icons-material/Restore";

interface CustomCardProps {
  title: string;
  text: string;
  isFav?: boolean;
  isTrash?: boolean;
}

const CustomCard = (
  { title, text, isFav, isTrash }: CustomCardProps = {
    title: "",
    text: "",
    isFav: false,
    isTrash: false,
  },
) => (
  <Box>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">{text}</Typography>
      </CardContent>
      <CardActions>
        {!isTrash && (
          <IconButton>
            <FavoriteIcon sx={isFav ? { color: pink[700] } : undefined} />
          </IconButton>
        )}
        {isTrash && (
          <IconButton>
            <RestoreIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  </Box>
);

export default CustomCard;
