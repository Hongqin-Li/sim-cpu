import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";

import "./styles.css";

/* Classes */
class RegisterFile {
  constructor() {
    this.A = VALZERO.slice();
    this.B = VALZERO.slice();
    this.M = VALZERO.slice();
    this.E = VALZERO.slice();
    /*this.B = ["00","00","00","00","00","00","00","00"];
    this.M = ["00","00","00","00","00","00","00","00"];
    this.E = ["00","00","00","00","00","00","00","00"];
    */
    this.srcA = this.srcB = this.dstM = this.dstE = RNONE;
    this.registers = [[""]];
    this.registers.length = 16;
    for (let i = 0; i < 16; i++) this.registers[i] = this.A;
    console.log(this.registers);
  }
  reset() {
    this.A = VALZERO.slice();
    this.B = VALZERO.slice();
    this.M = VALZERO.slice();
    this.E = VALZERO.slice();
    for (let i = 0; i < 16; i++) this.registers[i] = VALZERO.slice();
    this.srcA = this.srcB = this.dstM = this.dstE = RNONE;
  }
  read() {
    this.A = this.registers[this.srcA].slice();
    this.B = this.registers[this.srcB].slice();
  }
  write() {
    //!caution, if dstE == dstM(!=RNONE)(e.g. pop %rsp), only to write dstM

    this.registers[this.dstE] = this.E.slice();
    this.registers[this.dstM] = this.M.slice();
  }
}

/* Classes end */

const MAX_MEM = 1000;

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

const VALZERO = ["00", "00", "00", "00", "00", "00", "00", "00"];

/**  Stage Registers **/
let F_predPC = VALZERO.slice(),
  F_stall,
  F_bubble;
let D_stat, D_icode, D_ifun, D_rA, D_rB, D_valC, D_valP, D_stall, D_bubble;
let E_stat,
  E_icode,
  E_ifun,
  E_dstE,
  E_dstM,
  E_srcA,
  E_srcB,
  E_valA,
  E_valB,
  E_valC,
  E_stall,
  E_bubble;
let M_stat, M_icode, M_Cnd, M_dstE, M_dstM, M_valA, M_valE, M_stall, M_bubble;
let W_stat, W_icode, W_dstE, W_dstM, W_valM, W_valE, W_stall, W_bubble;

/** Stage outputs **/
let f_predPC,
  f_stat,
  f_icode,
  f_ifun,
  f_rA,
  f_rB,
  f_valC,
  f_valP,
  f_stall,
  f_bubble;
let d_stat,
  d_icode,
  d_ifun,
  d_valA,
  d_valB,
  d_valC,
  d_dstE,
  d_dstM,
  d_srcA,
  d_srcB,
  d_stall,
  d_bubble;
let e_stat, e_icode, e_Cnd, e_dstE, e_dstM, e_valA, e_valE, e_stall, e_bubble;
let m_stat, m_icode, m_dstE, m_dstM, m_valM, m_valE, m_stall, m_bubble;

let imem_error, dmem_error;
let Memory = ["0"];
Memory.length = MAX_MEM;

let registerFile = new RegisterFile();

let alu_cc;
let set_cc;
let CC;
let Stat;

//everything named val is stored by string array ,each byte

