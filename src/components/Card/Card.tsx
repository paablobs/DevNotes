import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { pink } from "@mui/material/colors";

import {
  Favorite as FavoriteIcon,
  Restore as RestoreIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";

interface CustomCardProps {
  id: number;
  title: string;
  text: string;
  isFav?: boolean;
  isTrash?: boolean;
  onFav?: (id: number) => void;
  onTrash?: (id: number) => void;
  onRestore?: (id: number) => void;
}

const CustomCard = (
  {
    id,
    title,
    text,
    isFav,
    isTrash,
    onFav,
    onTrash,
    onRestore,
  }: CustomCardProps = {
    id: 0,
    title: "",
    text: "",
    isFav: false,
    isTrash: false,
    onFav: undefined,
    onTrash: undefined,
    onRestore: undefined,
  },
) => {
  return (
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
            <>
              <IconButton onClick={onFav ? () => onFav(id) : undefined}>
                <FavoriteIcon sx={isFav ? { color: pink[700] } : undefined} />
              </IconButton>
              <IconButton onClick={onTrash ? () => onTrash(id) : undefined}>
                <DeleteOutlineIcon />
              </IconButton>
            </>
          )}
          {isTrash && (
            <IconButton onClick={onRestore ? () => onRestore(id) : undefined}>
              <RestoreIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default CustomCard;
