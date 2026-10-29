import {FIELDS,METRICS,POLICIES,SCENARIOS,eventFor} from './content.mjs';
export {FIELDS,METRICS,POLICIES,SCENARIOS};
export const VERSION=2;
export const INITIAL={prosperity:45,health:55,equity:50,trust:58,employment:56,energy:60,safety:60,fiscal:62};
const copy=x=>JSON.parse(JSON.stringify(x));
export const clamp=(x,min=0,max=100)=>Math.round(Math.max(min,Math.min(max,x))*10)/10;
export function random(seed,turn,channel){let n=(seed^Math.imul(turn+1,2654435761)^Math.imul(channel+1,1597334677))>>>0;n^=n>>>16;n=Math.imul(n,2246822507);n^=n>>>13;return (n>>>0)/4294967296;}
export function allocation(kind='balanced'){return kind==='care'?[30,10,5,25,15,15]:kind==='industry'?[10,20,30,10,20,10]:kind==='caution'?[15,10,10,20,15,30]:[20,15,20,15,15,15];}
function initialPeople(){return [
 {id:'lin',name:'林岚',icon:'✳',age:25,role:'基层护士',skill:58,health:76,income:48,savings:3,free:8,ai:0,training:0,path:'护理',family:'孩子刚上幼儿园，也在照顾父母',text:'每周花不少时间整理病历。她想少写一点表格，多听一会儿病人说话。',memories:[]},
 {id:'chen',name:'陈默',icon:'◈',age:23,role:'制造业工人',skill:38,health:80,income:46,savings:4,free:6,ai:0,training:0,path:'生产线',family:'孩子还小，积蓄只够几个月生活',text:'熟悉生产线的每一道工序。工厂在讨论机器人，他不知道下一份工作会是什么。',memories:[]},
 {id:'xu',name:'许知夏',icon:'◎',age:15,role:'高中生',skill:42,health:84,income:35,savings:2,free:10,ai:5,training:0,path:'求学',family:'家里没有条件长期购买昂贵的学习订阅',text:'喜欢天文。她希望学习工具能帮自己走远一点，也不想失去独立思考的能力。',memories:[]}
];}
export function newGame(seed=2026030,scenario='steady'){
 if(!Number.isInteger(Number(seed))||Number(seed)<0||Number(seed)>4294967295||!Object.hasOwn(SCENARIOS,scenario))throw Error('世界设置无效');
 return {version:VERSION,seed:Number(seed),scenario,turn:0,phase:'plan',metrics:{...INITIAL},tech:Object.fromEntries(FIELDS.map(([k])=>[k,12])),flags:{},citizens:initialPeople(),history:[],queue:[],orientation:[0,0,0,0],draftBudget:allocation(),draftPolicy:'training',draftFocus:'chen'};
}
export const getEvent=s=>eventFor(s);
export function eligibility(s,choice,policyId='maintain'){
 const p=POLICIES.find(x=>x.id===policyId)||POLICIES.at(-1),r=choice.requires||{},reasons=[];
 if(s.metrics.fiscal<p.cost+choice.cost)reasons.push(`财政不足：需 ${p.cost+choice.cost} 点（含本期政策），现有 ${Math.floor(s.metrics.fiscal)} 点`);
 if(r.tech&&s.tech[r.tech[0]]<r.tech[1])reasons.push(`${FIELDS.find(x=>x[0]===r.tech[0])[1]}能力需 ${r.tech[1]}，现为 ${Math.round(s.tech[r.tech[0]])}`);
 if(r.energy&&s.metrics.energy<r.energy)reasons.push(`能源余量需 ${r.energy}，现为 ${Math.round(s.metrics.energy)}`);
 return {available:reasons.length===0,reasons};
}
export function policyAvailable(s,p){return s.metrics.fiscal>=p.cost;}
function updateCitizens(n,old,decision,event,choice){
 const updates=[];const f=n.flags,m=n.metrics,year=2035+old.turn*5;
 for(const p of n.citizens){
  const before=old.citizens.find(x=>x.id===p.id);p.age+=5;const notes=[];
  p.health=clamp(p.health+(m.health-55)*.035-(p.age>=60?3:1));
  p.savings=clamp(p.savings+(p.income-44)/35-(p.age<60?.2:0),0,24);
  const tagged=(kind,title,text,cause)=>{const memory={year,kind,title,text,cause};p.memories.push(memory);notes.push(memory);};
  if(p.id==='lin'){
   if(f.medical==='deployed'){
    p.ai=clamp(p.ai+12);p.free=clamp(p.free+(f.medicalPublic?2:1),2,28);p.skill=clamp(p.skill+1.5);
    p.income=clamp(p.income+(f.medicalPublic?1.4:2));
    if(old.flags.medical!=='deployed')tagged('milestone','病历不再占满下班时间','她开始使用经过验证的辅助系统，仍要复核建议并承担签字责任。',`${event.title}：${choice.label}`);
   }else if(f.medical==='staff'){p.free=clamp(p.free+.8,2,28);if(old.flags.medical!=='staff')tagged('milestone','护理服务得到优先保障','现有人员与社区服务仍然是重要路径，AI 临床应用尚未扩大。',`${event.title}：${choice.label}`);}
   else if(f.medical==='pilot'){p.ai=clamp(p.ai+3);p.skill=clamp(p.skill+.8);}
   if(f.medical==='deployed'&&!f.medicalPublic&&m.equity<52)p.free=clamp(p.free-.7,2,28);
   p.text=f.medical==='deployed'?`辅助系统进入工作。她每周可自主安排约 ${Math.round(p.free)} 小时，${f.medicalPublic?'基层患者也逐渐用上服务。':'一些家庭仍负担不起额外的付费服务。'}`:f.medical==='pilot'?'医院还在试点。她能看到一些帮助，但系统的适用范围有限，不能把试点当成普及。':'医院主要依靠人工服务。工作仍然繁忙，人员、设备和照护网络决定改善的幅度。';
  }
  if(p.id==='chen'){
   const deployed=f.robot==='deployed';
   const support=f.robotSupport||decision.policy==='training';
   if(deployed&&p.path==='生产线'){
    if(support||p.savings>=4){p.path='转岗学习';p.training=20;p.income=clamp(p.income-3);tagged('turning','离开熟悉的生产线',support?'带薪转岗给了他学习设备维护的机会，但考核还没有完成。':'他用积蓄承担了学习期间的生活费。这个选择会消耗家庭的安全余量。',`${event.title}：${choice.label}`);if(!support)p.savings=clamp(p.savings-2,0,24);}
    else{p.path='临时工作';p.income=clamp(p.income-9);p.savings=clamp(p.savings-2,0,24);tagged('turning','转岗比岗位变化慢了一步','没有足够的过渡支持，家庭先依靠临时工作维持生活。','机器人扩大部署；家庭储备不足');}
   }else if(deployed&&(p.path==='转岗学习'||p.path==='临时工作')){
    const canStudy=support||p.savings>=2;
    if(canStudy){p.training=clamp(p.training+22+n.tech.education*.25);p.skill=clamp(p.skill+5);p.free=clamp(p.free-1,2,28);if(!support)p.savings=clamp(p.savings-.6,0,24);}
    if(p.training>=70&&p.path!=='设备维护'){p.path='设备维护';p.income=clamp(p.income+10);tagged('milestone','通过了设备维护考核','旧经验和新技能接上了，他获得一份需要持续学习的新工作。',`累计转岗进度 ${Math.round(p.training)}；教育与培训支持`);}
   }else if(p.path==='设备维护'){p.skill=clamp(p.skill+1.5);p.income=clamp(p.income+1.5);p.ai=clamp(p.ai+8);}
   if(!deployed){p.income=clamp(p.income+.5+(f.humanIndustry?1:0));p.skill=clamp(p.skill+(f.robot==='prepared'?2:.6));}
   p.role=p.path==='设备维护'?'机器人维护技师':p.path==='转岗学习'?'在职转岗学习':p.path==='临时工作'?'临时工作者':'制造业工人';
   p.text=p.path==='设备维护'?`他已经能维护新设备。收入指数为 ${Math.round(p.income)}，但持续更新技能仍要占用个人时间。`:p.path==='转岗学习'?`他在学习新技能，进度 ${Math.round(p.training)}%。${support?'过渡支持让家里暂时不用只靠积蓄。':'生活费和学费正在消耗储备。'}`:p.path==='临时工作'?`岗位先变了，机会还没完全接上。家庭储备约 ${p.savings.toFixed(1)} 个月，他仍在寻找能负担的学习机会。`:'他还在熟悉的工厂里。岗位没有立刻消失，但外部产业变化也带来了新的竞争压力。';
  }
  if(p.id==='xu'){
   const open=f.education==='open',bridge=!!f.educationBridge;
   p.skill=clamp(p.skill+(open?3.5:f.education==='premium'?1.4:2)+(bridge?1:0));p.ai=clamp(p.ai+(open?8:3));
   if(p.age>=20&&before.age<20){p.role='大学与技能学习';p.path='继续学习';tagged('milestone','走到下一段学习门口','升学与技能学习开始。工具正在变化，家庭资源仍影响可以选择的路径。','进入新的年龄阶段');}
   if(p.age>=25&&before.age<25){p.path=open?'公共学习受益者':'自费追赶者';p.role=open?'数字公共服务从业者':'初级服务从业者';p.income=clamp(p.income+(open?8:2));tagged('turning','第一次进入变化中的职场',open?'公共工具减少了入门门槛，但毕业并不等于工作从此稳定。':'她一边工作一边补足工具和技能，家庭需要承担额外成本。',`教育路径：${f.education||'基础教育'}`);}
   if(p.age>=25){p.income=clamp(p.income+(bridge?2:.3));if(!open)p.savings=clamp(p.savings-.25,0,24);}
   if(bridge&&!old.flags.educationBridge){p.path='进修与工作接轨';p.role='数字服务与技术协作';tagged('milestone','学习第一次接上了真实岗位','实习、导师或职业训练为她提供了继续选择的入口。',`${event.title}：${choice.label}`);}
   p.text=open?`她使用公共学习资源，技能指数达到 ${Math.round(p.skill)}。${bridge?'工作和进修逐渐接上。':'工具更容易获得，稳定的职业入口却还需要努力。'}`:`工具的价格仍影响她的选择。${bridge?'新的职业训练提供了一个入口。':'她把业余时间分给工作、学习和家人。'}`;
  }
  if(decision.policy==='access')p.health=clamp(p.health+.8);
  if(decision.policy==='training'&&p.id!=='lin')p.skill=clamp(p.skill+1);
  if(p.age>=45&&p.age<65){p.free=clamp(p.free-.5,2,28);p.family='同时承担工作与家庭照护';}
  if(f.careTime){p.free=clamp(p.free+2,2,28);p.health=clamp(p.health+1);}
  if(f.communityCare)p.free=clamp(p.free+.8,2,28);
  if(p.age>=65){
   if(before.age<65){p.role='退休 · '+p.role;p.free=clamp(p.free+8,2,28);tagged('turning','从工作转向晚年生活','收入结构和生活节奏改变，健康与可获得的照护变得更重要。','进入退休阶段');}
   else p.role=before.role;
   p.family='退休后关注伴侣、亲友与下一代';p.income=clamp(p.income-.5);
   p.text=`退休后，${f.careTime?'公共照护减少了家庭负担。':f.communityCare?'社区互助成为支持的一部分。':'亲友和个人储备承担着更多照护责任。'}她每周可自主安排约 ${Math.round(p.free)} 小时。`;
   if(p.id==='chen')p.text=p.text.replace('她','他');
  }
  p.savings=clamp(p.savings+(p.income-45)*.025+(m.equity-50)*.008,0,24);
  const latest=notes.at(-1)||{year,kind:'daily',title:'生活继续向前',text:p.text,cause:`${decision.policy==='maintain'?'维持与储备':POLICIES.find(x=>x.id===decision.policy).name}；社会与家庭状态共同作用`};
  if(!notes.length)p.memories.push(latest);
  p.latest=latest;updates.push({id:p.id,name:p.name,year,title:latest.title,text:latest.text,cause:latest.cause,incomeDelta:clamp(p.income-before.income,-100,100),timeDelta:clamp(p.free-before.free,-100,100)});
 }
 return updates;
}
export function simulateTurn(s,decision){
 if(s.version!==VERSION||s.turn>=10)throw Error('此存档无法继续模拟');
 const a=decision.budget;if(!Array.isArray(a)||a.length!==6||a.some(x=>!Number.isInteger(x)||x<0||x>100||x%5!==0)||a.reduce((x,y)=>x+y,0)!==100)throw Error('请以 5 点为单位分配完整的 100 点预算');
 const policy=POLICIES.find(p=>p.id===decision.policy);if(!policy||!policyAvailable(s,policy))throw Error('财政不足以执行这项政策');
 const event=getEvent(s),choice=typeof decision.choice==='number'?event.choices[decision.choice]:event.choices.find(c=>c.id===decision.choice);
 if(!choice)throw Error('请选择有效的事件方案');
 const eligible=eligibility(s,choice,policy.id);if(!eligible.available)throw Error(eligible.reasons.join('；'));
 const n=copy(s),m=n.metrics,t=n.tech,prev=s.metrics,reasons=[],effects={};const add=(k,v)=>effects[k]=(effects[k]||0)+v;
 const cfg=SCENARIOS[s.scenario],wave=s.scenario==='waves'?Math.sin(s.turn*1.7)*.25:0;
 const implementation=.6+Math.min(prev.trust,prev.employment)/250;
 FIELDS.forEach(([k],i)=>{t[k]=clamp(t[k]+Math.sqrt(a[i])*(cfg.growth+wave)*1.15*(prev.fiscal<15?.65:1));});
 const matured=n.queue.filter(q=>q.at<=s.turn);n.queue=n.queue.filter(q=>q.at>s.turn);
 matured.forEach(q=>{Object.entries(q.effects).forEach(([k,v])=>add(k,v));reasons.push(q.reason);});
 const resource=.35+.65*Math.min(1,prev.energy/55),benefit=resource*implementation;
 add('prosperity',(t.science*.035+(n.flags.robot==='deployed'?t.robotics*.05:0))*benefit-.8);
 add('health',(n.flags.medical==='deployed'?t.medicine*.055:t.medicine*.014)*benefit-.5);
 add('employment',t.education*.035-(n.flags.robot==='deployed'?t.robotics*.055:.4));
 add('equity',t.education*.02-(n.flags.robot==='deployed'&&!n.flags.robotSupport?1.2:.4));
 add('energy',t.energy*.07-(n.flags.robot==='deployed'?t.robotics*.05:0)-t.science*.025-1.2);
 add('safety',t.safety*.065-(n.flags.robot==='deployed'?t.robotics*.035:0)-(n.flags.medical==='deployed'?t.medicine*.025:0)-.5);
 add('trust',(prev.equity-50)*.025+(prev.safety-50)*.02-.2);
 const revenue=3.5+(prev.prosperity-45)*.07;
 add('fiscal',revenue-policy.cost-choice.cost);
 Object.entries(policy.effects).forEach(([k,v])=>add(k,v));Object.entries(choice.effects).forEach(([k,v])=>add(k,v));
 Object.assign(n.flags,choice.flags);
 if(a[0]>=20)n.queue.push({at:s.turn+2,effects:{health:1.5},reason:`${2030+s.turn*5} 年的医疗研究完成验证，改善了诊疗基础。`});
 if(a[4]>=20)n.queue.push({at:s.turn+1,effects:{energy:3},reason:`${2030+s.turn*5} 年启动的能源设施投入使用。`});
 if(a[3]>=20)n.queue.push({at:s.turn+1,effects:{employment:1.5,equity:1},reason:`${2030+s.turn*5} 年的教育投入开始支持转岗与学习。`});
 if(prev.energy<35){add('prosperity',-2);reasons.push('能源紧张压低了项目落地收益，部分推广选择也被限制。');}
 if(prev.fiscal<15){add('health',-.8);add('trust',-1.5);reasons.push('财政承压降低了研究实施效率，公共服务开始吃紧。');}
 if(s.flags.debtDue===s.turn){add('fiscal',-8);reasons.push('此前为维持服务使用的融资到期，本期偿还 8 点财政。');}
 const exposure=(s.flags.robot==='deployed'||s.flags.medical==='deployed');
 if(exposure&&random(s.seed,s.turn,1)<.05+(100-prev.safety)*.0015){add('trust',-3);add('fiscal',-2);reasons.push('已部署系统发生应用事故，额外消耗了修复资源。');}
 add('prosperity',(random(s.seed,s.turn,2)-.5)*cfg.shock);
 if(n.flags.limitedDeployment){add('prosperity',-.5);add('safety',.8);}
 for(const [k,v] of Object.entries(effects))m[k]=clamp(m[k]+v);
 n.orientation=n.orientation.map((v,i)=>v+policy.tags[i]+choice.tags[i]);
 n.orientation[0]+=(a[1]+a[2]-a[5]-20)/20;
 n.orientation[1]+=(a[0]+a[3]-a[1]-a[2])/20;
 n.orientation[3]+=(a[1]+a[4]+a[5]-35)/20;
 reasons.unshift(`财政：公共收入约 ${revenue.toFixed(1)} 点；政策支出 ${policy.cost} 点；本次方案支出 ${choice.cost} 点。`);
 const updates=updateCitizens(n,s,decision,event,choice);
 const focus=updates.find(x=>x.id===decision.focus)||updates.find(x=>x.id===s.draftFocus)||updates[0];
 const record={year:2035+s.turn*5,eventId:event.id,chain:event.chain,event:event.title,choiceId:choice.id,choiceIndex:event.choices.indexOf(choice),choice:choice.label,budget:[...a],policyId:policy.id,policy:policy.name,metrics:{...m},delta:Object.fromEntries(METRICS.map(([k])=>[k,clamp(m[k]-prev[k],-100,100)])),reasons,updates,focus:focus.id};
 n.history.push(record);n.turn++;n.phase='report';n.draftBudget=[...a];n.draftPolicy=policy.id;n.draftFocus=focus.id;return n;
}
export const people=s=>s.citizens;
export function finalMoments(s){
 const milestones=s.citizens.flatMap(p=>p.memories.filter(x=>x.kind!=='daily').map(x=>({...x,name:p.name})));
 const meaningful=milestones.filter(x=>x.title!=='从工作转向晚年生活');
 const picks=s.citizens.map(p=>meaningful.filter(x=>x.name===p.name).at(-1)).filter(Boolean);
 const seen=new Set(picks.map(x=>x.title));
 for(const x of [...meaningful,...milestones])if(picks.length<5&&!seen.has(x.title)){picks.push(x);seen.add(x.title);}
 return picks.sort((a,b)=>a.year-b.year).slice(0,5);
}
const finite=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
export function validSave(s){
 return !!s&&s.version===VERSION&&Number.isInteger(s.seed)&&finite(s.seed,0,4294967295)&&Object.hasOwn(SCENARIOS,s.scenario)&&Number.isInteger(s.turn)&&finite(s.turn,0,10)&&['plan','event','report','final'].includes(s.phase)&&(s.phase!=='report'||s.turn>0)&&(s.phase!=='final'||s.turn===10)&&s.metrics&&METRICS.every(([k])=>finite(s.metrics[k],0,100))&&s.tech&&FIELDS.every(([k])=>finite(s.tech[k],0,100))&&s.flags&&typeof s.flags==='object'&&Array.isArray(s.history)&&s.history.length===s.turn&&s.history.every(r=>r&&Number.isInteger(r.year)&&Array.isArray(r.budget)&&r.budget.length===6&&r.budget.every(x=>finite(x,0,100))&&typeof r.policy==='string'&&typeof r.event==='string'&&typeof r.choice==='string'&&r.metrics&&METRICS.every(([k])=>finite(r.metrics[k],0,100))&&typeof r.chain==='string'&&Array.isArray(r.updates)&&r.updates.length===3&&r.updates.every(u=>u&&['lin','chen','xu'].includes(u.id)&&typeof u.title==='string'&&typeof u.text==='string'&&typeof u.cause==='string')&&Array.isArray(r.reasons)&&r.reasons.every(x=>typeof x==='string'))&&Array.isArray(s.orientation)&&s.orientation.length===4&&s.orientation.every(x=>finite(x,-300,300))&&Array.isArray(s.queue)&&s.queue.every(q=>q&&Number.isInteger(q.at)&&q.effects&&typeof q.reason==='string'&&Object.entries(q.effects).every(([k,v])=>METRICS.some(x=>x[0]===k)&&finite(v,-100,100)))&&Array.isArray(s.citizens)&&s.citizens.length===3&&(!s.previous||(typeof s.previous.name==='string'&&typeof s.previous.code==='string'&&s.previous.metrics&&METRICS.every(([k])=>finite(s.previous.metrics[k],0,100))))&&['lin','chen','xu'].every(id=>s.citizens.filter(p=>p&&p.id===id&&p.name===({lin:'林岚',chen:'陈默',xu:'许知夏'})[id]&&p.icon===({lin:'✳',chen:'◈',xu:'◎'})[id]&&typeof p.path==='string'&&typeof p.role==='string'&&typeof p.text==='string'&&typeof p.family==='string'&&finite(p.age,0,120)&&['skill','health','income','ai','training'].every(k=>finite(p[k],0,100))&&finite(p.savings,0,24)&&finite(p.free,0,28)&&Array.isArray(p.memories)&&p.memories.every(m=>m&&typeof m.title==='string'&&typeof m.text==='string'&&typeof m.cause==='string'&&Number.isInteger(m.year))).length===1);
}
