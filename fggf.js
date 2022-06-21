import React from "react";
import { makeStyles, createMuiTheme, useTheme } from "@material-ui/core/styles";
import lightBlue from "@material-ui/core/colors/lightBlue";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: lightBlue[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 58,
    maxWidth: 500,
  },
  menuButton: {
    marginRight: theme.spacing(0),
  },
  title: {
    flexGrow: 1,
    position: "relative",
    textAlign: "center",
    color: "#1DB1DF",
  },
  labelbar: {
    flexGrow: 1,
    backgroundColor: "#1DB1DF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 81,
    color: "#ffffff",
  },
  Toolbar: {
    height: 85,
    flexGrow: 1,
  },
  tabsbar: {
    border: 2,
  },
}));
export default function IconTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState("recents");
  const [selectedValue, setSelectedValue] = React.useState("a");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <div className={classes.labelbar}>
        <h3>เพิ่มผู้ใช้งาน</h3>
      </div>
      <Grid container direction="column" justify="center" alignItems="center">
        <Input defaultValue="ID" inputProps={{ "aria-label": "description" }} />
        <Input
          defaultValue="Password"
          inputProps={{ "aria-label": "description" }}
        />
        <Input
          defaultValue="Name"
          inputProps={{ "aria-label": "description" }}
        />
        <FormControl component="fieldset">
          <FormLabel component="legend" style ={{color : 'black'}} >sex</FormLabel>
          <RadioGroup
            row
            aria-label="position"
            name="position"
            defaultValue="top"
          >
            <FormControlLabel
              value="end"
              control={<Radio color="primary" />}
              label="Man"
            />
            <FormControlLabel
              value="end"
              control={<Radio color="primary" />}
              label="Woman"
            />
          </RadioGroup>
        </FormControl>
        <Input defaultValue="Age" inputProps={{ "aria-label": "description" }} />
        <Input defaultValue="Tel." inputProps={{ "aria-label": "description" }} />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          บันทึก
        </Button>
      </label>
      </Grid>
    </div>
  );
}