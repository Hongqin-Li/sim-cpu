import React, { Fragment } from "react";

import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardActionArea from "@material-ui/core/CardActionArea";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import Zoom from "@material-ui/core/Zoom";
import Grow from "@material-ui/core/Grow";
import Collapse from "@material-ui/core/Collapse";
import Slide from "@material-ui/core/Slide";

import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import brown from "@material-ui/core/colors/brown";
import yellow from "@material-ui/core/colors/yellow";
import orange from "@material-ui/core/colors/orange";
import deepOrange from "@material-ui/core/colors/deepOrange";
import purple from "@material-ui/core/colors/purple";

import grey from "@material-ui/core/colors/grey";

import PropTypes from "prop-types";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
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
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";
import ReorderIcon from "@material-ui/icons/Reorder";
import PauseIcon from "@material-ui/icons/Pause";
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

import Snackbar from "@material-ui/core/Snackbar";

import { Pipe } from "./pipe.js";
const appBarTitle = "COLORFUL CPU";

const stats = ["", "SAOK", "SADR", "SINS", "SHLT", "SBUB"];
const aboutText =
  "A Pipe-line Y86-64 CPU Simulator using React and Matreial-ui by Leehq";
let stageColor = [red[500], purple[500], orange[500], green[500], blue[500]];

let stageRefreshTimeout = 500;

let runTimeout = 1000;
const speedOpt = [1, 5, 10, 20];

let colorDel = 1;
let pipe = new Pipe();
pipe.init();
let breakPoints = new Set();

const appBarHeight = 70;

