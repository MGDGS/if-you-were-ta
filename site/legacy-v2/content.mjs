export const FIELDS = [
  ['medicine','医学与健康','让医疗抵达更多人','✳'], ['science','科学与工程','把研究变成新的可能','⌘'],
  ['robotics','机器人与制造','让机器进入实体生活','◈'], ['education','教育与服务','让普通人也能跟上未来','◎'],
  ['energy','能源与计算','给进步供电，给生活留余量','ϟ'], ['safety','安全与治理','为前行的世界建立护栏','◇']
];
export const METRICS = [['prosperity','生活水平'],['health','健康水平'],['equity','机会公平'],['trust','公众信任'],['employment','转型适应'],['energy','能源余量'],['safety','系统安全'],['fiscal','财政储备']];
export const SCENARIOS = {
  steady:{name:'缓慢落地',desc:'突破需要耐心，落地成本居高不下。',growth:.85,shock:1},
  fast:{name:'快速进展',desc:'技术接连突破，社会能否跟上？',growth:1.2,shock:2},
  waves:{name:'波动发展',desc:'热潮和冷却交替，耐心接受考验。',growth:1,shock:6}
};
// Tags: exploration, inclusion, public provision, long-term investment.
export const POLICIES = [
  {id:'training',name:'全民再培训',desc:'给转岗的人留出学习与生活的余地。',cost:5,effects:{employment:3,equity:1},tags:[0,2,2,1]},
  {id:'audit',name:'高风险独立审计',desc:'慢一点上线，换取复核与追责的能力。',cost:3,effects:{safety:3,trust:1,prosperity:-.7},tags:[-2,0,1,0]},
  {id:'access',name:'公共服务普惠',desc:'把服务送进资源不足的地方。',cost:6,effects:{health:1.5,equity:2},tags:[0,3,3,0]},
  {id:'accelerate',name:'加快应用审批',desc:'让市场快速试错，承担更高的转型压力。',cost:1,effects:{prosperity:2,safety:-2,employment:-1},tags:[3,-1,-2,-1]},
  {id:'maintain',name:'休养与储备',desc:'本期不加新承诺，修复基础服务和财政。',cost:0,effects:{fiscal:2,safety:.5},tags:[-1,0,0,1]}
];
const c=(id,label,hint,cost,effects={},flags={},tags=[0,0,0,0],requires={})=>({id,label,hint,cost,effects,flags,tags,requires});
const e=(id,title,text,chain,choices,context)=>({id,title,text,chain,choices,context});
export function eventFor(s){
 const f=s.flags,t=s.tech,m=s.metrics;
 switch(s.turn){
 case 0:return e('medical-data','她想把时间留给病人','县医院护士林岚，每周要花不少时间整理病历。医院希望试用 AI，但患者担心健康数据流向不明。你愿意怎样开始？','医疗 · 起点',[
 c('public-pilot','建立公共医疗试点','先做匿名化与人工复核。覆盖有限，为后续验证积累证据。',4,{health:1,safety:1},{medical:'pilot',medicalPublic:true},[0,2,2,2]),
 c('commercial-pilot','让企业与医院合作','试点更快启动。保留人工签字，数据和服务由企业管理。',1,{prosperity:1,trust:-1},{medical:'pilot',medicalPublic:false},[2,-1,-2,0]),
 c('staff-first','先保障现有护理服务','不启动新增项目，维持人工路径，AI 临床应用暂缓。',0,{health:.5,equity:.5},{medical:'staff'},[-1,2,1,0])]);
 case 1:return t.robotics>=16?e('robot-pilot','工厂门口的新名单','陈默所在的工厂提交了机器人试点方案。新设备能增加产出，第一批岗位也会改变。你怎样安排试点？','机器人 · 起点',[
 c('supported-pilot','部署试点，附带带薪转岗','培训和过渡补助一起安排，进展会慢一些。',6,{employment:2},{robot:'pilot',robotSupport:true},[1,2,2,1],{energy:30}),
 c('market-pilot','让企业自行安排试点','更快形成产出，转岗主要由企业和个人承担。',1,{prosperity:2,employment:-2},{robot:'pilot',robotSupport:false},[3,-2,-2,-1],{energy:30}),
 c('robot-wait','先改善工艺，暂不部署','保留现有岗位，实体自动化试验推迟。',0,{employment:1},{robot:'waiting'},[-2,1,0,1])]):e('robot-foundation','设备还没准备好','工厂想引进机器人，但可靠性与维护人才还不足。陈默问：既然还不能用，能否先教大家认识这项技术？','机器人 · 基础',[
 c('prepare-training','先办基础技能培训','为未来转岗准备，暂时不会有部署收益。',3,{employment:2},{robot:'prepared',robotSupport:true},[-1,2,2,2]),
 c('prepare-private','由企业出资建立实验室','公共支出较少，基础能力积累更集中。',0,{prosperity:1},{robot:'prepared',robotSupport:false},[1,-1,-2,1]),
 c('robot-wait','暂缓，继续积累技术','这一阶段不做实体部署。',0,{fiscal:1},{robot:'waiting'},[-2,0,0,1])]);
 case 2:return e('education-access','教室里出现了第二位老师','许知夏进入升学阶段。好的 AI 学习工具已经出现，但订阅费、教师培训和数据规则还没有答案。','教育 · 起点',[
 c('open-classroom','公共学习平台，教师主导','让家庭资源少的学生也能使用，并保留独立思考练习。',5,{equity:2,employment:1},{education:'open',teacherLed:true},[0,3,3,2]),
 c('premium-classroom','鼓励优质订阅服务','产品迭代更快，优质工具首先覆盖有支付能力的家庭。',0,{prosperity:2,equity:-2},{education:'premium',teacherLed:false},[2,-2,-3,0]),
 c('basic-classroom','先支持教师，不依赖 AI','强化基础教育，暂时不推广学习平台。',2,{equity:1},{education:'basic',teacherLed:true},[-2,1,2,1])]);
 case 3:return f.medical==='pilot'?e('medical-scale','试点之后，谁能用上？',`早期医疗试点完成阶段评估。林岚看到文书时间减少，也遇到了需要人工纠正的建议。${f.medicalPublic?'公共试点留下了可审查的记录。':'企业希望将服务转为付费套餐。'}你会怎样扩大？`,'医疗 · 承接试点',[
 c('universal-care','验证后接入基层公共医疗','覆盖更广，但培训与人工复核需要持续投入。',7,{health:3,equity:2},{medical:'deployed',medicalPublic:true},[1,3,3,1],{tech:['medicine',23],energy:25}),
 c('market-care','允许付费服务先行','更快应用，低收入人群可能更晚受益。',1,{health:2,prosperity:2,equity:-2},{medical:'deployed',medicalPublic:false},[3,-2,-2,-1],{tech:['medicine',23],energy:25}),
 c('continue-validation','延长验证，保留原试点','暂不扩大，让更多证据积累。',0,{safety:2},{medical:'pilot'},[-2,0,1,2])]):e('medical-basic','基层仍在等待','此前没有推进 AI 临床试点。林岚所在的医院想争取一次机会，也希望基础护理不要因此被挤掉。','医疗 · 新的入口',[
 c('start-late-pilot','启动带人工复核的试点','此时开始仍需验证，无法直接全国推广。',4,{health:1,safety:1},{medical:'pilot',medicalPublic:true},[1,2,2,2],{tech:['medicine',18]}),
 c('nursing-network','扩大社区护理网络','直接改善服务可及性，继续保留人工路径。',4,{health:2,equity:2},{medical:'staff'},[-1,3,2,0]),
 c('maintain-care','维持现有服务，先修复财政','避免增加新承诺。',0,{fiscal:2},{},[-1,0,0,1])]);
 case 4:return f.robot==='pilot'||f.robot==='prepared'?e('robot-scale','从一间工厂，到整个行业',`前期${f.robot==='pilot'?'试点':'技能准备'}进入下一阶段。${f.robotSupport?'陈默获得了培训名额，但仍需时间完成考核。':'陈默需要自己承担转岗的时间与生活成本。'}机器人现在应如何落地？`,'机器人 · 扩大部署',[
 c('robot-social','扩大部署，保留转岗保障','把培训和收入过渡纳入推广成本。',7,{prosperity:2,employment:2},{robot:'deployed',robotSupport:true},[1,2,2,1],{tech:['robotics',25],energy:35}),
 c('robot-fast','快速扩大，优先生产效率','收益更快出现，旧岗位的调整也更急。',1,{prosperity:4,employment:-3,energy:-3},{robot:'deployed',robotSupport:false},[3,-3,-2,-1],{tech:['robotics',25],energy:35}),
 c('keep-robot-pilot','保留现有试点，不扩大','不追加新项目，给人和设施更多准备时间。',0,{employment:1},{robot:'pilot'},[-1,1,1,2])]):e('energy-foundation','还没有机器人大军','此前暂缓了机器人部署。现在可以先补足能源与维护基础，或者继续保留人工产业路径。','基础设施 · 分支',[
 c('build-energy','建设公共能源与维护网络','下一阶段供给更充足，为未来部署留出余量。',6,{energy:5},{energyProject:true},[0,1,2,3]),
 c('private-energy','鼓励企业建设专用设施','公共支出少，资源会首先流向回报较高的项目。',0,{energy:2,equity:-1},{},[1,-1,-2,1]),
 c('human-industry','投资人工产业的质量升级','提高工作质量，本期不走机器人规模化路线。',2,{employment:2,prosperity:1},{humanIndustry:true},[-1,2,1,0])]);
 case 5:return f.education==='open'?e('education-followup','第一批受益的学生长大了','公共学习平台的学生开始进入职场。许知夏想继续学习，但工具给出答案的速度，已经超过新岗位出现的速度。','教育 · 毕业之后',[
 c('education-bridge','建立实习与在职进修通道','让学习连接真实工作，仍需付出导师和岗位成本。',5,{employment:3,equity:1},{educationBridge:true},[0,3,2,2]),
 c('education-market','让企业按需求挑选人才','减少公共负担，起步困难的人仍需自找机会。',0,{prosperity:2,equity:-1},{educationBridge:false},[1,-2,-2,0]),
 c('education-independent','支持独立能力与公共研究','强调提问和验证，回报较慢。',3,{safety:1,employment:1},{educationBridge:true,independentSkills:true},[-1,2,2,3])]):e('education-divide','工具普及了，机会呢？',f.education==='premium'?'优质工具主要通过订阅服务提供。许知夏所在家庭的支付能力，仍然影响她能用到什么。':'教师支持改善了课堂，但新的工作越来越依赖数字技能。许知夏希望有一个补上差距的入口。','教育 · 路径修正',[
 c('education-repair','补贴基础工具，开放转岗学习','把后来者接进来，但弥补差距需要时间。',5,{equity:3,employment:1},{education:'open',educationBridge:true},[0,3,3,1]),
 c('education-vouchers','向企业购买职业训练名额','训练更贴近岗位，覆盖受供给限制。',2,{employment:2},{educationBridge:true},[1,1,-1,0]),
 c('education-status','维持现有路径','不新增支出，也暂时不补齐差距。',0,{fiscal:1},{},[-1,-1,-1,1])]);
 case 6:return f.robot==='deployed'||f.medical==='deployed'?e('deployed-review','当系统需要有人负责',`已经落地的${f.robot==='deployed'?'机器人':'医疗 AI'}系统出现了一次可纠正的异常。没有大规模灾难，但谁复核、谁负责，已不能回避。`,'部署 · 责任回访',[
 c('public-review','公开调查，设立独立复核','保留服务，同时承担长期监督成本。',5,{safety:4,trust:2},{oversight:true},[-1,2,3,2]),
 c('vendor-review','由供应商修复并作出赔偿','恢复速度快，公众对独立性的疑问仍在。',1,{safety:1,trust:-1,prosperity:1},{oversight:false},[2,-1,-2,0]),
 c('limit-high-risk','缩减高风险应用，保住基本服务','降低风险，也放弃部分部署收益。',0,{safety:3,prosperity:-2},{limitedDeployment:true},[-3,1,1,1])]):e('slow-path','慢行也有成本','你没有部署大规模高风险 AI，因此没有同样的部署事故。但外部产业已经变化，公众开始追问：我们是在准备，还是在错过？','发展 · 另一种代价',[
 c('research-partnership','开放研究合作，加快验证','不直接跳到部署，先提升验证能力。',3,{prosperity:1,safety:1},{researchNetwork:true},[2,0,1,2]),
 c('careful-path','继续可靠优先的路线','保留安全与信任，接受部分产出差距。',1,{safety:3,trust:1,prosperity:-1},{},[-3,1,1,1]),
 c('capacity-first','整顿现有项目，停止新增承诺','保留资源，为下一个阶段做准备。',0,{fiscal:3},{},[-2,0,0,1])]);
 case 7:return m.fiscal<25?e('fiscal-reckoning','承诺，到了付账的时候','此前项目的建设与维护都需要钱。财政已经承压，林岚担心服务缩减，陈默则担心下一次培训会被取消。','财政 · 承诺的回声',[
 c('progressive-fund','提高高收益部门的公共分担','补充财政和保障，牺牲部分增长速度。',0,{fiscal:7,equity:2,prosperity:-2},{redistribute:true},[-1,3,3,1]),
 c('trim-programs','缩减新增项目，优先基本服务','降低公共承诺，把部分责任还给个人。',0,{fiscal:8,health:-1,equity:-2},{trimmed:true},[-1,-1,-1,1]),
 c('borrow-time','用短期融资维持服务','暂时缓解压力，下一阶段需要偿还。',0,{fiscal:5},{debtDue:s.turn+1},[1,1,1,-3])]):e('dividend','进步的收益，留给谁？',`这些年的${f.robot==='deployed'?'自动化':'研究与服务'}带来了新的价值。现在可以把一部分收益转为公共保障，也可以继续投入下一轮竞争。`,'分配 · 成果与代价',[
 c('public-dividend','建立公共技术红利基金','让更多人分享收益，减少部分再投资空间。',4,{equity:3,health:1},{redistribute:true},[-1,3,3,1]),
 c('reinvest-dividend','让企业扩大下一轮投入','争取下一次突破，收益差距可能扩大。',0,{prosperity:3,equity:-2},{},[3,-2,-3,2]),
 c('shared-ownership','支持员工协商和收益分享','用更慢的协商换取利益连接。',2,{equity:2,trust:2},{sharedOwnership:true},[0,2,0,1])]);
 case 8:return e('care-and-time','时间，最后流向哪里？','林岚进入退休生活，陈默开始考虑养老，许知夏也在照顾家人。生产工具越来越强，人能不能拥有更多自己的时间？','生活 · 晚年的回访',[
 c('care-time','支持照护服务与弹性工时','减少家庭照护压力，需要持续公共投入。',5,{health:2,trust:2},{careTime:true},[-1,3,3,1]),
 c('productivity-time','把效率用于新产业竞争','保持产出，工作与照护继续由家庭协调。',0,{prosperity:3,energy:-2},{careTime:false},[2,-2,-2,1]),
 c('local-time','支持社区互助与行业协商','成本较低，改善范围因社区资源而异。',2,{trust:2,equity:1},{communityCare:true},[-1,2,1,0])]);
 default:return e('legacy','把这个世界交给下一代','五十年的任期即将结束。你还可以决定，最值得留给后来者的是什么。此前尚未完成的承诺，也会写进交接书。','未来 · 最后一笔',[
 c('open-legacy','开放知识与公共技术','把经验留下，让后来的人能接着做。',3,{equity:2,employment:1},{openLegacy:true},[1,2,3,3]),
 c('frontier-legacy','建设下一代科研平台','给未知的突破留空间，也留下维护任务。',5,{prosperity:2},{frontierLegacy:true},[3,-1,0,3],{tech:['science',24],energy:25}),
 c('steward-legacy','留下维护与监督的制度','不追加大型项目，优先明确已有服务的维护责任。',0,{safety:2,trust:2},{oversight:true},[-2,1,2,2])]);
 }
}
