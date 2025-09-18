import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { yellow } from "@mui/material/colors";

import {
  Star as StarIcon,
  StarBorder as StarredIcon,
  Restore as RestoreIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";

import styles from "./Card.module.scss";

interface CustomCardProps {
  id: string;
  text: string;
  category: string;
  isFav?: boolean;
  isTrash?: boolean;
  onFav?: (id: string) => void;
  onTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
}

const CustomCard = ({
  id,
  text,
  category,
  isFav,
  isTrash,
  onFav,
  onTrash,
  onRestore,
  onSelect,
  selected,
}: CustomCardProps) => {
  return (
    <Box className={styles.box}>
      <Card
        className={styles.box__card}
        variant="outlined"
        onClick={onSelect ? () => onSelect(id) : undefined}
        data-active={selected ? "true" : undefined}
      >
        <CardContent>
          <Typography variant="h5" component="div" className={styles.box__text}>
            {(text.match(/^(.*\S.*)$/m) || ["New note"])[0]}
          </Typography>
          <Typography variant="body2" className={styles.box__text}>
            {category}
          </Typography>
        </CardContent>
        <CardActions>
          {!isTrash && (
            <>
              <IconButton onClick={onFav ? () => onFav(id) : undefined}>
                {isFav ? (
                  <StarIcon sx={{ color: yellow[700] }} />
                ) : (
                  <StarredIcon />
                )}
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
