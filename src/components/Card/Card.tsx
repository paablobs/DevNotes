import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import FavoriteIcon from "@mui/icons-material/Favorite";

interface CustomCardProps {
  title: string;
  text: string;
}

const CustomCard = ({ title, text }: CustomCardProps) => (
  <Box>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">{text}</Typography>
      </CardContent>
      <CardActions>
        <IconButton>
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  </Box>
);

export default CustomCard;