const theme = createMuiTheme({
  palette: {
    primary: brown,
    //secondary: ,
    background: {
      default: grey[200]
    }
  },
  typography: {
    useNextVariants: true,
    fontSize: 13,
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
    height: "100%",
    backgroundColor: grey[200]
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

class StageCards extends React.Component {
  state = {
    grow: [true, false, false, false, false, false],
    stageRegisters: this.props.stageRegisters,
    onRefresh: false,
    in: true,
    x: 0,
    y: 0,
    position: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    ref: [undefined, undefined, undefined, undefined, undefined]
  };
  changePosition(index) {
    let rect = this.ref[index].getBoundingClientRect();
    let randX = Math.random();
    let randY = Math.random();

    let x =
      (window.innerWidth / 5 - rect.width / 2) * randX +
      ((window.innerWidth * 4) / 5 - rect.width / 2) * (1 - randX);
    let y =
      (window.innerHeight / 3 - rect.height / 2) * randY +
      ((window.innerHeight * 2) / 3 - rect.height / 2) * (1 - randY);
    let newPos = this.state.position;
    newPos[index][0] = x;
    newPos[index][1] = y;
    this.setState({
      position: newPos
    });
  }

  componentDidMount() {
    for (let i = 0; i < 5; i++) this.changePosition(i);
  }
  render() {
    const time = runTimeout / 10;
    const timeout = time > 200 ? time : 200;
    const delay = timeout >> 2;
    if (this.ref == undefined) {
      this.ref = [];
      this.ref.length = 5;
    }

    const { classes } = this.props;
    const stages = ["Write-back", "Memory", "Execute", "Decode", "Fetch"];
    //console.log("render");
    const stageRegisters = this.props.stageRegisters;

    //this.setState({refresh:this.props.refresh});
    return stages.map((name, index) => (
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          left: this.state.position[index][0],
          top: this.state.position[index][1]
        }}
        ref={ref => {
          this.ref[index] = ref;
        }}
      >
        <React.Fragment>
          <Grow
            unmountOnExit
            //mountOnEnter

            in={
              index == 0 && !this.state.onRefresh
                ? !this.props.hide
                : this.state.grow[index]
            }
            timeout={timeout}
            onEnter={() => {
              //console.log(index+" enter");
              if (index == 0) this.setState({ onRefresh: true });
              setTimeout(() => {
                let newGrow = this.state.grow;
                newGrow[index + 1] = true;
                this.setState({ grow: newGrow });
              }, delay);
            }}
            onEntered={() => {
              if (index == 4) {
                let newGrow = this.state.grow;
                newGrow[0] = false;
                this.setState({ grow: newGrow });
              }
            }}
            onExit={() => {
              //console.log(index+" exit");
              if (index == 0) {
                this.setState({ onRefresh: true });
              }
              setTimeout(() => {
                let newGrow = this.state.grow;
                newGrow[index + 1] = false;
                this.setState({ grow: newGrow });
              }, delay);
            }}
            onExited={() => {
              //console.log(index + " exited");
              //console.log("******set state");
              this.changePosition(index);
              if (index == 4) {
                this.setState({
                  onRefresh: false,
                  stageRegisters: this.props.stageRegisters
                });
                if (this.props.hide) return;
                let newGrow = this.state.grow;
                newGrow[0] = true;
                this.setState({ grow: newGrow });
                //this.setState({ in: true });
              }
            }}
          >
            <Card>
              <CardActionArea
                style={{
                  backgroundColor:
                    this.state.stageRegisters[index][0][1] === "SAOK" ||
                    index == 4
                      ? stageColor[index]
                      : grey[500]
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor:
                          this.state.stageRegisters[index][0][1] === "SAOK" ||
                          index == 4
                            ? stageColor[index]
                            : grey[500]
                      }}
                    >
                      {name[0]}
                    </Avatar>
                  }
                  title={name}
                />
              </CardActionArea>
              <CardContent>
                {this.state.stageRegisters[index].map((prop, index) => (
                  <Typography component="p">
                    {prop[1] == "" ? "" : "[" + prop[0] + "] " + prop[1] + " "}{" "}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grow>
        </React.Fragment>
      </div>
    ));
  }
}

class CodeLayout extends React.Component {
  render() {
    const { classes } = this.props;
    const parent = this.props.parent;
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
          {code.map((line, index) => {
            let address;
            if (line.length >= 5 && line[0] == "0" && line[1] == "x") {
              let i = 2;
              address = "";
              while (line[i] == "0") {
                i++;
              }
              while (line[i] != ":") {
                address += line[i++];
              }
              if (address.length == 0) address = "0";
            }

            return (
              <div>
                <Typography
                  addr={address}
                  //classes={addr}
                  style={{
                    //border: "1px blue solid",
                    fontSize: 15
                  }}
                  onContextMenu={() => {}}
                  onDoubleClick={event => {
                    let nameMap = event.target.attributes;
                    if (nameMap.addr == undefined) return;
                    if (event.target.isbreakpoint) {
                      event.target.isbreakpoint = false;
                      //delete breakpoint
                      pipe.deleteBreakpoint(nameMap.addr.value);
                      breakPoints.delete(nameMap.addr.value);
                      parent.toast(
                        "Delete breakpoint at: 0x" + nameMap.addr.value
                      );
                      event.target.style.fontWeight = "normal";
                    } else {
                      event.target.isbreakpoint = true;
                      //add in break point;
                      pipe.addBreakpoint(nameMap.addr.value);
                      breakPoints.add(nameMap.addr.value);
                      parent.toast(
                        "Add breakpoint at: 0x" + nameMap.addr.value
                      );
                      event.target.style.fontWeight = "bold";
                    }
                  }}
                  onMouseEnter={event => {
                    //console.log("mouse in");
                    //console.log(event.clientX);
                    event.target.style.fontWeight = "bold";
                  }}
                  onMouseOut={event => {
                    if (!event.target.isbreakpoint)
                      event.target.style.fontWeight = "normal";
                  }}
                >
                  {line}
                </Typography>
              </div>
            );
          })}
          {
            //}    </List>
          }{" "}
        </Paper>
      </div>
    );
  }
}

class StageRegistersLayout extends React.Component {
  state = {
    grow: [true, false, false, false, false, false],
    stageRegisters: this.props.stageRegisters,
    stageStuffs: this.props.stageStuffs,
    onRefresh: false,
    in: true,
    anchorEl: null,
    popText: ""
  };

  render() {
    const delay = 10;
    const timeout = 200;

    const { classes } = this.props;
    const stages = ["Write-back", "Memory", "Execute", "Decode", "Fetch"];
    //console.log("render");
    const stageRegisters = this.props.stageRegisters;
    const stageStuffs = this.props.stageStuffs;
    const { anchorEl } = this.state;
    //this.setState({refresh:this.props.refresh});
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Paper style={{ height: "100%", overflow: "auto" }}>
          <List className={classes.list}>
            <ListSubheader className={classes.subHeader}>
              Stage Registers
            </ListSubheader>

            <Popover
              id="simple-popper"
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => {
                this.setState({
                  anchorEl: null
                });
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <Typography style={{ margin: theme.spacing.unit * 2 }}>
                {this.state.popText}
              </Typography>
            </Popover>

            {stages.map((name, index) => (
              <React.Fragment>
                <Grow
                  in={
                    index == 0 && !this.state.onRefresh
                      ? this.props.hide
                        ? false
                        : this.props.in
                      : this.state.grow[index]
                  }
                  timeout={timeout}
                  onEnter={() => {
                    //console.log(index+" enter");
                    setTimeout(() => {
                      let newGrow = this.state.grow;
                      newGrow[index + 1] = true;
                      this.setState({ grow: newGrow });
                    }, delay);
                  }}
                  onEntered={() => {
                    //console.log(index + " entered ");
                    //console.log(" onrefresh"+this.state.onRefresh);
                    //console.log("props in "+this.props.in);
                    if (index == 4) {
                      this.setState({ onRefresh: false });
                      this.setState({ in: false });
                    }
                  }}
                  onExit={() => {
                    //console.log(index+" exit");
                    if (index == 0) {
                      let newGrow = this.state.grow;
                      newGrow[0] = false;
                      this.setState({ grow: newGrow });
                      this.setState({ onRefresh: true });
                    }
                    setTimeout(() => {
                      let newGrow = this.state.grow;
                      newGrow[index + 1] = false;
                      this.setState({ grow: newGrow });
                    }, delay);
                  }}
                  onExited={() => {
                    //console.log(index + " exited");
                    //console.log("******set state");
                    if (index == 4) {
                      let newGrow = this.state.grow;
                      newGrow[0] = true;
                      this.setState({ grow: newGrow });
                      this.setState({
                        stageRegisters: this.props.stageRegisters
                      });
                      //this.setState({ in: true });
                    }
                  }}
                >
                  <ListItem
                    button
                    onClick={event => {
                      this.setState({
                        popText: this.props.stageStuffs[index].map(
                          (prop, index) =>
                            prop[1] == "" || prop[1] == undefined
                              ? ""
                              : "[" + prop[0] + "] " + prop[1] + " "
                        ),
                        anchorEl: event.currentTarget
                      });
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor:
                          this.state.stageRegisters[index][0][1] === "SAOK" ||
                          index == 4
                            ? stageColor[index]
                            : grey[500]
                      }}
                    >
                      {" "}
                      {name[0]}
                    </Avatar>

                    <ListItemText
                      primary={this.state.stageRegisters[index].map(
                        (prop, index) =>
                          prop[1] == ""
                            ? ""
                            : "[" + prop[0] + "] " + prop[1] + " "
                      )}
                    />
                  </ListItem>
                </Grow>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </div>
    );
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

class MenuLayout extends React.Component {
  state = {
    settingExpanded: false,
    openMemory: false,
    openAbout: false,
    memory: [],
    speedMenuOpen: false,
    anchorEl: null,
    speedIndex: 0
  };
  Transition(props) {
    return <Slide direction="up" {...props} />;
  }

  render() {
    const { anchorEl } = this.state;
    return (
      <div>
        <List>
          <ListItem>
            <ListItemText primary="HELLO" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              this.setState({ settingExpanded: !this.state.settingExpanded });
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Setting" />
          </ListItem>
          <Collapse
            in={this.state.settingExpanded}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={event => {
                  this.setState({ anchorEl: event.currentTarget });
                }}
              >
                <ListItemText inset primary="Speed" />
              </ListItem>
            </List>
            <Menu
              id="speed-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => {
                //runTimeout = 1000/ speedOpt[this.state.speedIndex];
                //console.log("runtimeout:"+runTimeout);
                this.setState({ anchorEl: null });
              }}
            >
              {speedOpt.map((option, index) => (
                <MenuItem
                  key={option}
                  selected={index === this.state.speedIndex}
                  onClick={event => {
                    runTimeout = 1000 / speedOpt[index];
                    console.log("runtimeout:" + runTimeout);
                    this.setState({ speedIndex: index, anchorEl: null });
                  }}
                >
                  {speedOpt[index]}
                </MenuItem>
              ))}
            </Menu>
          </Collapse>

          <ListItem
            button
            onClick={() => {
              //show stack
              this.setState({
                openMemory: true,
                memory: pipe.getMemory()
              });
            }}
          >
            <ListItemIcon>
              <ReorderIcon />
            </ListItemIcon>
            <ListItemText primary="Memory" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key="About"
            onClick={() => {
              this.setState({
                openAbout: true
              });
            }}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </List>

        <Dialog
          open={this.state.openMemory}
          onClose={() => {
            this.setState({ openMemory: false });
          }}
          scroll="paper"
          keepMounted
          TransitionComponent={this.Transition}
        >
          <DialogTitle>Memory</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.memory.map((pair, index) => {
                return (
                  <Typography>{"0x" + pair[0] + ": " + pair[1]}</Typography>
                );
              })}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openAbout}
          onClose={() => {
            this.setState({ openAbout: false });
          }}
          scroll="paper"
          keepMounted
          TransitionComponent={this.Transition}
        >
          <DialogTitle>About</DialogTitle>
          <DialogContent>
            <DialogContentText>{aboutText}</DialogContentText>
          </DialogContent>
          <DialogActions />
        </Dialog>
      </div>
    );
  }
}

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpload = this.handleUpload.bind(this);
    this.state = {
      colorDeg: 45,
      colorL: 350,
      colorR: 25,
      code: ["Please upload a .yo file"],
      textHeight: "100%",
      cardsHide: false,
      cardsHalt: false,
      fabIn: true,
      onFabTransit: false,
      fabTooltipOpen: false,
      run: false,
      drawerOpen: false,
      onStageAnimation: false,
      stageIn: true,
      refreshStage: false,
      messageQueue: [],
      snackbarOpen: false,
      anchorEl: null,
      stageRegisters: pipe.getStageRegisters(),
      stageStuffs: pipe.getStageStuffs(),
      registerFile: pipe.getRegisterFile()
    };
    this.textFieldDiv = React.createRef();
  }
  toast(msg) {
    let msgQueue = this.state.messageQueue;
    msgQueue.push(msg);
    this.setState({
      messageQueue: msgQueue,
      snackbarOpen: !this.state.snackbarOpen
    });
  }

  handleUpload(event) {
    //console.log(event);
    let fileReader = new FileReader();
    let str;
    let t = this;
    fileReader.onload = function(event) {
      //console.log("fileReader onload: " + event);
      //alert("onload");
      str = event.target.result;
      pipe.init();
      pipe.setCode(str);
      //console.log("init get:");
      //console.log(pipe.getStageRegisters);
      //pipe.stepi(1);

      t.setState({ stageRegisters: pipe.getStageRegisters() });
      t.setState({ stageRegisters: pipe.getRegisterFile() });

      t.setState({ stageRegisters: pipe.getStageRegisters() });
      t.setState({ registerFile: pipe.getRegisterFile() });
      t.setState({ stageIn: false });
      setTimeout(() => {
        t.setState({ stageIn: true });
      }, 10);

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
      t.setState({ code: codeLines });
      //alert(pipe.Memory);
    };
    if (event.target.files.length) fileReader.readAsText(event.target.files[0]);
  }
  componentDidMount() {
    // this.setState({ textHeight: this.textFieldDiv.clientHeight });
    let t = this;
    setTimeout(function f() {
      t.setState({
        colorL: t.state.colorL + colorDel,
        colorR: t.state.colorR + colorDel
      });
      setTimeout(f, 50);
    }, 50);
  }

  refreshStageRegisters(flag = 1) {
    this.setState({ stageRegisters: pipe.getStageRegisters() });
    this.setState({ registerFile: pipe.getRegisterFile() });
    this.setState({
      stageStuffs: pipe.getStageStuffs()
    });
    if (flag) {
      this.setState({ stageIn: false });
      setTimeout(() => {
        this.setState({ stageIn: true });
      }, 100);
    }
  }

  /* run til breakpoint */
  runPipe() {
    let t = this;
    let temp = colorDel;
    colorDel = 10;
    //t.setState({run:true});
    setTimeout(function func() {
      let stat = t.stepPipe(1, 0);
      let PC = pipe.getPC();
      if (!t.state.run || stat || breakPoints.has(PC)) {
        t.toast("Stop at: 0x" + PC);
        if (t.state.run) {
          t.setState({
            fabIn: false
          });
        }
        colorDel = temp;
        t.refreshStageRegisters();
        return;
      }

      setTimeout(func, runTimeout);
    }, runTimeout);
  }

  stepPipe(i, flag = 1) {
    let rtn = pipe.stepi(i);
    switch (rtn) {
      case 2:
        this.toast("Address Error!");
        return rtn;
      case 3:
        this.toast("Instruction Invalid!");
        return rtn;
      case 4:
        this.toast("Halt!");
        return rtn;
    }
    this.refreshStageRegisters(flag);
    return rtn;
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    const drawerList = (
      <div className={classes.list}>
        <List>
          <ListItem>
            <ListItemText primary="HELLO" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Setting" />
          </ListItem>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <ListItem>
              <ListItemText primary="Speed" onClick={e => {}} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Speed" onClick={e => {}} />
            </ListItem>
          </Collapse>

          <ListItem>
            <ListItemText primary="" />
          </ListItem>
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
            <MenuLayout />
            <div
              tabIndex={0}
              role="button"
              onClick={() => {
                this.setState({ drawerOpen: false });
              }}
              onKeyDown={() => {
                this.setState({ drawerOpen: false });
              }}
            />
          </Drawer>
          <AppBar
            position="fixed"
            className={classes.appBar}
            style={{
              display: "flex",
              alignContent: "center",
              background:
                "linear-gradient(" +
                this.state.colorDeg +
                "deg, hsl(" +
                this.state.colorL +
                ",50%,60%) 30%, hsl(" +
                this.state.colorR +
                ",50%,60%)  90%)"
            }}
          >
            <Toolbar style={{ height: "100%" }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={() => {
                  this.setState({ drawerOpen: true });
                }}
              >
                <MenuIcon />
              </IconButton>
              <Tooltip title="Upload" enterDelay={1000} leaveDelay={200}>
                <IconButton
                  color="inherit"
                  onClick={() => this.fileUpload.click()}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                accept=".yo"
                ref={ref => (this.fileUpload = ref)}
                style={{ visibility: "hidden" }}
                onInput={this.handleUpload}
              />

              <Typography
                variant="h6"
                color="inherit"
                noWrap
                style={{ position: "absolute", right: 30 }}
              >
                {appBarTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          {
            //}toast
          }

          <Snackbar
            key={0}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={1000}
            onClose={() => {
              this.setState({
                snackbarOpen: false
              });
            }}
            onExited={() => {
              let msg = this.state.messageQueue;
              msg.shift();
              if (msg.length > 0) {
                this.setState({
                  messageQueue: msg,
                  snackbarOpen: true
                });
              }
            }}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{this.state.messageQueue[0]}</span>}
          />

          <main className={classes.content}>
            <div>
              <StageCards
                stageRegisters={this.state.stageRegisters}
                classes={classes}
                hide={!this.state.run}
              />
            </div>
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
                  width: "60%"
                }}
              >
                <CodeLayout
                  classes={classes}
                  code={this.state.code}
                  parent={this}
                />
              </div>

              <div
                style={{
                  //flex:1,
                  width: "40%"
                }}
              >
                <StageRegistersLayout
                  stageRegisters={this.state.stageRegisters}
                  stageStuffs={this.state.stageStuffs}
                  classes={classes}
                  in={this.state.stageIn}
                />
              </div>
            </div>
            <div style={{ marginBottom: theme.spacing.unit * 3 }}>
              <ExpansionPanel defaultExpanded={false} onMouseEnter={e => {}}>
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
            <TriTooltip title="Double Click to Run">
              <Zoom
                in={this.state.fabIn}
                onEntered={() => {
                  this.setState({
                    onFabTransit: false
                  });
                  if (this.state.run) {
                    this.runPipe();
                  }
                }}
                onExit={() => {
                  this.setState({
                    onFabTransit: true
                  });
                }}
                onExited={() => {
                  this.setState({
                    fabIn: true,
                    run: !this.state.run
                  });
                }}
              >
                <Fab
                  color="secondary"
                  style={{ margin: theme.spacing.unit * 3 }}
                >
                  {this.state.run ? (
                    <PauseIcon
                      onClick={() => {
                        //this.toast("stepi");
                        this.setState({
                          fabIn: false
                        });
                        //this.refreshStageRegisters();
                      }}
                    />
                  ) : (
                    <ChevronRightIcon
                      onClick={() => {
                        //this.toast("stepi");
                        this.stepPipe(1);
                      }}
                      onDoubleClick={() => {
                        if (this.state.onFabTransit) {
                          return;
                        }
                        this.toast("Run");
                        this.setState({
                          fabIn: false
                        });
                      }}
                    />
                  )}
                </Fab>
              </Zoom>
            </TriTooltip>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
class TriTooltip extends React.Component {
  state = {
    open: false,
    cnt: 3
  };
  render() {
    const props = this.props;
    return (
      <Tooltip
        title={this.props.title}
        enterDelay={500}
        leaveDelay={200}
        onOpen={() => {
          if (!this.state.cnt) return;
          this.setState({ cnt: this.state.cnt - 1 });
          this.setState({ open: true });
        }}
        onClose={() => {
          this.setState({ open: false });
        }}
        open={this.state.open}
        enterDelay={500}
        leaveDelay={200}
      >
        {props.children}
      </Tooltip>
    );
  }
}

MainLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainLayout);
