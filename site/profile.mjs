import {METRICS,INITIAL} from './engine.mjs?v=3';
export const AXES=[
 {left:'探索',right:'守护',letters:['E','S'],desc:'遇到未知时，你更愿意先尝试，还是先验证？'},
 {left:'普惠',right:'效率',letters:['H','F'],desc:'面对资源分配，你更关注覆盖，还是集中产出？'},
 {left:'公共',right:'市场',letters:['P','M'],desc:'你更多依靠公共制度，还是市场与个人？'},
 {left:'长期',right:'当下',letters:['L','A'],desc:'你更愿意为远期打基础，还是先解决眼前？'}
];
export const TYPES={
 EHPL:{name:'人类之光',tag:'让未来，尽可能属于每个人。',desc:'你愿意探索未知，也愿意为普遍的机会付出长期成本。技术在你手里，更像一项公共承诺。',strength:'把突破与可及性放在同一张规划图里。',blind:'容易低估持续服务与维护的账单。',color:'#385b48',symbol:'sun'},
 EHPA:{name:'生活发明家',tag:'先让今天的生活，好一点点。',desc:'你热衷新工具，也希望它们尽快改善普通人的日常。你喜欢能看得见、摸得着的改变。',strength:'能把复杂技术转成眼前可用的服务。',blind:'快速铺开后，别忘了补上维护和验证。',color:'#687a48',symbol:'sun'},
 EHML:{name:'温柔先行者',tag:'用新的路，带更多人向前。',desc:'你看好创新的活力，也在意机会能否流向普通人。你愿意用时间等待新的连接出现。',strength:'善于为创新寻找更宽的社会入口。',blind:'市场不会自动照顾到每一个后来者。',color:'#65765b',symbol:'orbit'},
 EHMA:{name:'理想实干派',tag:'把大愿望，拆成今天能做的事。',desc:'你愿意用灵活的合作推进改变，也愿意关注被变化影响的人。你更信任实践中的反馈。',strength:'善于在现实条件里寻找可行的改善。',blind:'局部的好结果，可能掩盖长期的结构问题。',color:'#97714d',symbol:'orbit'},
 EFPL:{name:'星际筑梦师',tag:'今天的地基，是明天的发射台。',desc:'你把公共资源集中投向前沿与基础建设，期待长周期的技术红利。未来在你的图纸上总是很大。',strength:'能把研究、能源与规模化能力连成路线。',blind:'宏大项目之外，也有人需要当下的支持。',color:'#4d6375',symbol:'tower'},
 EFPA:{name:'基建狂魔',tag:'先把世界的底座升级。',desc:'你倾向集中资源解决生产和实施问题。比起漫长争论，你更想让系统先运行起来。',strength:'推进能力强，能抓住落地的关键瓶颈。',blind:'建成不等于用好，别漏掉使用者和维护者。',color:'#70764e',symbol:'tower'},
 EFML:{name:'未来押注者',tag:'愿意等，也愿意承担未知。',desc:'你相信前沿探索和市场竞争会打开新的空间。你能承受回报延迟，也接受路线存在风险。',strength:'敢于为还未成熟的机会投入耐心。',blind:'长期愿景不能代替中途的验证和止损。',color:'#66617d',symbol:'orbit'},
 EFMA:{name:'大聪明',tag:'办法很多，后手也要很多。',desc:'你擅长算账、抓机会和快速推进。能用更少公共资源办成的事，你倾向先让它发生。',strength:'面对变化反应快，能找到效率提升的切口。',blind:'局部最优的聪明，可能留下需要别人收拾的成本。',color:'#a16d42',symbol:'spark'},
 SHPL:{name:'大治理家',tag:'把系统建好，让普通人安心。',desc:'你把规则、公共服务和长期能力放在重要位置。你相信未来需要有人维护，而不只是有人发明。',strength:'能在可靠性与普遍保障之间建立制度。',blind:'稳妥的程序有时会让机会等得太久。',color:'#36554f',symbol:'tower'},
 SHPA:{name:'民生守护者',tag:'先接住眼前的人。',desc:'你关心服务是否可靠，也在意当下有没有人掉下去。你偏爱能直接减轻生活压力的方案。',strength:'善于识别普通人的现实负担。',blind:'解决眼前难处之后，还需要新的发展空间。',color:'#6f7954',symbol:'sun'},
 SHML:{name:'长跑陪伴者',tag:'给人时间，也给世界时间。',desc:'你不急着替所有人选择道路，更愿意用稳定边界和耐心支持个人、行业慢慢调整。',strength:'尊重差异，能容纳多种转型速度。',blind:'等待不应变成让弱势群体独自承担时间成本。',color:'#697d76',symbol:'orbit'},
 SHMA:{name:'务实调停者',tag:'少一点失控，多一点余地。',desc:'你倾向在现有条件下协商改变，兼顾个体处境与现实承受能力。你不轻易许下过大的承诺。',strength:'能在分歧里找到暂时可行的平衡。',blind:'折中能解决今天，也可能推迟更深的改革。',color:'#977e61',symbol:'spark'},
 SFPL:{name:'系统架构师',tag:'真正的效率，来自可靠的系统。',desc:'你偏好验证、标准和长期基础。你希望资源投入形成可以持续运行的体系。',strength:'善于发现系统之间的依赖与脆弱点。',blind:'别把难以量化的人的需要排除在设计之外。',color:'#536878',symbol:'tower'},
 SFPA:{name:'精算掌舵人',tag:'每一份承诺，都要算得过来。',desc:'你注重可控、成本和短期实施，不轻易让公共项目超出承受能力。你更喜欢清晰的边界。',strength:'能让有限资源保持一定的回旋余地。',blind:'谨慎的账本也可能漏算错失机会的代价。',color:'#77765f',symbol:'spark'},
 SFML:{name:'冷静观察者',tag:'不追每一阵风，等值得走的路。',desc:'你愿意保持边界，让研究和市场慢慢证明自己。比起热潮，你更在意长期的可行性。',strength:'不容易被短期兴奋带偏路线。',blind:'过久观望可能让准备和行动一起迟到。',color:'#687383',symbol:'orbit'},
 SFMA:{name:'边界谈判家',tag:'把风险讲清，把选择留住。',desc:'你关注现实成本和责任边界，倾向用市场与协商消化变化。你希望每次行动都有可退的路。',strength:'擅长把抽象风险变成可讨论的条件。',blind:'边界清楚之后，也要有人负责边界之外的人。',color:'#847260',symbol:'spark'}
};
export function profile(s){
 const axes=AXES.map((axis,i)=>{const score=(s.orientation[i]-(i===3?s.decisions.length*.6:0))/Math.max(1,s.elapsed/12);const value=Math.max(5,Math.min(95,Math.round(50+score*1.25)));return {...axis,value,balanced:Math.abs(value-50)<8,dominant:value>=50?axis.left:axis.right,letter:axis.letters[value>=50?0:1]};});
 const code=axes.map(a=>a.letter).join(''),type=TYPES[code];
 const gains=METRICS.map(([key,label])=>({key,label,value:Math.round(s.metrics[key]),delta:Math.round(s.metrics[key]-INITIAL[key])}));
 const strengths=[...gains].sort((a,b)=>b.delta-a.delta).slice(0,3),weakness=[...gains].sort((a,b)=>a.value-b.value)[0];
 const achievements=[];
 if(s.flags.medicalDeployed)achievements.push(s.flags.medicalPublic?'你推动医疗 AI 进入公共服务':'你推动医疗 AI 进入付费应用');
 if(s.flags.robotDeployed)achievements.push('你把机器人从试点推进到行业部署');
 if(s.flags.educationOpen)achievements.push('你为更多家庭打开公共学习资源');
 if(s.flags.cleanGrid)achievements.push('你把低碳供给写进技术落地方案');
 if(s.flags.oversight)achievements.push('你留下了可追责的监督与维护机制');
 if(s.flags.familySupport)achievements.push('你为育儿与照护建立支持入口');
 if(s.world.gdp>=200)achievements.push('你见证了本局实际 GDP 总量翻倍');
 if(s.metrics.happiness>=70)achievements.push('你见证人民幸福度越过 70 的里程碑');
 if(!achievements.length)achievements.push('你走完五十年，把成果与代价交给后来者');
 const cost=s.metrics.fiscal<20?'公共承诺留下了财政压力。':s.metrics.equity<45?'增长没有自动变成均等的机会。':s.metrics.happiness<50?'漂亮的产出曲线没有接住全部生活感受。':s.metrics.energy<35?'能源余量仍然紧张。':s.metrics.employment<45?'转型机会仍落后于岗位变化。':`下一任仍需关注${weakness.label}，目前为 ${weakness.value}。`;
 return {code,...type,axes,strengths,gains,achievements,cost};
}