//should be positive;
function intToVal(x) {
  let rtn = [""];
  rtn.length = 8;
  for (let i = 0; i < 8; i++) {
    let temp = x & 0xff;
    rtn[i] = temp.toString(16);
    if (rtn[i].length == 1) rtn[i] = "0" + rtn[i];
    x >>= 8;
  }
  return rtn;
}
/* return string */
function valToHex(val) {
  let rtn = "";
  let zero_front = true;
  let i = 7;
  while (i >= 0 && parseInt(val[i], 16) == 0) {
    i--;
  }
  if (i < 0) return "0";
  if (val[i][0] != "0") rtn += val[i][0];
  rtn += val[i][1];
  for (let j = i - 1; j >= 0; j--) {
    rtn += val[j][0] + val[j][1];
  }
  return rtn;
}
//return a val
function addq(valA, valB) {
  let rtn = [""];
  rtn.length = 8;
  let carry = 0;
  for (let i = 0; i < 8; i++) {
    let int_sum = parseInt(valA[i], 16) + parseInt(valB[i], 16) + carry;
    carry = int_sum >> 8;
    let s = int_sum & 0xff;
    let str_s = s.toString(16);
    if (str_s.length == 1) rtn[i] = "0" + str_s;
    else rtn[i] = str_s;
  }
  //overflow
  //if (carry) console.log("overflow");

  return rtn;
}
function subq(valA, valB) {
  let rtn = [""];
  let notB = xorq(valB, ["ff", "ff", "ff", "ff", "ff", "ff", "ff", "ff"]);
  return addq(
    valA,
    addq(notB, ["01", "00", "00", "00", "00", "00", "00", "00"])
  );
}
function andq(valA, valB) {
  let rtn = [""];
  rtn.length = 8;
  for (let i = 0; i < 8; i++) {
    let s = parseInt(valA[i], 16) & parseInt(valB[i], 16) & 0xff;
    rtn[i] = s.toString(16);
    if (rtn[i].length == 1) rtn[i] = "0" + rtn[i];
  }
  return rtn;
}
function xorq(valA, valB) {
  let rtn = [""];
  rtn.length = 8;
  for (let i = 0; i < 8; i++) {
    let s = (parseInt(valA[i], 16) ^ parseInt(valB[i], 16)) & 0xff;
    rtn[i] = s.toString(16);
    if (rtn[i].length == 1) rtn[i] = "0" + rtn[i];
  }
  return rtn;
}

/* read eight bytes from memory, return null when error*/
/* return rtn = ["00", "02", ...] */
function readMemory(addr, bytes = 8) {
  if (addr + bytes > MAX_MEM || addr < 0) return null;
  let rtn = [""];
  rtn.length = bytes;
  for (let i = 0; i < bytes; i++) {
    rtn[i] = Memory[addr + i];
  }
  return rtn;
}
/* write val into memory e.g. val = ["00", "01"]*/
function writeMemory(addr, val) {
  let len = val.length;
  if (addr + len > MAX_MEM || addr < 0) return null;
  for (let i = 0; i < len; i++) {
    Memory[addr + i] = val[i];
  }
}

function setCode(code) {
  let isValid = true;
  for (let i = 0; i < code.length; i++) {
    if (code[i] == "\n") {
      isValid = true;
      continue;
    }
    if (
      isValid &&
      i + 2 < code.length &&
      code[i] == "0" &&
      code[i + 1] == "x"
    ) {
      isValid = false;

      let hex_addr = "";
      let addr;
      i++;
      //console.log("find it" + code[i + 2] + code[i + 3] + code[i + 4]);
      while (code[++i] == "0") {}
      while (code[i] != ":") hex_addr += code[i++];
      addr = parseInt(hex_addr, 16);
      if (isNaN(addr)) {
        addr = 0;
      }
      i += 2;
      let j;
      for (j = 0; i + j < code.length && code[i + j] != " "; j = j + 2) {
        Memory[addr + (j >> 1)] = code[i + j];
        Memory[addr + (j >> 1)] += code[i + j + 1];
      }
      i += j - 1;
    } else isValid = false;
  }
  console.log(Memory);
}

function ops(a, b, ifun) {
  let rtn;
  switch (ifun) {
    case 0:
      rtn = addq(a, b);
      break;
    case 1:
      rtn = subq(a, b);
      break;
    case 2:
      rtn = andq(a, b);
      break;
    case 3:
      rtn = xorq(a, b);
      break;
    default:
      rtn = null;
      break;
  }
  let rtn_sign = parseInt(rtn[7], 16) >> 7;
  let a_sign = parseInt(a[7], 16) >> 7;
  let b_sign = parseInt(b[7], 16) >> 7;
  alu_cc = 0;
  if (rtn == VALZERO) alu_cc |= ZF;
  if (rtn_sign == 1) alu_cc |= SF;
  if (a_sign == b_sign && rtn_sign != a_sign) alu_cc |= OF;

  return rtn;
}

