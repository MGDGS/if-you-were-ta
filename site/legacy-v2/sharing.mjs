import {VERSION,newGame,simulateTurn,getEvent,SCENARIOS,POLICIES,validSave} from './engine.mjs';
import {profile} from './profile.mjs';
export function encodeResult(s){
 if(!validSave(s)||s.turn!==10)throw Error('请先完成一局，再分享结果');
 const data={v:VERSION,s:s.seed,w:Object.keys(SCENARIOS).indexOf(s.scenario),d:s.history.map(r=>r.budget.map(x=>(x/5).toString(36)).join('')+POLICIES.findIndex(p=>p.id===r.policyId)+r.choiceIndex)};
 return btoa(JSON.stringify(data)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function decodeResult(encoded){
 if(typeof encoded!=='string'||encoded.length>1200||!/^[\w-]+$/.test(encoded))throw Error('分享链接格式不正确');
 let p;try{p=JSON.parse(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')));}catch{throw Error('分享链接无法读取');}
 if(p.v!==VERSION)throw Error('这是不同规则版本的结果，请重新邀请朋友开局');
 if(!Number.isInteger(p.s)||p.s<0||p.s>4294967295||!Number.isInteger(p.w)||p.w<0||p.w>2||!Array.isArray(p.d)||p.d.length!==10)throw Error('分享数据不完整');
 let s=newGame(p.s,Object.keys(SCENARIOS)[p.w]);
 for(const turn of p.d){if(typeof turn!=='string'||!/^([0-9a-k]{6})([0-4])([0-2])$/.test(turn))throw Error('分享决策不正确');const budget=turn.slice(0,6).split('').map(x=>parseInt(x,36)*5);const policy=POLICIES[Number(turn[6])].id;const index=Number(turn[7]);if(!getEvent(s).choices[index])throw Error('分享事件无效');s=simulateTurn(s,{budget,policy,choice:index});}
 s.phase='final';return s;
}
export function resultUrl(s){return `${location.origin}${location.pathname}#r=${encodeResult(s)}`;}
export function shareText(s){const p=profile(s);return `我在《如果你是ta》规划了五十年，结果是「${p.name}」${p.code}。\n${p.tag}\n${p.strengths.map(x=>`${x.label} ${x.value}`).join(' · ')}\n同一个世界，你会带向哪里？\n世界种子 ${s.seed} · ${SCENARIOS[s.scenario].name}`;}
export function wrapText(ctx,text,maxWidth){const lines=[];let line='';for(const ch of text){if(ch==='\n'){lines.push(line);line='';continue;}if(ctx.measureText(line+ch).width>maxWidth&&line){lines.push(line);line=ch;}else line+=ch;}if(line)lines.push(line);return lines;}
export function renderCard(s,canvas=document.createElement('canvas')){
 const p=profile(s),ctx=canvas.getContext('2d');canvas.width=1080;canvas.height=1780;
 ctx.fillStyle='#f2f1e9';ctx.fillRect(0,0,1080,1780);ctx.fillStyle=p.color;ctx.fillRect(0,0,1080,580);
 ctx.strokeStyle='#ffffff25';ctx.lineWidth=1;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(830,240,150+i*38,80+i*25,-.5,0,Math.PI*2);ctx.stroke();}
 ctx.fillStyle='#d8e899';ctx.font='22px sans-serif';ctx.fillText('如果你是ta / 你的未来规划类型',70,85);
 ctx.font='bold 36px monospace';ctx.fillText(p.code,70,155);
 ctx.fillStyle='#ffffff';ctx.font='bold 100px sans-serif';ctx.fillText(p.name,62,300);
 ctx.font='30px sans-serif';wrapText(ctx,p.tag,900).forEach((line,i)=>ctx.fillText(line,70,365+i*44));
 ctx.fillStyle='#ffffffbb';ctx.font='23px sans-serif';ctx.fillText('2030 — 2080 · 五十年选择的图文档案',70,485);
 ctx.fillStyle='#172623';ctx.font='bold 30px sans-serif';ctx.fillText('你的四个决策倾向',70,660);
 p.axes.forEach((a,i)=>{const y=725+i*102;ctx.fillStyle='#526052';ctx.font='25px sans-serif';ctx.fillText(a.left,70,y);ctx.textAlign='right';ctx.fillText(a.right,1010,y);ctx.textAlign='left';ctx.fillStyle='#d9ddce';ctx.fillRect(70,y+19,940,9);ctx.fillStyle=p.color;ctx.fillRect(70,y+19,470,9);ctx.beginPath();ctx.arc(70+940*(100-a.value)/100,y+23,9,0,Math.PI*2);ctx.fill();ctx.font='20px sans-serif';ctx.fillText(a.balanced?'接近均衡':`偏向${a.dominant}`,470,y);});
 ctx.fillStyle='#172623';ctx.font='bold 28px sans-serif';ctx.fillText('这个世界留下的成果',70,1150);
 p.strengths.forEach((x,i)=>{const xPos=70+i*320;ctx.fillStyle=p.color;ctx.font='bold 55px monospace';ctx.fillText(String(x.value),xPos,1230);ctx.fillStyle='#63705d';ctx.font='23px sans-serif';ctx.fillText(x.label,xPos,1270);});
 ctx.fillStyle='#6c715f';ctx.font='22px sans-serif';wrapText(ctx,'留下的课题：'+p.cost,920).slice(0,2).forEach((line,i)=>ctx.fillText(line,70,1340+i*32));
 ctx.strokeStyle='#ccd2c2';ctx.beginPath();ctx.moveTo(70,1410);ctx.lineTo(1010,1410);ctx.stroke();
 ctx.fillStyle=p.color;ctx.font='bold 25px sans-serif';ctx.fillText(`世界 ${s.seed} · ${SCENARIOS[s.scenario].name}`,70,1465);
 ctx.font='22px sans-serif';ctx.fillText('同一个世界，你会带向哪里？',70,1510);
 ctx.fillStyle='#65705d';ctx.font='18px sans-serif';wrapText(ctx,location.hostname,650).forEach((line,i)=>ctx.fillText(line,70,1560+i*27));
 ctx.font='20px sans-serif';ctx.fillText('扫码查看这局结果，开始你的五十年。',70,1640);
 if(globalThis.qrcode){const qr=globalThis.qrcode(0,'M');qr.addData(resultUrl(s));qr.make();const count=qr.getModuleCount(),cell=Math.floor(230/(count+8)),size=(count+8)*cell,ox=1010-size,oy=1440;ctx.fillStyle='#fff';ctx.fillRect(ox,oy,size,size);ctx.fillStyle='#172623';for(let r=0;r<count;r++)for(let c=0;c<count;c++)if(qr.isDark(r,c))ctx.fillRect(ox+(c+4)*cell,oy+(r+4)*cell,cell,cell);}
 ctx.fillStyle='#7c826e';ctx.font='17px sans-serif';ctx.fillText('游戏类型结果 · 非心理测评或现实预测 · 指标为游戏指数',70,1735);
 return canvas;
}
export const cardBlob=s=>new Promise((resolve,reject)=>renderCard(s).toBlob(b=>b?resolve(b):reject(Error('图片生成失败')),'image/png'));
