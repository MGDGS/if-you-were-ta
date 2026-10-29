import {FIELDS,METRICS,POLICIES,SCENARIOS,FOCUSES,EVENTS,BY_ID,ACTIONS,SMALL_MOMENTS} from './content.mjs?v=3';
import {START,END,initialWorld,nextWorld,worldView,annualNews,rnd} from './world.mjs?v=3';
export {FIELDS,METRICS,POLICIES,SCENARIOS,FOCUSES,EVENTS,ACTIONS,START,END};
export const VERSION=3;
export const INITIAL={prosperity:45,happiness:58,health:55,equity:50,trust:58,employment:56,energy:60,safety:60,fiscal:62};
const copy=x=>JSON.parse(JSON.stringify(x));
export const clamp=(x,min=0,max=100)=>Math.round(Math.max(min,Math.min(max,x))*100)/100;
export const random=rnd;
export function allocation(kind='balanced'){return kind==='care'?[30,10,5,25,15,15]:kind==='industry'?[10,20,30,10,20,10]:kind==='caution'?[15,10,10,20,15,30]:[20,15,20,15,15,15];}
function log(s,kind,title,text,extra={}){s.feed.push({id:s.feed.length,year:s.year,age:s.player.age,kind,title,text,...extra});}
export function newGame(seed=2026030,scenario='steady',name='未来规划师'){
 if(!Number.isInteger(Number(seed))||Number(seed)<0||Number(seed)>4294967295||!Object.hasOwn(SCENARIOS,scenario))throw Error('世界设置无效');
 name=String(name).trim().slice(0,16)||'未来规划师';const world=initialWorld();const s={version:VERSION,seed:Number(seed),scenario,year:START,elapsed:0,phase:'live',pendingId:'mandate',player:{name,age:28,role:'AI 规划总工程师',health:78,knowledge:58,stress:32,reputation:50},metrics:{...INITIAL},tech:Object.fromEntries(FIELDS.map(([k])=>[k,12])),flags:{},budget:allocation(),policy:'training',focus:'research',orientation:[0,0,0,0],world,reference:copy(world),worldHistory:[{...worldView(world),happiness:INITIAL.happiness}],referenceHistory:[worldView(world)],feed:[],decisions:[],projects:[],actionLast:{},commands:[],milestones:[]};
 log(s,'career','你接下了这份任命',`${name}，28 岁。作为虚构全球 AI 合作计划总工程师，你负责研发、政策和试点。未来五十年，成果与代价都会进入你的个人档案。`);
 log(s,'world','从现实资料，走进情景推演',`${START} 年起点由 NOAA 2025 年 CO₂、联合国 2024 年人口与生育率等资料外推。此后的数值均是本局模型结果。`);
 return s;
}
export const getEvent=s=>s.pendingId?BY_ID[s.pendingId]:null;
export function eligibility(s,c){const reasons=[],r=c.requires||{};if(s.metrics.fiscal<c.cost)reasons.push(`财政需 ${c.cost} 点，现有 ${s.metrics.fiscal.toFixed(1)} 点`);if(r.tech&&s.tech[r.tech[0]]<r.tech[1])reasons.push(`${FIELDS.find(x=>x[0]===r.tech[0])[1]}能力需 ${r.tech[1]}，现为 ${s.tech[r.tech[0]].toFixed(1)}`);if(r.energy&&s.metrics.energy<r.energy)reasons.push(`能源需 ${r.energy}，现为 ${s.metrics.energy.toFixed(1)}`);return {available:!reasons.length,reasons};}
export const policyAvailable=(s,p)=>s.metrics.fiscal>=p.cost;
export function setPlan(s,plan,record=true){if(s.phase==='final')throw Error('本局已经结束');const budget=plan.budget??s.budget,policy=plan.policy??s.policy,focus=plan.focus??s.focus;
 if(!Array.isArray(budget)||budget.length!==6||budget.some(x=>!Number.isInteger(x)||x<0||x>100||x%5)||budget.reduce((a,b)=>a+b,0)!==100)throw Error('研发预算需以 5 点为单位，总计 100 点');if(!POLICIES.some(x=>x.id===policy)||!FOCUSES.some(x=>x.id===focus))throw Error('规划选项无效');
 const n=copy(s);n.budget=[...budget];n.policy=policy;n.focus=focus;
 if(record&&(JSON.stringify(s.budget)!==JSON.stringify(budget)||s.policy!==policy||s.focus!==focus)){n.commands.push([1,n.elapsed,budget.map(x=>(x/5).toString(36)).join(''),POLICIES.findIndex(x=>x.id===policy),FOCUSES.findIndex(x=>x.id===focus)]);log(n,'plan','你调整了长期规划',`研发重点：${FIELDS[budget.indexOf(Math.max(...budget))][1]}；政策：${POLICIES.find(x=>x.id===policy).name}；年度重心：${FOCUSES.find(x=>x.id===focus).name}。`);}
 return n;
}
const PERSONAL={
 'burnout:rest':{health:5,stress:-15,reputation:-1},'burnout:delegate':{stress:-8,knowledge:1},'burnout:push':{reputation:3,health:-4,stress:8},
 'career:public':{reputation:2},'career:lab':{knowledge:3,stress:3},'career:consult':{reputation:1},
 'screening:review':{health:6,stress:-4},'screening:ai':{health:4,knowledge:1},'screening:delay':{health:-3,stress:3},
 'science-leap:verify':{knowledge:4},'science-leap:race':{reputation:2},'trust-vote:full':{reputation:2},'trust-vote:results':{reputation:1},'trust-vote:external':{reputation:1},
 'retirement:advisor':{stress:-10},'retirement:stay':{reputation:2,stress:3},'retirement:teach':{knowledge:3},
 'meaning:health':{health:3,stress:-6},'meaning:learn':{knowledge:4,stress:2},'meaning:public':{reputation:2},'reproducibility:correct':{knowledge:2}
};
export function choiceImpact(event,choice){const labels=Object.fromEntries(METRICS),pLabels={health:'你的健康',stress:'你的压力',knowledge:'你的知识',reputation:'你的声誉'};const direct=Object.entries(choice.effects).map(([k,v])=>`${labels[k]} ${v>0?'+':''}${v}`);const personal=Object.entries(PERSONAL[`${event.id}:${choice.id}`]||{}).map(([k,v])=>`${pLabels[k]} ${v>0?'+':''}${v}`);return {direct:[...direct,...personal],cost:choice.cost,long:choice.long,risk:choice.risk};}
export function resolveChoice(s,index,record=true){const event=getEvent(s);if(!event)throw Error('当前没有等待处理的重大事件');const c=typeof index==='number'?event.choices[index]:event.choices.find(c=>c.id===index);if(!c)throw Error('请选择有效方案');const check=eligibility(s,c);if(!check.available)throw Error(check.reasons.join('；'));
 const n=copy(s),i=event.choices.indexOf(c);n.metrics.fiscal=clamp(n.metrics.fiscal-c.cost);for(const[k,v]of Object.entries(c.effects))n.metrics[k]=clamp(n.metrics[k]+v);Object.assign(n.flags,c.flags);
 for(const[k,v]of Object.entries(PERSONAL[`${event.id}:${c.id}`]||{}))n.player[k]=clamp(n.player[k]+v);
 if(n.flags.consultant)n.player.role='独立 AI 顾问';if(n.flags.advisor)n.player.role='AI 长期顾问';if(n.flags.teaching)n.player.role='AI 公共研究者';
 n.orientation=n.orientation.map((v,i)=>v+c.tags[i]);const impact=choiceImpact(event,c);
 n.decisions.push({year:n.year,elapsed:n.elapsed,eventId:event.id,event:event.title,category:event.category,choiceId:c.id,choiceIndex:i,choice:c.label,impact});
 if(record)n.commands.push([0,n.elapsed,i]);log(n,'decision',event.title,`你选择「${c.label}」。${impact.cost?`财政支出 ${impact.cost} 点。`:''}${impact.direct.join('；')}。${c.long}`,{eventId:event.id});n.pendingId=null;checkMilestones(n);
 return n;
}
function checkMilestones(s){const seen=s.milestones.map(x=>x.id);const list=[
 ['gdp150',s.world.gdp>=150,'增长的第一个高点','实际 GDP 指数达到 150','经济总量比开局高出约一半。人均生活与幸福，也需要被一起看见。','growth'],
 ['gdp200',s.world.gdp>=200,'你见证了经济总量翻倍','实际 GDP 指数达到 200','这是五十年计划里的重要时刻。总量翻倍，不代表每个人的生活都翻倍。','growth'],
 ['happy70',s.metrics.happiness>=70,'这一次，不只曲线变好了','人民幸福度达到 70','服务、机会和生活时间开始一起改善。你把这个时刻写进档案。','joy'],
 ['happy85',s.metrics.happiness>=85,'一个更愿意期待明天的社会','人民幸福度达到 85','这不是每个人都快乐，而是本局多项生活条件形成了积极反馈。','joy'],
 ['health75',s.metrics.health>=75,'更多人获得了被照护的机会','公共健康达到 75','一次次试点、验证与服务安排，终于积累成可感知的改变。','care'],
 ['clean50',s.world.clean>=50,'能源转型走过了一道门槛','低碳供给情景占比达到 50%','能源的改变先减缓新增排放。大气中的 CO₂ 仍会积累。','climate'],
 ['recession',s.world.gdpGrowth<0,'这一年，增长停住了','实际 GDP 出现年度收缩','你第一次在任期内面对负增长。接下来怎样接住转型与生活压力？','warning'],
 ['trustlow',s.metrics.trust<40,'信任不会自动跟上技术','公众信任跌破 40','这是需要正面回应的裂缝。漂亮的产出曲线不能替代信任。','warning'],
 ['carbon500',s.world.co2>=500,'一个沉重的气候刻度','CO₂ 情景浓度达到 500 ppm','过去排放留下的积累正在进入未来。任何单个技术都不是即时重置按钮。','warning']
 ];
 for(const[id,ok,title,metric,text,tone]of list)if(ok&&!seen.includes(id)){const item={id,year:s.year,title,metric,text,tone};s.milestones.push(item);log(s,'milestone',title,`${metric}。${text}`,{milestoneId:id,tone});}
}
const SCHEDULE={3:'compute',6:'clinic',9:'robots',12:'classroom',15:'grid',18:'clinic-scale',22:'robot-scale',26:'labor',30:'demographic',35:'oversight',40:'wellbeing',45:'legacy',49:'handover'};
export function chooseAnnualEvent(s){const seen=new Set(s.decisions.map(d=>d.eventId));let scheduled=SCHEDULE[s.elapsed];if(scheduled==='clinic-scale'&&!s.flags.medicalPilot)scheduled='care-foundation';if(scheduled==='robot-scale'&&!s.flags.robotPilot&&!s.flags.robotPrepared)scheduled='human-industry';if(scheduled&&!seen.has(scheduled))return BY_ID[scheduled];
 const anchors=new Set([...Object.values(SCHEDULE),'mandate','care-foundation','human-industry']);const pool=EVENTS.filter(e=>!anchors.has(e.id)&&!seen.has(e.id)&&e.condition(s));
 if(!pool.length)return null;if(s.player.stress>75&&!seen.has('burnout'))return BY_ID.burnout;if(s.metrics.fiscal<12&&!seen.has('budget'))return BY_ID.budget;
 if(rnd(s.seed,s.elapsed,67)>.44)return null;return pool[Math.floor(rnd(s.seed,s.elapsed,68)*pool.length)];
}
export function actionEligibility(s,action){const check=eligibility(s,action),reasons=[...check.reasons];if(s.pendingId)reasons.push('先完成当前重大抉择');if(s.phase==='final')reasons.push('本局已结束');if(s.projects.some(p=>p.id===action.id&&p.status==='running'))reasons.push('已有同类项目进行中');if(s.actionLast[action.id]!==undefined&&s.elapsed-s.actionLast[action.id]<(action.id==='learn'?3:8))reasons.push('仍在项目冷却期');return {available:!reasons.length,reasons};}
export function startAction(s,id,record=true){const action=ACTIONS.find(a=>a.id===id);if(!action)throw Error('项目不存在');const check=actionEligibility(s,action);if(!check.available)throw Error(check.reasons.join('；'));const n=copy(s);n.metrics.fiscal=clamp(n.metrics.fiscal-action.cost);n.actionLast[id]=n.elapsed;const chance=action.chance===1?1:clamp(action.chance+(n.player.knowledge-58)/500,.55,.94);n.projects.push({id,started:n.elapsed,due:n.elapsed+action.delay,status:'running',chance});if(record)n.commands.push([2,n.elapsed,ACTIONS.indexOf(action)]);log(n,'project',`你主动发起：${action.name}`,`财政 ${action.cost} 点，预计 ${action.delay} 年后验收。当前游戏成功率 ${Math.round(chance*100)}%。${action.desc}`);return n;}
export function advanceYear(s){if(s.phase==='final')throw Error('本局已经结束');if(s.pendingId)throw Error('重大抉择正在等待你，时间已暂停');const n=copy(s);n.elapsed++;n.year++;n.player.age++;
 let policy=POLICIES.find(p=>p.id===n.policy);if(!policyAvailable(n,policy)){policy=POLICIES.at(-1);n.policy=policy.id;log(n,'resource','政策进入休养与储备','财政不足以延续原有年度支出，已暂停新增政策承诺。你可以随时重新规划。');}
 const factor=(n.focus==='research'?1.12:n.focus==='health'?.92:1)*(n.metrics.fiscal<15?.65:1)*SCENARIOS[n.scenario].growth;
 FIELDS.forEach(([k],i)=>n.tech[k]=clamp(n.tech[k]+Math.sqrt(n.budget[i])*.19*factor));
 const m=n.metrics,flags=n.flags,resource=.4+.6*Math.min(1,m.energy/60);
 m.fiscal=clamp(m.fiscal+2.4+(m.prosperity-45)*.015-policy.cost-1.2-(flags.medicalDeployed?.18:0)-(flags.robotDeployed?.18:0));
 for(const[k,v]of Object.entries(policy.effects))m[k]=clamp(m[k]+v);
 m.prosperity=clamp(m.prosperity+(n.tech.science*.009+(flags.robotDeployed?n.tech.robotics*.012:0))*resource-.1);
 m.health=clamp(m.health+(flags.medicalDeployed?n.tech.medicine*.014:n.tech.medicine*.003)-.12+(flags.careServices?.2:0));
 m.employment=clamp(m.employment+n.tech.education*.01-(flags.robotDeployed?n.tech.robotics*.016:.14)+(flags.robotSupport?.25:0));
 m.equity=clamp(m.equity+n.tech.education*.004-(flags.robotDeployed&&!flags.robotSupport?.35:.08)+(flags.redistribute?.12:0));
 m.energy=clamp(m.energy+n.tech.energy*.013-.2-(flags.robotDeployed?.22:0)-(flags.computeRush?.1:0)-n.world.aiAdoption*.0015+(flags.gridNetwork?.25:0));
 m.safety=clamp(m.safety+n.tech.safety*.013-(flags.robotDeployed?.25:.08)-(flags.medicalDeployed?.12:0)+(flags.oversight?.15:0));
 m.trust=clamp(m.trust+(m.equity-50)*.006+(m.safety-50)*.004-.04);
 m.happiness=clamp(m.happiness+(m.equity-50)*.007+(m.health-55)*.004+(m.employment-50)*.004-n.world.heat*.0025+(flags.shorterHours?.22:0)+(flags.wellbeing?.2:0));
 const p=n.player;p.knowledge=clamp(p.knowledge+(n.focus==='research'?.7:.13));p.reputation=clamp(p.reputation+(n.focus==='delivery'?.6:.12)+(m.trust-50)*.001);p.stress=clamp(p.stress+(n.focus==='delivery'?1.7:n.focus==='health'?-2.8:n.focus==='connection'?-1.6:.7)-(flags.delegation?.4:0));p.health=clamp(p.health+(n.focus==='health'?1.5:0)-(p.age>60?.45:.15)-(p.stress>65?.6:0),5,100);
 if(n.focus==='connection'){m.trust=clamp(m.trust+.15);m.happiness=clamp(m.happiness+.1);}n.orientation=n.orientation.map((v,i)=>v+policy.tags[i]);n.orientation[0]+=(n.budget[1]+n.budget[2]-n.budget[5]-20)/100;n.orientation[1]+=(n.budget[0]+n.budget[3]-n.budget[1]-n.budget[2])/100;n.orientation[3]+=(n.budget[1]+n.budget[4]+n.budget[5]-35)/100;
 for(const project of n.projects.filter(p=>p.status==='running'&&p.due<=n.elapsed)){const a=ACTIONS.find(x=>x.id===project.id),success=rnd(n.seed,project.started,100+ACTIONS.indexOf(a))<project.chance;project.status=success?'success':'failed';project.finished=n.elapsed;if(success){for(const[k,v]of Object.entries(a.effects))m[k]=clamp(m[k]+v);for(const[k,v]of Object.entries(a.personal||{}))n.player[k]=clamp(n.player[k]+v);if(a.flag)flags[a.flag]=true;}log(n,'project',`${a.name}：${success?'通过验收':'未通过本轮验收'}`,success?'此前的投入开始进入日常能力。成果将影响后续年份，仍需要维护。':'投入已经发生，但本轮没有达到验收条件。你保留了验证记录，未来可以调整再试。');}
 n.world=nextWorld(n.world,n);n.reference=nextWorld(n.reference,n,true);if(flags.recessionYears>0)flags.recessionYears--;
 n.worldHistory.push({...worldView(n.world),happiness:n.metrics.happiness});n.referenceHistory.push(worldView(n.reference));
 log(n,'world',`${n.year} · 世界年度简报`,`实际 GDP 指数 ${n.world.gdp.toFixed(1)}，人均 ${n.world.gdpPerCapita.toFixed(1)}；人民幸福度 ${m.happiness.toFixed(1)}。CO₂ ${n.world.co2.toFixed(2)} ppm（本年 +${n.world.co2Delta.toFixed(2)}）；出生率 ${n.world.birthRate.toFixed(2)}‰。`);
 for(const[category,text]of annualNews(n))log(n,'daily',category,text);
 let index=Math.floor(rnd(n.seed,n.elapsed,91)*SMALL_MOMENTS.length);const recent=new Set(n.feed.filter(x=>x.kind==='personal').slice(-8).map(x=>x.text));while(recent.has(SMALL_MOMENTS[index]))index=(index+1)%SMALL_MOMENTS.length;log(n,'personal','你的一年',SMALL_MOMENTS[index]);
 checkMilestones(n);
 if(n.elapsed>=END-START){n.phase='final';n.pendingId=null;log(n,'career','你的五十年，写进交接书','你把技术、生活与世界趋势放在同一份图文档案里。你的称号描述决策倾向，成果与代价则由这条路线留下。');return n;}
 const event=chooseAnnualEvent(n);if(event){n.pendingId=event.id;log(n,'major',event.title,event.text,{eventId:event.id});}return n;
}
export function finalMoments(s){const milestones=s.feed.filter(x=>x.kind==='milestone').slice(0,3);const successful=s.feed.filter(x=>x.kind==='project'&&x.title.includes('通过验收')).slice(0,1);const decision=s.decisions.find(d=>d.eventId==='retirement')||s.decisions.at(-1);const result=[...milestones,...successful];if(decision)result.push({year:decision.year,title:decision.event,text:`你选择了「${decision.choice}」。${decision.impact.long}`,kind:'decision'});return result.sort((a,b)=>a.year-b.year).slice(0,5);}
const finite=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b;
export function validSave(s){return !!s&&s.version===VERSION&&Number.isInteger(s.seed)&&finite(s.seed,0,4294967295)&&Object.hasOwn(SCENARIOS,s.scenario)&&Number.isInteger(s.elapsed)&&finite(s.elapsed,0,50)&&s.year===START+s.elapsed&&['live','final'].includes(s.phase)&&(s.phase!=='final'||s.elapsed===50)&&(!s.pendingId||Object.hasOwn(BY_ID,s.pendingId))&&s.player&&typeof s.player.name==='string'&&s.player.name.length<=16&&s.player.age===28+s.elapsed&&typeof s.player.role==='string'&&['health','knowledge','stress','reputation'].every(k=>finite(s.player[k],0,100))&&METRICS.every(([k])=>finite(s.metrics?.[k],0,100))&&FIELDS.every(([k])=>finite(s.tech?.[k],0,100))&&Array.isArray(s.budget)&&s.budget.length===6&&s.budget.every(x=>Number.isInteger(x)&&x>=0&&x<=100&&x%5===0)&&s.budget.reduce((a,b)=>a+b,0)===100&&POLICIES.some(x=>x.id===s.policy)&&FOCUSES.some(x=>x.id===s.focus)&&s.flags&&typeof s.flags==='object'&&Array.isArray(s.orientation)&&s.orientation.length===4&&s.orientation.every(x=>finite(x,-1000,1000))&&[s.world,s.reference].every(w=>w&&Array.isArray(w.cohorts)&&w.cohorts.length===100&&w.cohorts.every(x=>finite(x,0,1e10))&&finite(w.population,1e8,5e10)&&finite(w.co2,250,1500)&&finite(w.gdp,1,5000)&&finite(w.fertility,.5,5)&&finite(w.basePopulation,1e9,2e10)&&w.year===s.year&&['gdpPerCapita','gdpGrowth','co2Delta','emissions','birthRate','deathRate','births','deaths','olderShare','aiAdoption','clean','heat'].every(k=>finite(w[k],-100,5e10))&&Math.abs(w.cohorts.reduce((a,b)=>a+b,0)-w.population)<10)&&Array.isArray(s.worldHistory)&&s.worldHistory.length===s.elapsed+1&&s.worldHistory.every(w=>w&&['year','gdp','gdpPerCapita','gdpGrowth','co2','co2Delta','emissions','population','fertility','birthRate','deathRate','births','deaths','olderShare','aiAdoption','clean','heat','happiness'].every(k=>finite(w[k],-100,5e10)))&&Array.isArray(s.referenceHistory)&&s.referenceHistory.length===s.elapsed+1&&s.referenceHistory.every(w=>w&&['year','gdp','gdpPerCapita','gdpGrowth','co2','co2Delta','emissions','population','fertility','birthRate','deathRate','births','deaths','olderShare','aiAdoption','clean','heat'].every(k=>finite(w[k],-100,5e10)))&&Array.isArray(s.feed)&&s.feed.length<1000&&s.feed.every(x=>x&&Number.isInteger(x.year)&&['career','world','daily','personal','decision','major','project','milestone','plan','resource'].includes(x.kind)&&typeof x.title==='string'&&typeof x.text==='string')&&Array.isArray(s.decisions)&&s.decisions.length<60&&s.decisions.every(x=>x&&Object.hasOwn(BY_ID,x.eventId)&&Number.isInteger(x.year)&&typeof x.category==='string'&&typeof x.event==='string'&&typeof x.choice==='string'&&x.impact&&Array.isArray(x.impact.direct)&&x.impact.direct.every(v=>typeof v==='string')&&typeof x.impact.long==='string')&&Array.isArray(s.projects)&&s.projects.length<100&&s.projects.every(x=>x&&ACTIONS.some(a=>a.id===x.id)&&Number.isInteger(x.due)&&['running','success','failed'].includes(x.status)&&finite(x.chance,0,1))&&s.actionLast&&Array.isArray(s.commands)&&s.commands.length<=320&&s.commands.every(c=>Array.isArray(c)&&[0,1,2].includes(c[0])&&Number.isInteger(c[1])&&c[1]>=0&&c[1]<=49)&&(!s.previous||(typeof s.previous.name==='string'&&typeof s.previous.code==='string'&&['gdp','co2','happiness'].every(k=>finite(s.previous[k],0,5000))))&&Array.isArray(s.milestones)&&s.milestones.every(x=>x&&typeof x.id==='string'&&Number.isInteger(x.year)&&typeof x.title==='string'&&typeof x.metric==='string'&&typeof x.text==='string');}
