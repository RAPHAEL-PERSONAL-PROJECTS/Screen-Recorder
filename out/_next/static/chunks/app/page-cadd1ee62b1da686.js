(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{8502:function(e,t,r){Promise.resolve().then(r.bind(r,2069)),Promise.resolve().then(r.bind(r,9978)),Promise.resolve().then(r.bind(r,3062)),Promise.resolve().then(r.bind(r,7949))},7949:function(e,t,r){"use strict";var n=r(7437),a=r(2069),i=r(9239),c=r(7404),o=r(7008),l=r(20),s=r(3093),d=r(2441),u=r(4013),h=r(5002),m=r(4370),v=r(2265);let p=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;if(0===e)return"0 Bytes";let r=Math.floor(Math.log(e)/Math.log(1024));return parseFloat((e/Math.pow(1024,r)).toFixed(t<0?0:t))+" "+["Bytes","KB","MB","GB","TB"][r]},w={mimeType:"video/webm; codecs=vp8,opus"};t.default=()=>{let[e,t]=(0,v.useState)(null),[r,f]=(0,v.useState)(0),b=(0,v.useRef)(0),[g,x]=(0,v.useState)(null),[j,y]=(0,v.useState)(0),[M,R]=(0,v.useState)(!1),[Z,S]=(0,v.useState)("screen-recording"),k=(0,v.useRef)(1),T=(0,v.useRef)(null),C=(0,v.useRef)(null),B=(0,v.useRef)(null),E=(0,v.useRef)(null),D=(0,v.useRef)(null),O=(0,v.useRef)([]),P=(0,v.useRef)(null);(0,v.useEffect)(()=>{let e=new m.ZP;return P.current=new(window.AudioContext||window.webkitAudioContext),e.on("open",e=>{t(e)}),e.on("call",e=>{navigator.mediaDevices.getDisplayMedia({video:!0,audio:!0}).then(t=>{e.answer(t),e.on("stream",e=>{B.current&&(B.current.srcObject=e)})})}),E.current=e,()=>{e.destroy()}},[]);let I=()=>{y(0),T.current=setInterval(()=>{y(e=>e>=r&&0!==r?(z(),0):e+1)},1e3)},L=()=>{T.current&&clearInterval(T.current)},N=async()=>{try{k.current=1,b.current=0;let e=await navigator.mediaDevices.getDisplayMedia({video:!0,audio:!0}),t=await navigator.mediaDevices.getUserMedia({audio:!0});P.current||(P.current=new(window.AudioContext||window.webkitAudioContext));let r=P.current;"suspended"===r.state&&await r.resume();let n=r.createMediaStreamDestination(),a=r.createMediaStreamSource(t),i=r.createMediaStreamSource(e);a.connect(n),i.connect(n);let c=new MediaStream;e.getVideoTracks().forEach(e=>{c.addTrack(e)}),n.stream.getAudioTracks().forEach(e=>{c.addTrack(e)}),C.current&&(C.current.srcObject=c),_(c),I(),R(!0),e.getVideoTracks()[0].onended=()=>{D.current&&"inactive"!==D.current.state&&D.current.stop(),U()}}catch(e){console.error("Error starting call",e)}},_=e=>{O.current=[],MediaRecorder.isTypeSupported(w.mimeType)?console.log("Codec supported"):console.log("Codec not supported");let t=new MediaRecorder(e,w),n=setInterval(()=>{t&&"recording"===t.state?t.requestData():clearInterval(n)},5e3);t.ondataavailable=e=>{e.data.size>0&&(O.current.push(e.data),b.current+=e.data.size)},t.onstop=async()=>{O.current.length>0&&(await A(),r>0&&(k.current+=1),clearInterval(n))},t.start(250),D.current=t},z=()=>{D.current&&(D.current.stop(),C.current&&C.current.srcObject&&_(C.current.srcObject))},A=async()=>{let e=new Blob(O.current,{type:w.mimeType}),t=new FormData;t.append("videoBlob",e,"".concat(Z,".webm"));try{let e=await fetch("/api/convert",{method:"POST",body:t});if(!e.ok)throw Error("Failed to convert video");let r=await e.arrayBuffer(),n=new Blob([r],{type:"video/mp4"}),a=URL.createObjectURL(n),i=document.createElement("a");i.style.display="none",i.href=a,i.download="".concat(Z,".mp4"),document.body.appendChild(i),i.click(),window.URL.revokeObjectURL(a)}catch(e){console.error("Error converting video:",e)}O.current=[]},F=()=>{D.current&&D.current.stop()},U=()=>{g&&g.close(),F(),L(),R(!1)};return(0,n.jsxs)(a.default,{sx:{width:"100%",padding:2},children:[(0,n.jsxs)("h1",{children:["Your Peer ID: ",e]}),(0,n.jsxs)(i.Z,{container:!0,alignItems:"center",spacing:2,children:[(0,n.jsx)(i.Z,{children:(0,n.jsx)(c.Z,{fullWidth:!0,label:"File Name",variant:"outlined",value:Z,onChange:e=>S(e.target.value),size:"small"})}),(0,n.jsx)(i.Z,{width:150,children:(0,n.jsxs)(o.Z,{fullWidth:!0,children:[(0,n.jsx)(l.Z,{id:"demo-simple-select-label",children:"Recording Time Limit"}),(0,n.jsxs)(s.Z,{labelId:"demo-simple-select-label",id:"demo-simple-select",value:r,label:"Recording Time Limit",size:"small",onChange:e=>f(Number(e.target.value)),children:[(0,n.jsx)(d.Z,{value:1800,children:"30 Minutes"}),(0,n.jsx)(d.Z,{value:1200,children:"20 Minutes"}),(0,n.jsx)(d.Z,{value:600,children:"10 Minutes"}),(0,n.jsx)(d.Z,{value:0,children:"No Limit"})]})]})}),(0,n.jsx)(i.Z,{children:(0,n.jsx)(u.Z,{variant:"contained",onClick:N,disabled:M,children:"Start Recording"})})]}),(0,n.jsx)("video",{ref:C,autoPlay:!0,muted:!0,style:{width:"700px"}}),(0,n.jsx)("video",{ref:B,autoPlay:!0,style:{width:"700px"}}),(0,n.jsxs)(a.default,{mt:2,children:[(0,n.jsxs)(h.Z,{variant:"h6",children:["Recording Timer:"," ",r>0?"".concat(Math.floor(r/60)," Minutes"):"No Limit"]}),(0,n.jsxs)(h.Z,{variant:"body1",children:["Current Time: ",Math.floor(j/60),":","0".concat(j%60).slice(-2)]}),(0,n.jsxs)(h.Z,{variant:"body1",children:["Recording Size: ",p(b.current)]})]})]})}}},function(e){e.O(0,[62,411,971,117,744],function(){return e(e.s=8502)}),_N_E=e.O()}]);