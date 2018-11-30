import React, { Fragment } from "react";

import Zoom from "@material-ui/core/Zoom";

import red from "@material-ui/core/colors/red";

import PropTypes from "prop-types";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
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
import InfoIcon from "@material-ui/icons/Info";

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
import InputBase from "@material-ui/core/InputBase";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Pipe } from "./pipe.js";

let pipe = new Pipe();
pipe.init();

const appBarHeight = 70;

const theme = createMuiTheme({
  palette: {
    /*primary: red,
    secondary: {
      main: '#f44336',
    },*/
  },
  typography: {
    useNextVariants: true,
    fontSize: 15,
    fontFamily: [
      "Consolas",
      "Courier New",
      '"Microsoft Yahei"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(",")
  }
});
console.log(theme);
const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    height: appBarHeight
  },
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
    paddingTop: appBarHeight + theme.spacing.unit * 3,
    padding: theme.spacing.unit * 3
  },
  table: {
    width: "100%"
  },
  row: {},
  paper: {
    overflow: "auto",
    padding: 10,
    height: "100%",
    width: "100%"
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
    width: "100%"
    //height: "100%"
  },
  subHeader: {
    //backgroundColor:
    backgroundColor: theme.palette.background.paper
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

class CodeLayout extends React.Component {
  render() {
    const { classes } = this.props;
    let code = this.props.code;
    let stageRegisters = pipe.getStageRegisters();

    //displace begin
    return (
      <div style={{ height: "100%" }}>
        <Paper
          style={{
            padding: theme.spacing.unit * 2,
            height: "100%",
            overflow: "auto"
          }}
        >
          {/*}  <List dense={true}>
            <ListSubheader className={classes.subHeader}>Code</ListSubheader>
        */}
          {code.map((line, index) => (
            <div
              style={
                {
                  //border: "1px blue solid"
                }
              }
            >
              <Typography
                style={{
                  //border: "1px blue solid",
                  fontSize: 15
                }}
              >
                {line}
              </Typography>
            </div>
          ))}
          {
            //}    </List>
          }{" "}
        </Paper>
      </div>
    );
  }
}

class StageRegistersLayout extends React.Component {
  stages = ["Write-back", "Memory", "Execute", "Decode", "Fetch"];
  render() {
    const { classes } = this.props;
    let stageRegisters = pipe.getStageRegisters();

    //displace begin
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Paper style={{ height: "100%", overflow: "auto" }}>
          <List className={classes.list}>
            <ListSubheader className={classes.subHeader}>
              Stage Registers
            </ListSubheader>

            {this.stages.map((name, index) => (
              <React.Fragment>
                <Zoom in={true}>
                  <ListItem button>
                    <Avatar> {name[0]}</Avatar>
                    <ListItemText
                      primary={stageRegisters[index].map((prop, index) =>
                        prop[1] == ""
                          ? ""
                          : "[" + prop[0] + "] " + prop[1] + " "
                      )}
                    />
                  </ListItem>
                </Zoom>
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
    this.state = {
      code: ["Please upload a .yo file"],
      textHeight: "100%",
      drawerOpen: false
    };
    this.textFieldDiv = React.createRef();
  }

  handleUpload(event) {
    let fileReader = new FileReader();
    let str;
    let t = this;
    fileReader.onload = function(event) {
      str = event.target.result;
      pipe.init();
      pipe.setCode(str);
      let codeLines = [];
      let line = "";
      let i = 0;
      while (i < str.length) {
        if (str[i] != "\n") {
          if (str[i] == " ") line += "\xa0";
          else line += str[i];
        } else {
          codeLines.push(line);
          line = "";
        }
        i++;
      }
      console.log(codeLines);
      t.setState({ code: codeLines });
      //alert(pipe.Memory);
    };
    fileReader.readAsText(event.target.files[0]);
  }
  componentDidMount() {
    // this.setState({ textHeight: this.textFieldDiv.clientHeight });
  }

  runPipe(time) {
    let this_ = this;
    setTimeout(function func() {
      if (pipe.stepi(1) == 0) {
        console.log("step");
        this_.setState({ stageRegisters: pipe.getStageRegisters() });
        this_.setState({ registerFile: pipe.getRegisterFile() });
        setTimeout(func, time);
      }
    }, time);
  }

  render() {
    const { classes } = this.props;
    const drawerList = (
      <div className={classes.list}>
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button key="About">
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </List>
      </div>
    );
    return (
      <div className={classes.root}>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <Drawer
            open={this.state.drawerOpen}
            onClose={() => {
              this.setState({ drawerOpen: false });
            }}
          >
            <div
              tabIndex={0}
              role="button"
              onClick={() => {
                this.setState({ drawerOpen: false });
              }}
              onKeyDown={() => {
                this.setState({ drawerOpen: false });
              }}
            >
              {drawerList}
            </div>
          </Drawer>
          <AppBar
            position="fixed"
            className={classes.appBar}
            style={{ display: "flex", alignContent: "center" }}
          >
            <Toolbar style={{ border: "1px solid green", height: "100%" }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={() => {
                  this.setState({ drawerOpen: true });
                }}
              >
                <MenuIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => this.fileUpload.click()}
              >
                <AddIcon />
              </IconButton>
              <input
                type="file"
                accept=".yo"
                ref={ref => (this.fileUpload = ref)}
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
                width: "100%",
                height: window.innerHeight - theme.spacing.unit * 20,

                display: "flex",
                alignItems: "stretch",
                marginBottom: theme.spacing.unit * 3
              }}
            >
              <div
                style={{
                  //flex: 1,
                  //flexBasis:10000,
                  marginRight: theme.spacing.unit * 3,
                  width: "70%"
                }}
              >
                <CodeLayout classes={classes} code={this.state.code} />

                {/*}
                  <List>
                    <ListItem button key="About" >
                    <React.Fragment>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>bbggbbbgbbgbg
                      <ListItemText primary="Abutsldkjfslkdjfoksjdhfkkkkkkkkkkkkkkkkkkkkkkkkkkkkskkkssdkjskjh"/>
                    </React.Fragment>
                    </ListItem>
                  </List>
                </Paper>

                {*/}
              </div>

              <div
                style={{
                  //flex:1,
                  width: "30%"
                }}
              >
                <StageRegistersLayout classes={classes} />
              </div>
            </div>
            <div style={{ marginBottom: theme.spacing.unit * 3 }}>
              <ExpansionPanel
                defaultExpanded={true}
                onMouseEnter={e => {
                  console.log("enter");
                  console.log(this);
                }}
              >
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
            </div>
          </main>
          <div
            style={{
              zIndex: 1,
              position: "fixed",
              bottom: 0,
              right: 0
            }}
          >
            <Zoom in="true">
              <Fab color="secondary" aria-label="Add" style={{ margin: 30 }}>
                <ChevronRightIcon
                  onClick={() => {
                    pipe.stepi(1);
                    this.setState({ stageRegisters: pipe.getStageRegisters() });
                    this.setState({ registerFile: pipe.getRegisterFile() });
                    console.log(this.state.stageRegisters);
                  }}
                  onDoubleClick={() => {
                    this.runPipe(1000);
                  }}
                />
              </Fab>
            </Zoom>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainLayout);
