(function(){
  "use strict";

  const $value=document.getElementById("value");
  const $expr=document.getElementById("expr");

  let current="0";
  let previous=null;
  let operator=null;
  let resetNext=false;

  function formatNumber(n){
    if(n==="Error") return n;
    const num=parseFloat(n);
    if(!isFinite(num)) return "Error";
    if(Math.abs(num)>1e15) return num.toExponential(6);
    const str=num.toString();
    if(str.includes("e")) return str;
    const [int,dec]=str.split(".");
    const fmtInt=int.replace(/\B(?=(\d{3})+(?!\d))/g,",");
    return dec!==undefined?fmtInt+"."+dec:fmtInt;
  }

  function updateDisplay(){
    $value.textContent=formatNumber(current);
    if(previous!==null&&operator){
      $expr.textContent=formatNumber(previous)+" "+operator;
    }else{
      $expr.textContent="";
    }
  }

  function compute(a,b,op){
    const x=parseFloat(a),y=parseFloat(b);
    switch(op){
      case "+":return x+y;
      case "−":return x-y;
      case "×":return x*y;
      case "÷":return y===0?"Error":x/y;
      default:return y;
    }
  }

  function inputDigit(d){
    if(current==="Error"){current=d;resetNext=false;updateDisplay();return}
    if(resetNext){current=d;resetNext=false}
    else{current=current==="0"&&d!=="0"?d:current==="0"&&d==="0"?"0":current+d}
    if(current.replace(/[^0-9]/g,"").length>15) return;
    updateDisplay();
  }

  function inputDecimal(){
    if(resetNext){current="0.";resetNext=false;updateDisplay();return}
    if(!current.includes(".")){current+=".";updateDisplay()}
  }

  function inputOperator(op){
    if(current==="Error"){return}
    if(previous!==null&&operator&&!resetNext){
      const result=compute(previous,current,operator);
      current=result==="Error"?"Error":String(result);
      previous=current==="Error"?null:current;
    }else{
      previous=current;
    }
    operator=op;
    resetNext=true;
    updateDisplay();
  }

  function calculate(){
    if(operator===null||previous===null) return;
    const result=compute(previous,current,operator);
    const exprStr=formatNumber(previous)+" "+operator+" "+formatNumber(current)+" =";
    current=result==="Error"?"Error":String(result);
    previous=null;
    operator=null;
    resetNext=true;
    $expr.textContent=exprStr;
    $value.textContent=formatNumber(current);
  }

  function clear(){
    current="0";previous=null;operator=null;resetNext=false;
    updateDisplay();
  }

  function backspace(){
    if(resetNext||current==="Error"){clear();return}
    current=current.length>1?current.slice(0,-1):"0";
    updateDisplay();
  }

  function percent(){
    if(current==="Error") return;
    current=String(parseFloat(current)/100);
    updateDisplay();
  }

  document.querySelector(".keys").addEventListener("click",function(e){
    const btn=e.target.closest("button");
    if(!btn) return;
    const action=btn.dataset.action;
    switch(action){
      case "digit":inputDigit(btn.dataset.digit);break;
      case "decimal":inputDecimal();break;
      case "op":inputOperator(btn.dataset.op);break;
      case "equals":calculate();break;
      case "clear":clear();break;
      case "backspace":backspace();break;
      case "percent":percent();break;
    }
  });

  document.addEventListener("keydown",function(e){
    if(e.key>="0"&&e.key<="9"){inputDigit(e.key);return}
    switch(e.key){
      case ".":case",":inputDecimal();break;
      case "+":inputOperator("+");break;
      case "-":inputOperator("−");break;
      case "*":inputOperator("×");break;
      case "/":e.preventDefault();inputOperator("÷");break;
      case "%":percent();break;
      case "Enter":case"=":calculate();break;
      case "Backspace":backspace();break;
      case "Escape":case"Delete":clear();break;
    }
  });

  updateDisplay();
})();
