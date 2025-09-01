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
import { deleteItemByIdFromLocalStorage } from "../../utils/deleteItemByIdFromLocalStorage";

interface CustomCardProps {
  id: number;
  storageKey: string;
  title: string;
  text: string;
  isFav?: boolean;
  isTrash?: boolean;
  onDelete?: (id: number) => void;
}

const CustomCard = (
  { id, storageKey, title, text, isFav, isTrash, onDelete }: CustomCardProps = {
    id: 0,
    storageKey: "",
    title: "",
    text: "",
    isFav: false,
    isTrash: false,
    onDelete: undefined,
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
              <IconButton>
                <FavoriteIcon sx={isFav ? { color: pink[700] } : undefined} />
              </IconButton>
              <IconButton
                onClick={
                  onDelete
                    ? () => onDelete(id)
                    : id !== undefined
                      ? () => deleteItemByIdFromLocalStorage(storageKey, id)
                      : undefined
                }
              >
                <DeleteOutlineIcon />
              </IconButton>
            </>
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
};

export default CustomCard;
