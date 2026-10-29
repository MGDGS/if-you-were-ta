export const START=2026,END=2076;
export const SOURCES=[
 {title:'NOAA GML · 全球 CO₂ 年均浓度',url:'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_gl.txt',value:'2025：425.62 ppm；2024：422.79 ppm',note:'2026-10-09 数据版本；2025 为最近一年，仍可能修订。全球地面网络，非单一观测站。'},
 {title:'联合国 · World Population Prospects 2024',url:'https://www.un.org/development/desa/pd/data/',value:'2024：人口约 82 亿；总和生育率约 2.25',note:'人口和生育率作为起点。游戏使用简化年龄队列推演，不冒充联合国中方案逐年预测。'},
 {title:'Global Carbon Budget 2025',url:'https://essd.copernicus.org/articles/18/3211/2026/',value:'2025：人为 CO₂ 排放约 42.2 GtCO₂/年（初步估计）',note:'包含化石燃料和土地利用变化；与大气浓度是不同量。论文 2026 年发表。'}
];
export const OBSERVED_CO2=[{year:2023,value:419.35},{year:2024,value:422.79},{year:2025,value:425.62}];
export const rnd=(seed,y,c)=>{let a=(seed^Math.imul(y+1,2654435761)^Math.imul(c+1,1597334677))>>>0;a^=a>>>16;a=Math.imul(a,2246822507);a^=a>>>13;return(a>>>0)/4294967296;};
const limit=(v,a,b)=>Math.max(a,Math.min(b,v));
// All cohort proportions, age-specific mortality and fertility timing below are game calibration assumptions.
function initialCohorts(){const a=Array(100).fill(0);for(let age=0;age<65;age++)a[age]=8.2e9*(age<15?.25/15:.65/50);const sum=Array.from({length:35},(_,i)=>Math.exp(-i/12)).reduce((a,b)=>a+b,0);for(let age=65;age<100;age++)a[age]=8.2e9*.10*Math.exp(-(age-65)/12)/sum;return a;}
function demographics(w,healthGain=0,care=0){
 const a=w.cohorts,next=Array(100).fill(0);const women=a.slice(15,50).reduce((a,b)=>a+b,0)*.5;
 const births=women*w.fertility/35*1.10;
 let deaths=0;for(let age=0;age<100;age++){let mortality=age===0?.025:age<15?.0005:age<50?.0015:age<65?.008:age<80?.035:.14;mortality*=limit(1-healthGain*.004,.62,1.15);const dead=age===99?a[age]:a[age]*mortality;deaths+=dead;if(age<99)next[age+1]=a[age]-dead;}
 next[0]=births;const population=next.reduce((a,b)=>a+b,0);
 const birthRate=births/w.population*1000,deathRate=deaths/w.population*1000;
 return {cohorts:next,population,births,deaths,birthRate,deathRate,olderShare:next.slice(65).reduce((a,b)=>a+b,0)/population*100};
}
export function initialWorld(){let w={year:2024,population:8.2e9,cohorts:initialCohorts(),fertility:2.25};for(let year=2025;year<=START;year++){w={...w,...demographics(w),year};w.fertility-=.008;}
 const emissions=42.2;return {...w,basePopulation:w.population,gdp:100,gdpPerCapita:100,gdpGrowth:0,co2:425.62+emissions*.45/7.81,co2Delta:emissions*.45/7.81,emissions,clean:24,aiAdoption:12,heat:16,removals:0};}
