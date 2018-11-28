import React, { Fragment } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Avatar from "@material-ui/core/Avatar";

import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import TextField from "@material-ui/core/TextField";

import MailIcon from "@material-ui/icons/Mail";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Pipe } from "./pipe.js";

let pipe = new Pipe();
pipe.init();

const appBarHeight = 50;

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {},
  toolbar: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  drawer: {
    width: 240,
    flexShrink: 0
  },

  content: {
    height: "100%",
    width: "100%",
    backgroundColor: grey[200],
    paddingTop: appBarHeight + theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  table: {
    width: "100%"
  },
  row: {},
  paper: {
    overflow: "auto",
    height: 100
  },
  details: {
    //justifyItems: "center",
    width: "100%",
    overflowX: "auto"
  },
  textField: {
    width: "100%",
    rows: 10,
    rowsMax: 10
  },
  panel: {
    paddingLeft: 10,
    overflowX: "auto",
    width: "100%",
    height: "100%"
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

class StageRegistersLayout extends React.Component {
  stages = ["Write-back", "Memory", "Execute", "Decode", "Fetch"];
  render() {
    const { classes } = this.props;
    let stageRegisters = pipe.getStageRegisters();

    //displace begin
    return (
      <div className={classes.panel}>
        <Paper
          className={classes.paper}
          style={{ height: this.props.height - 3 }}
        >
          <Typography className={classes.text} variant="h5" gutterBottom>
            Stage Registers
          </Typography>
          <List className={classes.list}>
            {this.stages.map((name, index) => (
              <React.Fragment>
                <ListSubheader className={classes.subHeader}>
                  {name}
                </ListSubheader>

                <ListItem button>
                  <Avatar> {name[0]}</Avatar>
                  <ListItemText
                    primary={stageRegisters[index].map((prop, index) =>
                      prop[1] == "" ? "" : "[" + prop[0] + "] " + prop[1] + " "
                    )}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </div>
    );

    /*   return (
      <div className={classes.panel} >
        {this.stages.map((name, index) => (
          <ExpansionPanel >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              style={{  }}
            >
              <div style={{ flex: 1 }}>
                <Typography>{name}</Typography>
              </div>
              
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Typography>
                {stageRegisters[index].map(
                  (prop, index) => " [" + prop[0] + "] " + prop[1] + " "
                )}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
        
      </div>
    );*/
  }
}

class RegisterFileLayout extends React.Component {
  regs = [
    "rax",
    "rcx",
    "rdx",
    "rbx",
    "rsp",
    "rbp",
    "rsi",
    "rdi",
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "rnone"
  ];
  render() {
    const { classes } = this.props;
    let r = pipe.getRegisterFile();
    return (
      <div style={{ width: "100%" }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.row}>
              {this.regs.map(
                (name, index) =>
                  index < 8 && (
                    <TableCell style={{ textAlign: "center", flexGrow: 1 }}>
                      {name}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              {r.map(
                (val, index) =>
                  index < 8 && (
                    <TableCell style={{ textAlign: "center" }}>{val}</TableCell>
                  )
              )}
            </TableRow>
          </TableBody>
          <TableHead>
            <TableRow className={classes.row}>
              {this.regs.map(
                (name, index) =>
                  index >= 8 && (
                    <TableCell style={{ textAlign: "center" }}>
                      {name}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              {r.map(
                (val, index) =>
                  index >= 8 && (
                    <TableCell style={{ textAlign: "center" }}>{val}</TableCell>
                  )
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpload = this.handleUpload.bind(this);
    this.state = { code: "Please upload a .yo file" };
  }

  handleUpload(event) {
    let fileReader = new FileReader();
    let str;
    let t = this;
    fileReader.onload = function(event) {
      str = event.target.result;
      pipe.init();
      pipe.setCode(str);
      t.setState({ code: str });
      //alert(pipe.Memory);
    };
    fileReader.readAsText(event.target.files[0]);
  }
  componentDidMount() {
    this.setState({ textHeight: this.textFieldDiv.clientHeight });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={() => {
                //this.textField.value="2";
              }}
            >
              <MenuIcon />
            </IconButton>

            <IconButton color="inherit" onClick={() => this.fileUpload.click()}>
              <AddIcon />
            </IconButton>
            <input
              type="file"
              accept=".yo"
              ref={fileUpload => {
                this.fileUpload = fileUpload;
              }}
              style={{ visibility: "hidden" }}
              onChange={this.handleUpload}
            />

            <Typography
              variant="h6"
              color="inherit"
              noWrap
              style={{ position: "absolute", right: 30 }}
            >
              Y86-64 CPU Simulator
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              width: "100%",
              height: "100%"
            }}
          >
            <div
              ref={div => {
                this.textFieldDiv = div;
              }}
              style={{ width: "70%", marginRight: 30, marginBottom: 30 }}
            >
              <TextField
                id="textField"
                label="Code"
                multiline={true}
                value={this.state.code}
                onChange={() => 0}
                margin="none"
                variant="outlined"
                rows="15"
                maxRow="15"
                InputProps={{
                  readOnly: false
                }}
                style={{ width: "100%" }}
                ref={textField => {
                  this.textField = textField;
                }}
              />
            </div>
            <div
              style={{
                width: "30%",
                overflowX: "auto",
                height: this.state.textHeight
              }}
            >
              <StageRegistersLayout
                classes={classes}
                height={this.state.textHeight}
              />
            </div>
          </div>
          <ExpansionPanel defaultExpanded={true}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>RegisterFile</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {
                //mention! add width:100% if wrapped by other labels }
              }
              <RegisterFileLayout classes={classes} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </main>
        <div
          style={{
            zIndex: 1,
            position: "fixed",
            bottom: 0,
            right: 0
          }}
        >
          <Fab color="secondary" aria-label="Add" style={{ margin: 30 }}>
            <ChevronRightIcon
              onClick={() => {
                pipe.stepi(1);
                this.setState({ stageRegisters: pipe.getStageRegisters() });
                this.setState({ registerFile: pipe.getRegisterFile() });
                console.log(this.state.stageRegisters);
              }}
            />
          </Fab>
        </div>
      </div>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainLayout);
