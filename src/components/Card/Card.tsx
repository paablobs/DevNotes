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
  id: string;
  title: string;
  text: string;
  isFav?: boolean;
  isTrash?: boolean;
  onFav?: (id: string) => void;
  onTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onSelect?: (id: string) => void;
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
    onSelect,
  }: CustomCardProps = {
    id: "",
    title: "",
    text: "",
    isFav: false,
    isTrash: false,
    onFav: undefined,
    onTrash: undefined,
    onRestore: undefined,
    onSelect: undefined,
  },
) => {
  return (
    <Box sx={{ maxHeight: 142 }}>
      <Card
        variant="outlined"
        onClick={onSelect ? () => onSelect(id) : undefined}
        sx={{ cursor: onSelect ? "pointer" : undefined, maxHeight: 142 }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </Typography>
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