export function nextWorld(w,state,baseline=false){
 const year=w.year+1,flags=baseline?{}:state.flags,tech=baseline?{medicine:12,science:12,robotics:12,education:12,energy:12,safety:12}:state.tech;
 const y=year-START,cfg={steady:{demand:.007,progress:.008},fast:{demand:.012,progress:.011},waves:{demand:.009,progress:.009}}[state.scenario];
 const adoption=limit(w.aiAdoption+(baseline?.8:1+tech.science*.018+(flags.robotDeployed?1.3:0)+(flags.computeRush?.4:0)),0,96);
 const decarb=baseline?.005:Math.min(.065,.004+tech.energy*.00013+(flags.cleanGrid?.012:0)+(flags.efficiency?.005:0));
 const rebound=baseline?0:(adoption/100)*.007+(flags.robotDeployed?.002:0)+(flags.computeRush?.002:0);
 const emissions=limit(w.emissions*(1+cfg.demand+rebound-decarb),1,85);
 const airborne=limit(.45+.025*Math.sin(y*.45)+.0006*y,.38,.57); // scenario assumption; not an observed constant
 const removals=baseline?0:Math.min(3,(flags.carbonCapture?.25:0)+tech.science*.002*(flags.carbonCapture?1:0));
 const co2Delta=(emissions*airborne-removals)/7.81,co2=w.co2+co2Delta;
 const fertility=limit(w.fertility-.008-(baseline?0:Math.max(0,adoption-40)*.000035)+(flags.familySupport?.006:0)+(flags.careServices?.002:0),1.25,2.6);
 const growth=limit((state.scenario==='fast'?.033:state.scenario==='waves'?.026+.03*Math.sin(y*.55):.024)+(baseline?0:adoption*.00005+(flags.robotDeployed?.005:0)+(flags.growthPriority?.004:0))-(flags.recessionYears>0?.045:0)-(flags.austerity?.006:0)-w.heat*.00008,-.06,.075);
 const gdp=w.gdp*(1+growth);
 const demo=demographics({...w,fertility},baseline?y*.08:Math.max(0,state.metrics.health-55)+(flags.medicalDeployed?5:0));
 return {...w,...demo,year,gdp,gdpGrowth:growth*100,gdpPerCapita:gdp/(demo.population/w.basePopulation),fertility,co2,co2Delta,emissions,removals,clean:limit(w.clean+(baseline?.4:.3+tech.energy*.012+(flags.cleanGrid?.65:0)),0,95),aiAdoption:adoption,heat:limit(16+(co2-428)*.45+(rnd(state.seed,y,21)-.5)*6,8,95)};
}
export function worldView(w){return {year:w.year,gdp:w.gdp,gdpPerCapita:w.gdpPerCapita,gdpGrowth:w.gdpGrowth,co2:w.co2,co2Delta:w.co2Delta,emissions:w.emissions,population:w.population,fertility:w.fertility,birthRate:w.birthRate,deathRate:w.deathRate,births:w.births,deaths:w.deaths,olderShare:w.olderShare,aiAdoption:w.aiAdoption,clean:w.clean,heat:w.heat};}
export function annualNews(s){
 const w=s.world,p=s.player,y=s.elapsed,opts=[
 ['科技','你的团队把一个复杂流程拆成了可以验证的小步骤。'],['生活','你关掉工作消息，给自己留了一个没有会议的傍晚。'],['社会','公共讨论开始从“AI 能不能做”转向“谁为结果负责”。'],['工作','一次跨领域讨论让你意识到，落地问题往往藏在研究边界之外。'],['生活','你整理旧笔记，发现有些曾经笃定的判断已经改变。'],['能源',`年度电力规划更新，低碳供给情景指数升至 ${w.clean.toFixed(1)}%。`],['教育','新的学习工具上线，验证答案的能力仍然重要。'],['产业',`AI 应用情景覆盖达到 ${w.aiAdoption.toFixed(1)}%，行业之间的差距仍然存在。`],['家庭','你把原本用于加班的一段时间留给亲友。'],['研究','团队复现了一项公开成果，先前的乐观估计被修正。'],['生活','你重新安排日程，发现注意力也需要像预算一样分配。'],['治理','一份系统审计报告公开，争议没有消失，但讨论变得具体。'],['医疗','基层服务开始讨论新的辅助工具，以及人工复核的责任。'],['人口',`本年度模型出生约 ${(w.births/1e6).toFixed(1)} 百万人，死亡约 ${(w.deaths/1e6).toFixed(1)} 百万人。`],['气候',`本年 CO₂ 浓度较上年增加 ${w.co2Delta.toFixed(2)} ppm；减排首先改变增长速度。`],['工作',`你在${p.role}岗位上又经历了一年，履历里的选择开始积累成路线。`]
 ];const ia=Math.floor(rnd(s.seed,y,40)*opts.length);let ib=(Math.floor(rnd(s.seed,y,41)*opts.length)+3)%opts.length;if(ib===ia)ib=(ib+1)%opts.length;return [opts[ia],opts[ib]];
}