/* long long */
function check_f_pc() {
  //!Mispredicted branch. Fetch at incremented PC
  if (M_icode == IJXX && !M_Cnd) return M_valA;
  //!Completion of RET instruction
  else if (W_icode == IRET) return W_valM;
  //!Default: Use predicted P
  else return F_predPC;
}
// return bool
function check_f_instr_valid(icode, ifun) {
  switch (icode) {
    case IJXX:
    case IRRMOVQ:
      return ifun < 7;
    case IOPQ:
      return ifun < 4;
    default:
      return ifun < 1;
  }
}
//return bool
function check_f_need_regids(icode) {
  switch (icode) {
    case IHALT:
    case INOP:
    case IJXX:
    case ICALL:
    case IRET:
      return false;
    default:
      return true;
  }
}
//return bool
function check_f_need_valC(icode) {
  switch (icode) {
    case IIRMOVQ:
    case IRMMOVQ:
    case IMRMOVQ:
    case IJXX:
    case ICALL:
      return true;
    default:
      return false;
  }
}
//return int
function check_f_stat(imem_error, instr_valid, icode) {
  if (imem_error == true) return SADR;
  else if (!instr_valid == true) return SINS;
  else if (icode == IHALT) return SHLT;
  else return SAOK;
}
//return int
function check_d_srcA() {
  switch (D_icode) {
    case IRRMOVQ:
    case IRMMOVQ:
    case IOPQ:
    case IPUSHQ:
      return D_rA;
    case IPOPQ:
    case IRET:
      return RRSP;
    default:
      return RNONE;
  }
}

//return  int
function check_d_srcB() {
  switch (D_icode) {
    case IMRMOVQ:
    case IRMMOVQ:
    case IOPQ:
      return D_rB;

    case IPUSHQ:
    case IPOPQ:
    case ICALL:
    case IRET:
      return RRSP;
    default:
      return RNONE;
  }
}
//return int
function check_d_dstM() {
  switch (D_icode) {
    case IMRMOVQ:
    case IPOPQ:
      return D_rA;
    default:
      return RNONE;
  }
}
//return int
function check_d_dstE() {
  switch (D_icode) {
    case IRRMOVQ: //condition move
    case IIRMOVQ:
    case IOPQ:
      return D_rB;
    case IPUSHQ:
    case IPOPQ:
    case ICALL:
    case IRET:
      return RRSP;
    default:
      return RNONE;
  }
}
//return long long(long long d_rvalA)
function check_d_valA(d_srcA, d_rvalA) {
  if (D_icode == ICALL || D_icode == IJXX) {
    return D_valP;
  } else if (d_srcA == e_dstE) {
    return e_valE;
  } else if (d_srcA == M_dstM) {
    return m_valM;
  } else if (d_srcA == M_dstE) {
    return M_valE;
  } else if (d_srcA == W_dstM) {
    return W_valM;
  } else if (d_srcA == W_dstE) {
    return W_valE;
  } else return d_rvalA;
}

//return long long(long long d_rvalB)
function check_d_valB(d_srcB, d_rvalB) {
  if (d_srcB == e_dstE) {
    return e_valE;
  } else if (d_srcB == M_dstM) {
    return m_valM;
  } else if (d_srcB == M_dstE) {
    return M_valE;
  } else if (d_srcB == W_dstM) {
    return W_valM;
  } else if (d_srcB == W_dstE) {
    return W_valE;
  } else return d_rvalB;
}

