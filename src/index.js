import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const IHALT = 0,
  INOP = 1,
  IRRMOVQ = 2,
  IIRMOVQ = 3,
  IRMMOVQ = 4,
  IMRMOVQ = 5,
  IOPQ = 6,
  IJXX = 7,
  ICALL = 8,
  IRET = 9,
  IPUSHQ = 10,
  IPOPQ = 11;
const FNONE = 0;
const RNONE = 15,
  RRSP = 4;
const ALUADD = 0;
const SAOK = 1,
  SADR = 2,
  SINS = 3,
  SHLT = 4,
  SBUB = 5;
const ZF = 4,
  SF = 2,
  OF = 1;

let F_predPC;
let D_stat, D_icode, F_ifun, F_rA, F_rB, F_valC, F_valP, F_stall, F_bubble;
let E_stat,
  E_icode,
  E_ifun,
  E_dstE,
  E_dstM,
  E_srcE,
  E_srcM,
  E_valA,
  E_valB,
  E_valC,
  E_stall,
  E_bubble;
function fetch() {}
function decode() {}
function execute() {}
function memory() {}
function writeback() {}

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <h3>{}</h3>
    </div>
  );
}
function Rend() {
  return <div className="Rend1">myrend</div>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(Rend(), rootElement);
