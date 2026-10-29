export const FIELDS=[['medicine','医学与健康','诊断、药物与照护','✳'],['science','科学与工程','基础研究与工程验证','⌘'],['robotics','机器人与制造','生产、物流与实体自动化','◈'],['education','教育与服务','学习、转岗与公共服务','◎'],['energy','能源与计算','清洁供电、储能与算力','ϟ'],['safety','安全与治理','审计、责任与系统韧性','◇']];
export const METRICS=[['prosperity','生活水平'],['happiness','人民幸福度'],['health','公共健康'],['equity','机会公平'],['trust','公众信任'],['employment','转型适应'],['energy','能源余量'],['safety','系统安全'],['fiscal','公共财政']];
export const SCENARIOS={steady:{name:'稳步发展',desc:'技术缓慢落地，稳步积累能力。',growth:.85},fast:{name:'加速突破',desc:'能力提升很快，能源与社会调整更紧张。',growth:1.18},waves:{name:'热潮与波动',desc:'突破、投资过热和收缩交替出现。',growth:1}};
export const POLICIES=[
 {id:'training',name:'转岗与培训',desc:'优先支持人的适应。每年财政 1.0 点。',cost:1,effects:{employment:.7,equity:.25},tags:[0,.3,.3,.15]},
 {id:'audit',name:'验证与审计',desc:'降低高风险应用压力。每年财政 0.7 点。',cost:.7,effects:{safety:.7,trust:.2,prosperity:-.15},tags:[-.4,0,.2,0]},
 {id:'access',name:'普惠与服务',desc:'扩大公共服务可及性。每年财政 1.3 点。',cost:1.3,effects:{health:.3,equity:.5,happiness:.2},tags:[0,.5,.5,0]},
 {id:'accelerate',name:'快速落地',desc:'提高部署速度，风险与转型压力更大。每年财政 0.3 点。',cost:.3,effects:{prosperity:.45,safety:-.45,employment:-.2},tags:[.5,-.2,-.3,-.2]},
 {id:'maintain',name:'休养与储备',desc:'不增加年度政策支出，优先积累财政余量。',cost:0,effects:{fiscal:.5},tags:[-.1,0,0,.2]}
];
export const FOCUSES=[{id:'research',name:'研究与学习',hint:'知识↑，精力与心情略受挤压'},{id:'delivery',name:'推进项目',hint:'声誉与落地效率↑，压力↑'},{id:'health',name:'健康与休息',hint:'恢复健康、降低压力，研究速度稍慢'},{id:'connection',name:'沟通与生活',hint:'幸福与信任↑，给工作留出边界'}];
const c=(id,label,cost,effects,flags={},tags=[0,0,0,0],long='',risk='',requires={})=>({id,label,cost,effects,flags,tags,long,risk,requires});
const e=(id,title,text,category,choices,condition=()=>true)=>({id,title,text,category,choices,condition});
export const EVENTS=[
 e('mandate','你的第一份任命书','你被任命为虚构的全球 AI 合作计划总工程师。你能分配研发、提出政策、批准试点；你不能保证突破，也不能直接命令世界变好。第一份任期方案，你把什么放在前面？','任命',[
 c('people','先让技术接住普通人的需要',2,{happiness:2,equity:2},{peopleFirst:true},[0,2,2,1],'后续更重视教育、医疗与基本服务。'),
 c('frontier','先争取下一次能力突破',2,{prosperity:2},{frontierFirst:true},[3,-1,0,2],'为前沿研究建立入口。','突破时点仍不确定。'),
 c('reliable','先建立可靠的规则与底座',0,{safety:2,trust:1},{reliableFirst:true},[-2,0,2,2],'为后续审计与公开验证积累信任。')]),
 e('compute','电力，开始追不上算力','新的模型需要更大的计算中心。你面前有一张电网负荷表，也有居民与企业的用电需求。','能源',[
 c('clean','先配套清洁供电和储能',6,{energy:4},{cleanGrid:true},[0,1,2,2],'降低之后的排放增长率；CO₂ 浓度不会立刻回落。','建设仍需要时间。'),c('quick','先保障计算项目快速上线',1,{prosperity:3,energy:-3,safety:-1},{computeRush:true},[2,-1,-2,-1],'增加 AI 采用与用电需求。','排放与供电压力可能更高。'),c('cap','限制高峰计算，分阶段建设',0,{energy:2,prosperity:-1},{efficiency:true},[-2,1,1,1],'降低部分能源浪费，接受较慢的部署速度。')]),
 e('clinic','病历能交给 AI 吗？','医院申请辅助诊断试点。你看到节省时间的机会，也需要决定数据如何使用、谁为错误负责。','医学',[
 c('public','匿名化、人工复核，再开始试点',4,{health:1,safety:1},{medicalPilot:true,medicalPublic:true},[0,2,2,2],'后续可申请基层推广，先积累验证记录。'),c('private','让供应商与医院共同试点',1,{prosperity:2,trust:-1},{medicalPilot:true,medicalPublic:false},[2,-1,-2,0],'服务更快出现，可能首先流向付费人群。'),c('staff','优先保障现有人工服务',0,{health:1,happiness:1},{manualCare:true},[-1,2,1,0],'本期不启动临床 AI 试点。')]),
 e('robots','第一条机器人生产线','实体自动化终于走到可试验阶段。你要决定，转岗支持是否和机器一起进入工厂。','机器人',[
 c('supported','带薪转岗与设备试点一起做',6,{employment:2},{robotPilot:true,robotSupport:true},[1,2,2,1],'为之后的规模部署准备维护人才。','试点不能保证所有人都成功转岗。',{tech:['robotics',17],energy:25}),c('market','让企业自行组织试点',1,{prosperity:2,employment:-2},{robotPilot:true,robotSupport:false},[2,-2,-2,-1],'更快形成部署经验。','个人可能承担较多转型成本。',{tech:['robotics',17],energy:25}),c('prepare','先培训，不急着装上生产线',0,{employment:1},{robotPrepared:true},[-1,1,1,2],'保留人工产业路径，稍后再讨论部署。')]),
 e('classroom','工具普及，教育会更公平吗？','AI 学习系统开始进入课堂。你要决定如何付费、如何训练教师，以及是否保留独立作答与验证。','教育',[
 c('open','公共平台，教师主导',5,{equity:3,employment:1},{educationOpen:true},[0,3,3,2],'为更多家庭提供工具与转岗学习入口。'),c('premium','让优质订阅服务先发展',0,{prosperity:2,equity:-2},{premiumEducation:true},[2,-2,-3,0],'产品更新更快，家庭支付能力会影响获得的服务。'),c('teachers','优先支持教师和基础能力',2,{equity:1,safety:1},{teacherSupport:true},[-1,1,2,1],'不依赖单一工具，强调提问与判断。')]),
 e('grid','你想留下一张怎样的电网？','低碳能源不只影响计算，也影响工厂、交通与家庭。大规模基础设施需要提前投入。','基础设施',[
 c('public-grid','建设公共储能与电网协作',7,{energy:5},{cleanGrid:true,gridNetwork:true},[0,1,3,3],'降低长期排放增速，提高清洁供给扩张。'),c('private-grid','让企业建设专用能源',1,{energy:3,equity:-1},{privateGrid:true},[1,-1,-2,1],'优先满足高回报项目。'),c('efficient','先提升既有系统效率',0,{energy:2},{efficiency:true},[-1,0,0,1],'改善资源使用，暂缓大型建设。')]),
 e('clinic-scale','从临床试点，到日常服务','早期试点留下了可审查的记录。你现在需要决定，是否扩大使用，以及怎样保留复核与问责。','医学 · 后续',[
 c('universal','接入基层公共医疗',7,{health:3,equity:2,happiness:1},{medicalDeployed:true,medicalPublic:true},[1,3,3,1],'医疗改善逐年影响健康与模型死亡率。','并不意味着消除疾病。',{tech:['medicine',25],energy:25}),c('paid','允许付费服务先扩大',1,{health:2,prosperity:2,equity:-2},{medicalDeployed:true,medicalPublic:false},[2,-2,-2,0],'更快部署，但获得服务的机会不均。',{tech:['medicine',25],energy:25}),c('validate','继续验证，维持现有范围',0,{safety:2},{},[-2,0,1,2],'不提前把试点当成全国普及。')],s=>s.flags.medicalPilot),
 e('care-foundation','没有捷径的基层服务','此前没有建立临床 AI 试点。你仍可以改善基层服务，或为新的验证过程打开一个入口。','医疗 · 分支',[
 c('new-pilot','现在开始有人工复核的试点',4,{health:1},{medicalPilot:true,medicalPublic:true},[1,2,2,2],'从试点开始，无法跳过验证。'),c('care','扩大社区照护网络',3,{health:2,happiness:1},{careServices:true},[-1,2,2,0],'减轻部分家庭照护压力。'),c('keep','保障基本服务，暂不新增项目',0,{fiscal:1},{},[-1,0,0,1],'不作新的财政承诺。')]),
 e('robot-scale','扩大自动化，还是再等等？','实验室外的维护、劳动与能源问题逐渐清楚。你要对真正的规模化推广作出决定。','机器人 · 后续',[
 c('supported','扩大部署，保留转岗保障',7,{prosperity:3,employment:2},{robotDeployed:true,robotSupport:true},[1,2,2,1],'生产率逐年提高，也会增加用电。','培训结果仍与技能和岗位供给有关。',{tech:['robotics',28],energy:35}),c('fast','快速扩大，优先产出',1,{prosperity:4,employment:-3,energy:-2},{robotDeployed:true,robotSupport:false},[3,-3,-2,-1],'更快提升模型 GDP，也可能加大转型与分配压力。',{tech:['robotics',28],energy:35}),c('wait','保留试点，不作全面推广',0,{employment:1},{},[-1,1,1,2],'给准备与验证更多时间。')],s=>s.flags.robotPilot||s.flags.robotPrepared),
 e('human-industry','没有选择机器人，也要面对竞争','你没有建立实体自动化试点。人工产业可以继续升级，但不能假装外部世界也停了下来。','产业 · 分支',[
 c('quality','支持质量与技能升级',4,{employment:2,prosperity:1},{humanIndustry:true},[-1,2,1,1],'提高既有工作的适应能力。'),c('collaborate','开放跨行业合作',2,{prosperity:2},{researchNetwork:true},[1,0,0,1],'积累经验，未来仍可启动新试点。'),c('save','先保留财政余量',0,{fiscal:2},{},[-1,0,0,1],'避免新增负担。')]),
 e('labor','效率提升之后，工时会减少吗？','产出增加，不代表每个人都拥有更多时间。你要决定，效率红利如何进入劳动与生活。','劳动',[
 c('hours','试行更短工时与转岗保障',5,{happiness:4,employment:2,prosperity:-1},{shorterHours:true},[-1,3,3,1],'你的压力略缓解，社会幸福度得到持续支持。'),c('competition','把效率继续投入产业竞争',0,{prosperity:3,happiness:-1},{growthPriority:true},[2,-2,-2,1],'GDP 增长更快，但工作压力可能持续。'),c('negotiate','由行业协商，公开执行结果',1,{trust:2,equity:1},{sharedOwnership:true},[0,1,0,1],'覆盖效果可能因行业而异。')]),
 e('demographic','越来越少的新生儿，越来越多的照护','模型中的总和生育率下降，老龄人口占比提高。技术可以减轻照护负担，却无法替代家庭对未来的信心。','人口',[
 c('family','托育、住房与弹性工作一起试点',6,{happiness:3,equity:1},{familySupport:true,careServices:true},[0,3,3,2],'逐步减缓模型生育率下降，不会立刻让出生人数反弹。','年龄结构仍会影响人口变化。'),c('care','优先扩大老年照护与辅助工具',3,{health:2,happiness:1},{careServices:true},[1,2,1,1],'降低家庭照护压力。'),c('adapt','接受结构变化，先调整服务布局',0,{fiscal:1,trust:1},{populationAdapt:true},[-1,0,0,1],'不直接干预生育选择。')]),
 e('oversight','当系统需要有人负责','你负责的计划逐渐变大。错误由谁发现、申诉由谁处理、损失由谁承担，需要清楚的制度。','治理',[
 c('independent','建立独立审计与申诉体系',5,{safety:4,trust:3},{oversight:true},[-2,2,3,2],'降低后续部署事故压力。'),c('vendors','由供应商承担主要修复责任',1,{safety:1,prosperity:1},{vendorResponsibility:true},[1,-1,-2,0],'恢复较快，独立性仍会受质疑。'),c('limit','缩减高风险应用，保住基本服务',0,{safety:3,prosperity:-1},{limitedDeployment:true},[-2,1,1,1],'接受一部分产出损失。')]),
 e('wellbeing','GDP 之外，你想交出什么？','你看过增长曲线，也看过疲惫与不安。任期进入后半段，你希望怎样衡量一个更好的社会？','幸福',[
 c('life','把幸福、健康与闲暇纳入考核',4,{happiness:4,health:1},{wellbeing:true},[-1,3,2,1],'不只用产出评价技术。'),c('gdp','坚持产出与人均收入优先',0,{prosperity:3},{growthPriority:true},[2,-1,-1,1],'继续追求经济空间，也要承受分配争议。'),c('dashboard','公开多维成绩，允许公众讨论',1,{trust:3,safety:1},{openDashboard:true},[0,2,2,1],'把权衡留在公共视野中。')]),
 e('legacy','把未完成的事，也写进交接书','几十年的选择已经形成路径。你想留给下一任的是工具、制度，还是继续探索的空间？','传承',[
 c('open','开放知识与公共技术',3,{equity:2,employment:1},{openLegacy:true},[1,2,3,3],'保留后来者继续学习与改进的入口。'),c('frontier','建设下一代研究平台',5,{prosperity:2},{frontierLegacy:true},[3,-1,0,3],'留下机会，也留下维护任务。',{tech:['science',30],energy:25}),c('maintain','明确维护责任，不追加大型项目',0,{safety:2,trust:2},{oversight:true},[-2,1,2,2],'把可靠运行放在最后一笔。')]),
 e('handover','最后一次签字','五十年的规划生涯将结束。你把哪一条建议留在报告的第一页？','交接',[
 c('human','所有进步，都要回到人的生活',0,{happiness:1},{},[0,2,1,1],'写进你的最终规划画像。'),c('unknown','给未知保留试验与纠错的空间',0,{safety:1},{},[2,0,0,2],'写进你的最终规划画像。'),c('limits','让承诺始终接受资源与事实检验',0,{trust:1},{},[-2,0,1,1],'写进你的最终规划画像。')]),
 // Conditional events: each can occur once; no event invents a known real-world future date.
 e('heatwave','一场持续更久的热浪','高温影响了用电、户外工作和你的日常。气候模型提示压力在积累，你要如何应对？','气候',[
 c('adapt','扩大避暑与弹性工作支持',4,{health:2,happiness:2,energy:-1},{heatAdapt:true},[-1,2,2,0],'提高适应能力，不能消除已经增加的 CO₂。'),c('clean','趁机推进低碳改造',5,{energy:2},{cleanGrid:true},[1,1,2,2],'作用主要在后续年份。'),c('ration','临时限电，优先保障基本服务',0,{energy:2,prosperity:-1},{},[-1,1,1,0],'缓解眼前压力。')],s=>s.world.co2>435),
 e('blackout','计算中心之外的停电','高峰负荷逼近系统边界。你的一次部署安排，会影响资源怎样分配。','能源',[
 c('grid','追加储能与需求侧调度',5,{energy:5},{efficiency:true},[0,1,2,2],'改善后续供电余量。'),c('industry','优先保障高产出项目',0,{prosperity:2,happiness:-2,equity:-1},{},[1,-2,-1,-1],'公众需要承担更多不便。'),c('homes','先保障居民和公共服务',0,{happiness:2,trust:1,prosperity:-1},{},[-1,2,1,0],'接受部分短期产出损失。')],s=>s.metrics.energy<40),
 e('bubble','热潮之后，融资突然收紧','一些项目没有兑现回报，投资者开始撤出。技术能力仍在，但资源与预期变了。','经济',[
 c('protect','保护基本研究与转岗支持',5,{employment:2,trust:1},{recessionYears:2},[-1,2,2,2],'接下来两年仍有衰退压力。'),c('merge','推动重组，允许失败退出',0,{fiscal:2,employment:-2},{recessionYears:2},[1,-1,-2,0],'保留资源，也接受失业调整。'),c('spend','用刺激计划争取缓冲',7,{prosperity:3},{recessionYears:1},[1,1,2,-1],'缓冲不等于消除错误投资。')],s=>s.scenario==='waves'&&s.elapsed>5),
 e('data-leak','你的服务名单出现在公开网络','一次数据泄露让信任受到冲击。你必须回应，而不是只更新一条隐私声明。','信任',[
 c('open','公开调查并承担修复成本',4,{trust:2,safety:2},{oversight:true},[-1,2,3,1],'提高可追责性。'),c('vendor','要求供应商赔偿并修补',1,{safety:1,trust:-1},{},[1,-1,-2,0],'修复较快，但独立性争议仍在。'),c('pause','暂停有争议的接口',0,{safety:2,prosperity:-1},{limitedDeployment:true},[-2,1,1,0],'保留基本服务，缩减风险暴露。')],s=>s.flags.medicalPilot||s.flags.educationOpen),
 e('bias','同一个系统，不同的人得到了不同答案','审查发现，系统的表现因语言、地区和群体而异。平均准确率掩盖了差距。','公平',[
 c('audit','公开分组评估并补足数据',3,{equity:3,safety:2},{},[-1,3,2,1],'改进需要持续验证。'),c('local','允许本地团队调整工具',1,{equity:1,prosperity:1},{localTools:true},[1,1,-1,0],'灵活性更高，标准可能分散。'),c('restrict','先限制高风险用途',0,{safety:2,prosperity:-1},{},[-2,1,1,0],'接受部分服务延迟。')],s=>s.world.aiAdoption>30),
 e('burnout','你已经很久没有真正休息','连续推进项目之后，你发现注意力和耐心都在下降。你的身体也属于这个计划的资源。','个人',[
 c('rest','给自己一个恢复期',0,{},{rested:true},[-1,1,0,1],'压力 -15，健康 +5，声誉 -1。'),c('delegate','建立授权与复核机制',2,{trust:1},{delegation:true},[-1,1,2,2],'压力 -8，知识 +1；团队协作更可持续。'),c('push','撑过这一轮关键交付',0,{prosperity:2},{overwork:true},[2,-1,-1,-1],'声誉 +3，健康 -4，压力 +8。')],s=>s.player.stress>65),
 e('career','一份离开公共计划的邀请','你的经验开始有了市场价值。新的职位意味着更多自由，也意味着不同的责任。','职业',[
 c('public','留在公共计划，公开利益申报',0,{trust:2},{publicCareer:true},[-1,2,2,1],'声誉 +2，继续承担公共协调。'),c('lab','兼任开放研究顾问',1,{prosperity:1},{researchNetwork:true},[2,0,0,2],'知识 +3，压力 +3。'),c('consult','转为独立顾问，保留公开边界',0,{prosperity:1,trust:-1},{consultant:true},[1,-1,-2,0],'角色变为独立 AI 顾问，声誉 +1。')],s=>s.player.reputation>55&&s.elapsed>8),
 e('screening','一份异常的健康检查结果','检查提示需要复核。选择医疗工具，并不意味着可以跳过专业判断。','健康',[
 c('review','接受进一步检查并调整日程',0,{},{checkup:true},[-1,1,0,1],'健康 +6，压力 -4。'),c('ai','使用辅助评估，再交由专业复核',1,{health:1},{checkup:true},[1,0,1,0],'健康 +4，知识 +1。'),c('delay','暂缓，先完成手头工作',0,{prosperity:1},{},[1,-1,-1,-1],'健康 -3，压力 +3。')],s=>s.player.age>=45),
 e('open-source','开放模型，还是封闭服务？','新的能力已经可以稳定提供。你要决定知识与服务怎样流通。','开放',[
 c('open','资助可审查的开放研究',4,{equity:2,safety:1},{openResearch:true},[1,2,3,2],'降低一部分入门门槛。'),c('market','允许多家供应商竞争',0,{prosperity:2},{marketModels:true},[2,-1,-2,0],'提高商业迭代速度。'),c('controlled','只开放经过验证的用途',1,{safety:2},{},[-2,0,1,1],'覆盖较慢，边界更清楚。')],s=>s.tech.science>20),
 e('agents','代理 AI 开始替人签单','便利背后，责任边界仍不清楚。一次错误的自动操作可能造成真实损失。','代理系统',[
 c('confirm','高风险操作必须由人确认',2,{safety:3,trust:1},{agentControls:true},[-2,1,2,1],'降低部分自动化便利。'),c('insurance','建立供应商责任与赔付',1,{safety:1,prosperity:1},{},[1,0,-1,0],'保留效率，但不能避免所有错误。'),c('sandbox','先限定在低风险场景',0,{safety:2,prosperity:-1},{},[-1,1,1,1],'暂缓高风险扩张。')],s=>s.world.aiAdoption>35),
 e('water','算力与水，开始争夺同一片土地','计算设施需要冷却，也需要与当地生活共享资源。你必须把隐藏的成本放进账本。','资源',[
 c('efficiency','投资节水冷却与资源审查',4,{energy:2,trust:1},{efficiency:true},[0,1,2,2],'改善资源效率，不代表零环境成本。'),c('move','迁往资源更充足的区域',2,{prosperity:1,equity:-1},{},[1,-1,-1,0],'压力被重新分配。'),c('limit','限制新增容量，先满足生活',0,{happiness:2,prosperity:-1},{},[-1,2,1,0],'保留眼前的公共资源。')],s=>s.world.aiAdoption>45),
 e('food','农田需要的不只是一套模型','气候与投入品成本影响收成。农业 AI 可以改善调度，但设备、土地和知识同样重要。','农业',[
 c('public','面向小规模生产者提供服务',4,{equity:2,happiness:1},{foodServices:true},[0,2,2,1],'减少一部分获取服务的差距。'),c('enterprise','支持高效率农业企业',0,{prosperity:2,equity:-1},{},[2,-1,-2,1],'产出改善可能更集中。'),c('local','先支持本地知识与低成本工具',1,{happiness:1,trust:1},{},[-1,1,1,0],'适应各地的实际条件。')],s=>s.world.heat>25),
 e('science-leap','一个看似接近成功的实验','你的团队提出了新的材料或能源路线。前景很大，但复现与工程验证仍然缺失。','科学',[
 c('verify','先公开验证，再争取规模化',4,{safety:1},{researchNetwork:true},[1,0,2,3],'知识 +4，远期能力逐步积累。'),c('race','争取先发优势，扩大试验',6,{prosperity:3,safety:-1},{frontierLegacy:true},[3,-1,-1,1],'声誉 +2，承担试验不确定性。'),c('wait','保留小团队，不扩大承诺',0,{fiscal:1},{},[-1,0,0,1],'不保证不会错过时机。')],s=>s.tech.science>30),
 e('carbon-removal','从减少新增，到尝试移除','减排没有让 CO₂ 浓度立即下降。研究团队希望尝试工程化移除，你要决定是否投入。','气候技术',[
 c('pilot','启动可核验的小规模示范',8,{},{carbonCapture:true},[2,1,2,3],'后续年份新增有限移除量，不能抵消全部排放。','成本和规模上限仍然存在。',{tech:['science',25]}),c('reduce','把有限资源优先用于节能减排',3,{energy:2},{efficiency:true,cleanGrid:true},[0,1,2,1],'先降低新增排放。'),c('watch','跟踪公开证据，暂不投入',0,{fiscal:1},{},[-1,0,0,1],'不把未验证的承诺算作已实现。')],s=>s.world.co2>455),
 e('inequality','增长曲线很好看，生活却分成两半','技术红利集中在少数行业，公众对机会的不平等越来越敏感。','分配',[
 c('fund','建立公共技术红利基金',5,{equity:4,happiness:2,prosperity:-1},{redistribute:true},[-1,3,3,1],'把一部分收益转入公共服务。'),c('competition','扩大竞争和新企业入口',1,{prosperity:2,equity:1},{},[2,0,-2,1],'新的机会需要时间产生。'),c('review','先公开收入与服务差距',0,{trust:1},{openDashboard:true},[-1,1,1,0],'信息公开本身不能消除差距。')],s=>s.metrics.equity<46),
 e('aging','照护岗位的缺口，比想象中更大','老龄人口占比上升。机器人、家庭与专业照护都不能独自承担全部需要。','老龄化',[
 c('services','扩大专业照护与辅助服务',5,{health:2,happiness:2},{careServices:true},[0,3,3,1],'减轻照护压力。'),c('robot','在有人工监督下试用照护设备',3,{health:1,prosperity:1},{careRobots:true},[2,0,0,1],'需要维护与责任边界。',{tech:['robotics',25]}),c('community','支持社区互助与现有服务',0,{happiness:1,trust:1},{communityCare:true},[-1,1,1,0],'覆盖受本地资源影响。')],s=>s.world.olderShare>14),
 e('newborns','出生人数的下降，开始改变学校','不只生育意愿，人口年龄结构也影响每年的出生人数。你要重新安排教育与家庭服务。','出生率',[
 c('family','降低养育与工作的冲突',5,{happiness:2,equity:1},{familySupport:true},[0,3,2,2],'缓慢影响未来生育率；不会立刻逆转人口结构。'),c('adapt','把资源转向终身学习与照护',2,{employment:2,health:1},{educationOpen:true,careServices:true},[0,2,1,1],'适应年龄结构的变化。'),c('choice','保留个人选择，调整现有布局',0,{trust:1},{populationAdapt:true},[-1,1,0,0],'不设置个人生育目标。')],s=>s.world.fertility<2.14),
 e('cyber','一份跨行业安全预警','越来越多的生活依赖联网系统。你要决定如何分配稀缺的安全与恢复能力。','安全',[
 c('resilience','投入备份、演练与独立验证',4,{safety:4},{resilience:true},[-1,1,2,2],'提高系统恢复能力。'),c('industry','由行业自建联防网络',1,{safety:2},{},[1,0,-1,0],'覆盖依赖行业的能力。'),c('critical','优先保护关键公共服务',0,{safety:1,prosperity:-1},{},[-1,2,1,0],'缩小需要立即保障的范围。')],s=>s.world.aiAdoption>50),
 e('medicine-leap','新疗法通过了第一道门槛','一种治疗方向出现了令人振奋的结果。你要决定如何继续验证与分配服务。','医学突破',[
 c('access','验证与可及性一起安排',5,{health:3,happiness:2},{medicalPublic:true},[1,3,3,2],'改善仍会受服务覆盖限制。'),c('commercial','允许商业渠道先扩大',1,{health:2,prosperity:2,equity:-1},{},[2,-1,-2,0],'更快提供服务，但价格仍是门槛。'),c('evidence','继续收集证据，不急着扩展',0,{safety:2},{},[-2,0,1,2],'接受回报延迟。')],s=>s.tech.medicine>38&&s.flags.medicalPilot),
 e('trust-vote','一场公开听证会，问到了你自己','公众想知道，你如何评价这些年的成果与代价。你不能只展示最好看的那条曲线。','声誉',[
 c('full','公开完整成绩和未完成承诺',0,{trust:3},{openDashboard:true},[-1,2,2,1],'声誉 +2，接受公众质询。'),c('results','重点展示产出与技术突破',0,{prosperity:1,trust:-1},{},[2,-1,-1,0],'声誉 +1，争议可能继续。'),c('external','委托独立机构评估',3,{safety:2,trust:2},{oversight:true},[-1,1,2,2],'声誉 +1，放弃部分解释权。')],s=>s.elapsed>15),
 e('chips','关键设备交付突然延迟','先进计算依赖复杂供应链。技术路线之外，你还需要考虑可替代性与实施节奏。','供应链',[
 c('diversify','投资替代方案与开放标准',4,{energy:1,safety:1},{researchNetwork:true},[1,0,2,2],'减少单一依赖。'),c('priority','把设备集中到最有回报的项目',0,{prosperity:2,equity:-1},{},[1,-1,-1,0],'接受其他项目排队。'),c('optimize','先优化现有系统',1,{energy:2},{efficiency:true},[-1,0,0,1],'用效率换取时间。')],s=>s.world.aiAdoption>25),
 e('work-dispute','“被替代”的，到底是任务还是人？','自动化开始改变工作组织。你要决定，谁有权参与讨论新的岗位边界。','就业',[
 c('voice','让劳动者参与部署与转岗安排',4,{employment:3,trust:2},{robotSupport:true},[0,3,2,1],'提高适应机会，不保证岗位数量不变。'),c('market','让市场快速调整岗位',0,{prosperity:3,employment:-2},{},[2,-2,-2,0],'接受更大的短期调整。'),c('slow','放缓扩张，先观察影响',0,{employment:1,prosperity:-1},{limitedDeployment:true},[-2,1,1,1],'给适应留时间。')],s=>s.flags.robotDeployed),
 e('retirement','你准备怎样进入下一段生涯？','你已走过大半个职业生涯。角色可以改变，之前建立的系统仍然会继续影响世界。','人生阶段',[
 c('advisor','转为长期顾问，交出日常管理',0,{trust:1},{advisor:true},[-1,1,1,2],'压力 -10，角色变为 AI 长期顾问。'),c('stay','继续负责，建立接班机制',2,{safety:1},{delegation:true},[1,0,1,1],'声誉 +2，压力 +3。'),c('teach','转向研究与公共教育',0,{equity:1},{teaching:true},[0,2,2,2],'知识 +3，角色变为 AI 公共研究者。')],s=>s.player.age>=65),
 e('meaning','你想把空出来的时间用在哪里？','当效率提高，留给自己的时间却不一定自动增加。你开始重新安排生活的重心。','个人生活',[
 c('health','多留一些时间给身体与日常',0,{},{personalBalance:true},[-1,1,0,1],'健康 +3，压力 -6。'),c('learn','继续研究一个没来得及回答的问题',0,{},{personalResearch:true},[2,0,0,2],'知识 +4，压力 +2。'),c('public','把经验整理成公开课程',1,{trust:1,equity:1},{teaching:true},[0,2,2,2],'声誉 +2，留下可复用的知识。')],s=>s.elapsed>20),
 e('fraud','伪造的声音，真实的损失','生成内容的成本下降，也让身份验证和公众判断变得更难。','社会',[
 c('verify','建设低门槛的验证与申诉服务',3,{safety:2,trust:2},{},[-1,2,2,1],'减少一部分信息不对称。'),c('tools','鼓励平台改进验证工具',1,{safety:1,prosperity:1},{},[1,0,-1,0],'依赖平台的执行能力。'),c('education','先开展公众辨识教育',0,{employment:1,trust:1},{},[-1,1,1,1],'教育有效，但不是完整防线。')],s=>s.world.aiAdoption>40),
 e('public-transport','城市变聪明，出行会更轻松吗？','新的调度系统能减少等待与能耗，但也会收集更多行程数据。','城市',[
 c('public','以公共交通与最少数据为中心',4,{happiness:2,energy:1},{efficiency:true},[0,2,2,1],'改善日常体验与资源效率。'),c('private','优先发展个性化出行服务',0,{prosperity:2,equity:-1},{},[2,-1,-2,0],'服务可能首先覆盖高支付能力人群。'),c('pilot','限定区域，公开评估再扩展',1,{safety:1,trust:1},{},[-1,1,1,1],'接受较慢覆盖。')],s=>s.elapsed>10),
 e('reproducibility','最好看的结果，别人复现不了','一项被广泛宣传的研究遇到了复现问题。你要决定是否修正路线。','研究伦理',[
 c('correct','公开修正，资助复现',3,{safety:2,trust:2},{openResearch:true},[-1,1,2,2],'知识 +2，承认先前的不确定性。'),c('internal','先内部复核，暂缓宣传',1,{safety:1},{},[-1,0,0,1],'减少即时争议，但需要后续公开。'),c('continue','保留当前路线，等待更多结果',0,{prosperity:1,trust:-2},{},[2,-1,-1,0],'承担路线判断失误的风险。')],s=>s.tech.science>22),
 e('fertility-care','照护政策的效果比口号慢','你开始看到服务进入家庭，但出生人数没有立即反弹。年龄结构与个人选择不会因为一项政策而消失。','人口 · 后续',[
 c('persist','继续验证，按实际负担改进',3,{happiness:2},{familySupport:true},[-1,2,2,2],'维持长期支持，不承诺具体出生人数。'),c('services','把重点放在照护与生活质量',2,{health:1,happiness:1},{careServices:true},[0,2,1,1],'改善生活不以生育数量作为唯一目标。'),c('stop','暂停扩大，先评估财政承受力',0,{fiscal:2},{},[-1,0,0,1],'保留已建立的基础服务。')],s=>s.flags.familySupport&&s.elapsed>28),
 e('gdp-debate','总量翻倍之后，人均生活呢？','增长里程碑到了。你想提醒团队，人均收入、分配和幸福也需要一起被看见。','增长',[
 c('share','把一部分增长转为公共红利',5,{happiness:3,equity:2},{redistribute:true},[-1,3,3,1],'继续提高普遍可及性。'),c('next','把目标转向下一轮产业突破',2,{prosperity:3},{growthPriority:true},[2,-1,-1,2],'追求更大的生产能力。'),c('measure','公开总量、人均与幸福三份成绩',0,{trust:2},{openDashboard:true},[0,1,1,1],'不把一个数字当成全部成果。')],s=>s.world.gdp>=145),
 e('climate-bill','气候账单开始进入公共预算','高温、基础设施维护与保险成本累积。你面对的是过去排放留下的压力。','气候 · 财政',[
 c('adapt','把适应能力纳入长期预算',5,{health:2,happiness:1},{heatAdapt:true},[-1,2,2,2],'提高韧性，不能抹去历史排放。'),c('cut','优先减排与效率改造',4,{energy:2},{cleanGrid:true,efficiency:true},[1,1,2,2],'主要影响未来的排放增长。'),c('prioritize','只保障最关键的公共设施',0,{fiscal:1,happiness:-1},{},[-1,0,0,0],'资源有限，覆盖会更窄。')],s=>s.world.co2>475),
 e('budget','承诺走到了付账的时候','财政余量下降，项目仍需要维护。你要决定哪些承诺可以继续。','财政',[
 c('contribute','要求高收益部门增加公共分担',0,{fiscal:6,equity:1,prosperity:-2},{redistribute:true},[-1,2,3,1],'增加财政，牺牲部分短期产出。'),c('trim','停止新增承诺，保住基础服务',0,{fiscal:5,happiness:-1},{austerity:true},[-1,0,0,1],'后续增长可能稍慢。'),c('reorder','公开排序，延后低优先级项目',0,{fiscal:3,trust:1},{},[-1,1,1,1],'接受一些回报推迟。')],s=>s.metrics.fiscal<18)
];
EVENTS.push({...EVENTS.find(e=>e.id==='clinic-scale'),id:'clinic-revisit',title:'医疗推广，需要一次新的评估',condition:s=>s.elapsed>22&&s.flags.medicalPilot&&!s.flags.medicalDeployed});
EVENTS.push({...EVENTS.find(e=>e.id==='robot-scale'),id:'robot-revisit',title:'你重新打开了自动化推广方案',condition:s=>s.elapsed>26&&(s.flags.robotPilot||s.flags.robotPrepared)&&!s.flags.robotDeployed});
export const BY_ID=Object.fromEntries(EVENTS.map(x=>[x.id,x]));
export const ACTIONS=[
 {id:'storage',name:'储能示范项目',cost:5,delay:3,requires:{tech:['energy',17]},desc:'三年后验收；成功后改善能源余量与低碳供给。',effects:{energy:4},flag:'cleanGrid',chance:.8},
 {id:'clinic',name:'主动发起医疗试点',cost:4,delay:2,requires:{tech:['medicine',16]},desc:'两年后验收；成功后打开临床推广事件入口。',effects:{health:2},flag:'medicalPilot',chance:.78},
 {id:'learn',name:'进修与方法训练',cost:0,delay:1,requires:{},desc:'一年后知识增加；投入精力，不能保证立即升职。',effects:{},personal:{knowledge:4,stress:2},chance:1},
 {id:'audit',name:'委托一次独立审计',cost:3,delay:1,requires:{},desc:'一年后完成；提高安全与可追责性。',effects:{safety:3,trust:1},flag:'oversight',chance:1},
 {id:'family',name:'社区托育与照护试点',cost:5,delay:3,requires:{},desc:'三年后验收；改善生活，逐渐影响生育与照护压力。',effects:{happiness:2,health:1},flag:'familySupport',chance:.85},
 {id:'carbon',name:'可核验碳移除示范',cost:8,delay:5,requires:{tech:['science',25]},desc:'五年后验收；有限移除量，不会让浓度瞬间归零。',effects:{},flag:'carbonCapture',chance:.65}
];
export const SMALL_MOMENTS=[
 '你在散步时想通了一个会议里一直没解开的细节。','你把一段冗长的审批拆成可以逐步验证的流程。','你发现团队对“成功”的定义并不完全一样。','你认真读完了一封不同意你方案的公开来信。','你给研究记录补上失败的试验，而不只留下漂亮结果。','你准时下班，为自己做了一顿简单的晚饭。','一次公开课的提问让你重新解释最熟悉的概念。','你把看不懂的专业术语重新写成普通人能理解的话。','你取消了一次没有明确目标的会议。','你在旧书页里找到几年前留下的一句话。','你学会了一种新的验证方法，决定先在小范围试用。','你给系统故障留下了复盘记录，而不是删掉尴尬的部分。','你重新整理日程，留出不被消息打断的时间。','你拒绝把一个演示结果称为已经普及的能力。','你听了一场与自己立场不同的讲座。','你把一个计划延后，先补上它依赖的基础设施。','一次空闲的周末，让你发现生活不只有下一次交付。','你把工作中的一个失误写进了团队培训材料。','你开始用更少的工具，完成真正重要的事。','你在一份预算里看见了原本被忽视的维护成本。','你给长期合作的团队寄出了一份公开致谢。','你发现最难回答的问题，常常不是技术问题。','你为一个仍不确定的想法保留了一小笔试验空间。','你重新读了一份旧预测，有些趋势成立，有些没有。','你把已经不再适用的规则从流程中删掉。','你认真地说了一次“现在还不知道”。','你给团队留出阅读与复现的时间。','你在自己的笔记中写下：速度也是一种需要解释的选择。','你把一份模型输出交给人工复核，发现了重要的遗漏。','你想起刚接任时的自己，对未来的想象已经变得具体。','你决定暂时关掉通知，睡一个完整的觉。','你把一次争论整理成可以继续验证的三个问题。'
];