//long long: return, valA, valC
function check_e_aluA(icode, valA, valC) {
  switch (icode) {
    case IRRMOVQ:
    case IOPQ:
      return valA;

    case IIRMOVQ:
    case IRMMOVQ:
    case IMRMOVQ:
      return valC;

    case ICALL:
    case IPUSHQ:
      return ["f8", "ff", "ff", "ff", "ff", "ff", "ff", "ff"];
    //subq(VALZERO.slice());

    case IRET:
    case IPOPQ:
      return ["08", "00", "00", "00", "00", "00", "00", "00"];
    //other operation don't need aluB
    default:
      return VALZERO;
  }
}
//long long: return, valB, valC
function check_e_aluB(icode, valB, valC) {
  switch (icode) {
    case IRMMOVQ:
    case IMRMOVQ:
    case IOPQ:
    case ICALL:
    case IPUSHQ:
    case IRET:
    case IPOPQ:
      return valB;

    case IRRMOVQ:
    case IIRMOVQ:
      return VALZERO;
    //other operation don't need aluB
    default:
      return VALZERO;
  }
}
//long long: return, a, b, t
//!alu_cc global, modify it also
function check_e_valE(alufun, valA, valB) {
  return ops(valA, valB, alufun);
}

//return bool
/************ modify it ***********/
function check_e_cond(ifun) {
  switch (ifun) {
    case 1:
      return CC & (ZF | SF);
    case 2:
      return CC & SF;
    case 3:
      return CC & ZF;
    case 4:
      return !(CC & ZF);
    case 5:
      return !(CC & SF);
    case 6:
      return !(CC & (ZF | SF));
    default:
      return true;
  }
}

//long long: return, valA, valE
function check_m_mem_addr(icode, valA, valE) {
  switch (icode) {
    case IRMMOVQ:
    case IPUSHQ:
    case ICALL:
    case IMRMOVQ:
      return valE;

    case IPOPQ:
    case IRET:
      return valA;
    default:
      return VALZERO;
  }
}

function doFetch() {
  /* Stage values */
  //bool
  let instr_valid, need_regids, need_valC;
  //let imem_error;

  let stat;

  /* should be long long */
  let pc;
  let predPC;
  let valC, valP;

  //int
  let split, align;
  let icode, ifun;
  let rA, rB;

  /** Select PC **/

  //now pc is a int
  pc = parseInt(valToHex(check_f_pc()), 16);
  console.log("pc is" + pc);
  /** Fetch **/
  split = readMemory(pc, 1);
  align = readMemory(pc + 1, 1);
  console.log(split);
  console.log(align);
  icode = parseInt(split[0][0], 16);
  ifun = parseInt(split[0][1], 16);
  console.log("icode: " + icode + ", ifun" + ifun);

  //bool
  instr_valid = check_f_instr_valid(icode, ifun);
  need_regids = check_f_need_regids(icode);
  need_valC = check_f_need_valC(icode);
  console.log(need_regids);
  stat = check_f_stat(imem_error, instr_valid, icode);

  rA = need_regids ? parseInt(align[0][0], 16) : RNONE;
  rB = need_regids ? parseInt(align[0][1], 16) : RNONE;

  valC = need_valC ? readMemory(pc + 1 + need_regids) : [""];
  //valP is int
  valP = intToVal(pc + 1 + need_regids + (need_valC << 3));

  predPC =
    icode == IJXX || icode == ICALL ? parseInt(valToHex(valC), 16) : valP;

  /** Update **/
  f_stat = stat;
  f_icode = icode;
  f_ifun = ifun;
  f_rA = rA;
  f_rB = rB;
  f_valC = valC;
  f_valP = valP;
  f_predPC = predPC;

  console.log("f_stat: " + f_stat);
  console.log("f_icode: " + f_icode);
  console.log("f_ifun: " + f_ifun);
  console.log("f_rA: " + f_rA);
  console.log("f_rB:" + f_rB);

  console.log("f_valC: " + f_valC);
  console.log("f_valP: " + f_valP);
  console.log("f_predPC: " + f_predPC);
}
function doDecode() {
  let stat;

  let rvalA, rvalB;
  let dstE, dstM;
  let valA, valB;

  let srcA, srcB;

  dstE = check_d_dstE();
  dstM = check_d_dstM();
  srcA = check_d_srcA();
  srcB = check_d_srcB();

  registerFile.srcA = srcA;
  registerFile.srcB = srcB;
  ///read registerFile as if it were a combinational logic
  ///i.e. update the read port A B immediately.
  registerFile.read();

  //should not be modified;
  rvalA = registerFile.A;
  rvalB = registerFile.B;

  /** Sel + Fwd A and Fwd B **/
  valA = check_d_valA(srcA, rvalA);
  valB = check_d_valB(srcB, rvalB);

  /** Update **/
  Stat = W_stat == SBUB ? SAOK : W_stat;

  d_stat = D_stat;
  d_icode = D_icode;
  d_ifun = D_ifun;
  d_valC = D_valC;
  d_valA = valA;
  d_valB = valB;
  d_dstE = dstE;
  d_dstM = dstM;
  d_srcA = srcA;
  d_srcB = srcB;

  /** print **/
  console.log("d_stat: " + d_stat);
  console.log("d_icode: " + d_icode);
  console.log("d_ifun: " + d_ifun);
  console.log("d_valC: " + d_valC);
  console.log("d_valA: " + d_valA);
  console.log("d_valB: " + d_valB);
  console.log("d_dstE: " + d_dstE);

  return 0;
}
function doExecute() {
  //alu_cc;//!cc from alu
  let cond;
  let alufun;
  let dstE;

  let aluA, aluB;
  let valE;

  alufun = E_icode == IOPQ ? E_ifun : ALUADD;
  aluA = check_e_aluA(E_icode, E_valA, E_valC);
  aluB = check_e_aluB(E_icode, E_valB, E_valC);

  set_cc =
    E_icode == IOPQ &&
    !(
      m_stat == SADR ||
      m_stat == SINS ||
      m_stat == SHLT ||
      (W_stat == SADR || W_stat == SINS || W_stat == SHLT)
    );

  //!also update alu_cc
  valE = ops(aluA, aluB, alufun);

  cond = check_e_cond(E_ifun);
  //!update dstE according to condition codes
  dstE = E_icode == IRRMOVQ ? (cond ? E_dstE : RNONE) : E_dstE;

  /** Update **/
  if (set_cc) {
    CC = alu_cc;
    console.log("updateCC: " + CC);
  }

  e_stat = E_stat;
  e_icode = E_icode;
  e_Cnd = cond;
  e_valE = valE.slice();
  e_valA = E_valA.slice();
  e_dstE = dstE;
  e_dstM = E_dstM;
  console.log("CC: " + CC);
  console.log("e_stat: " + e_stat);
  console.log("e_icode: " + e_icode);
  console.log("e_Cnd: " + e_Cnd);
  console.log("e_valE: " + e_valE);
  console.log("e_valA: " + e_valA);
  console.log("e_dstE: " + e_dstE);
  console.log("e_dstM: " + e_dstM);
}
function doMemory() {
  let stat;
  dmem_error = false;
  let mem_read, mem_write;
  //long long
  let data_in, addr;
  let valM = VALZERO.slice();

  mem_read = M_icode == IMRMOVQ || M_icode == IPOPQ || M_icode == IRET;
  mem_write = M_icode == IRMMOVQ || M_icode == IPUSHQ || M_icode == ICALL;

  addr = check_m_mem_addr(M_icode, M_valA, M_valE);
  data_in = M_valA;

  if (mem_read) valM = readMemory(addr, 8);

  if (mem_write) {
    writeMemory(addr, data_in);
  }

  stat = dmem_error ? SADR : M_stat;

  /** Update **/
  m_stat = stat;
  m_icode = M_icode;
  m_valE = M_valE.slice();
  m_valM = valM.slice();
  m_dstE = M_dstE;
  m_dstM = M_dstM;

  console.log("");
}
function doWriteback() {
  Stat = W_stat == SBUB ? SAOK : W_stat;

  registerFile.dstE = W_dstE;
  registerFile.dstM = W_dstM;
  registerFile.E = W_valE.slice();
  registerFile.M = W_valM.slice();
}

function doControlLogic() {
  let mispredicted_branch = E_icode == IJXX && !e_Cnd;
  let load_use_hazard =
    (E_icode == IMRMOVQ || E_icode == IPOPQ) &&
    (E_dstM == d_srcA || E_dstM == d_srcB);
  let exception =
    m_stat == SADR ||
    m_stat == SINS ||
    m_stat == SHLT ||
    (W_stat == SADR || W_stat == SINS || W_stat == SHLT);

  F_stall =
    load_use_hazard || (D_icode == IRET || E_icode == IRET || M_icode == IRET);
  F_bubble = false;

  D_stall = load_use_hazard;
  D_bubble =
    (E_icode == IJXX && !e_Cnd) ||
    (!(
      (E_icode == IMRMOVQ || E_icode == IPOPQ) &&
      (E_dstM == d_srcA || E_dstM == d_srcB)
    ) &&
      (D_icode == IRET || E_icode == IRET || M_icode == IRET));

  E_stall = false;
  E_bubble = mispredicted_branch || load_use_hazard;

  W_stall = W_stat == SADR || W_stat == SINS || W_stat == SHLT;
  W_bubble = false;

  M_stall = false;
  M_bubble =
    W_stat == SADR ||
    W_stat == SINS ||
    W_stat == SHLT ||
    (m_stat == SADR || m_stat == SINS || m_stat == SHLT);
}

function updateStageRegisters() {
  if (W_bubble) {
    //rest regW;
    W_stat = SBUB;
  } else if (!W_stall) {
    W_stat = m_stat;
    W_icode = m_icode;
    W_valE = m_valE.slice();
    W_valM = m_valM.slice();
    W_dstE = m_dstE;
    W_dstM = m_dstM;
  }

  if (M_bubble) {
    //M_reset();
    M_stat = SBUB;
  } else if (!W_stall) {
    M_stat = e_stat;
    M_icode = e_icode;
    M_valA = e_valA.slice();
    M_valE = e_valE.slice();
    M_dstE = e_dstE;
    M_dstM = e_dstM;
    M_Cnd = e_Cnd;
  }

  if (E_bubble) {
    //E_reset();
    E_stat = SBUB;
  } else if (!E_stall) {
    E_stat = d_stat;
    E_icode = d_icode;
    E_ifun = d_ifun;
    E_valA = d_valA.slice();
    E_valB = d_valB.slice();
    E_valC = d_valC.slice();
    E_srcA = d_srcA;
    E_srcB = d_srcB;
    E_dstE = d_dstE;
    E_dstM = d_dstM;
  }

  if (D_bubble) {
    //D_reset();
    D_stat = SBUB;
  } else if (!D_stall) {
    D_stat = f_stat;
    D_icode = f_icode;
    D_ifun = f_ifun;
    D_rA = f_rA;
    D_rB = f_rB;
    D_valC = f_valC.slice();
    D_valP = f_valP.slice();
  }
  if (F_bubble) {
    //F_reset();
    //!no stat in regF
  } else if (!F_stall) F_predPC = f_predPC;
}

function step() {
  doWriteback();
  doMemory();
  doExecute();
  doDecode();
  doFetch();
}
function App() {
  function handleUpload(event) {
    let fileReader = new FileReader();
    fileReader.onload = function(event) {
      let str = event.target.result;

      /* code setting */
      setCode(str);
      ReactDOM.render(<App />, rootElement);
    };
    fileReader.readAsText(event.target.files[0]);
  }
  return (
    <div className="App">
      <h1>Hello</h1>

      <br />

      <div>
        <Button variant="contained" component="span" onClick={step}>
          step
        </Button>
        <input
          accept=".yo"
          id="contained-button-file"
          multiple
          type="file"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);