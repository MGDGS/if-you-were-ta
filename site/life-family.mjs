import {rnd} from './world.mjs?v=3';
const cap=x=>Math.max(0,Math.min(100,Math.round(x*10)/10));
export const partnered=f=>['dating','married','partnered'].includes(f.status);
export const committed=f=>['married','partnered'].includes(f.status);
export const initialFamily=seed=>({status:'single',preference:'open',partner:['阿宁','小林','阿言','小夏'][Math.floor(rnd(seed,0,1200)*4)],closeness:0,since:-1,committedAt:-1,childWish:'undecided',revisit:0,children:[],plan:null,history:[],careSupport:false});
const c=(id,label,text,effects={},familyOp)=>({id,label,text,effects,familyOp});
const e=(id,title,text,choices)=>({id,title,text,choices,condition:()=>true});
export const FAMILY_EVENTS=[
 e('love-meet','有个人，你开始想多聊几句','你和{partner}最近经常碰面。没有命中注定的配乐，只是聊天时不用刻意找话题，分开后又会想起对方。',[
 c('date','约个散步，慢慢了解','不额外花钱。开始相处，亲密度 58；以后每年约会与相处开销 0.24 万。',{mood:5},'date'),c('friend','先做朋友，别急着定义','关系 +4，暂不开始恋爱。三年后可以再遇到机会，也可以主动改变打算。',{relations:4},'later'),c('single','现在更想一个人过','心情 +4。不会被自动安排结婚或生育；以后想法变了，也可以自己再聊打算。',{mood:4},'solo')]),
 e('love-commit','“以后，我们要不要一起过？”','你和{partner}相处了一段时间。聊到未来时，话题终于从下周吃什么，变成住在哪里、钱怎么花，以及要不要结婚。',[
 c('marry','结婚，简单办就好','花 0.3 万登记、吃顿饭，亲密度 +10。共同生活的额外支出，你每年承担 0.36 万，不计入伴侣工资。',{cash:-.3,mood:5},'marry'),c('partner','认真在一起，但先不结婚','不额外花钱，亲密度 +8。共同生活每年你多承担 0.36 万；没有婚姻登记，也能讨论养育孩子。',{mood:4},'partner'),c('wait','还想再相处一阵','不急着做决定，亲密度 +2。三年后再谈，也可以主动聊。',{},'commit-later')]),
 e('love-register','住在一起这些年，要不要登记？','你和{partner}已经一起过了几年。再聊起婚姻，考虑的不只是仪式，还有各自对承诺和生活安排的想法。',[
 c('yes','这次，我们去登记','花 0.1 万办理和纪念，亲密度 +10；共同生活预算不额外重复增加。',{cash:-.1,mood:4},'marry'),c('no','保持现在的关系，也认真承担','不额外花钱，亲密度 +4，不自动安排婚姻登记。',{},'stay-partner'),c('talk','先聊清楚彼此在意什么','亲密度 +6、压力 −2，暂不登记。',{stress:-2},'talk')]),
 e('love-wedding','婚礼这件事，想怎么留个纪念','登记以后，亲友开始问什么时候摆酒。{partner}想听听你的打算。你们已经是家人，不需要靠账单来证明。',[
 c('party','请亲友一起热闹一回','花 2 万，关系 +8、心情 +6；不代表比简单办更相爱。',{cash:-2,relations:8,mood:6},'celebrate'),c('trip','留个周末，出去走走','花 0.4 万，心情 +6、压力 −4，亲密度 +5。',{cash:-.4,mood:6,stress:-4},'celebrate'),c('meal','在家做顿饭，认真拍张合照','不额外花钱，心情 +4、亲密度 +5。',{mood:4},'celebrate')]),
 e('love-children','“我们想不想养一个孩子？”','你和{partner}第一次认真谈起孩子。想要陪伴，也担心钱和时间；不想要孩子，也不代表这段关系缺了什么。',[
 c('yes','想，但先把钱和照护安排讲清楚','进入养育计划，之后再选准备生育还是申请收养。现在不会立刻有孩子。',{},'want-child'),c('later','先不，给生活多留一点余地','至少三年内不再自动追问。亲密度 +3，之后仍可主动重谈。',{stress:-3},'child-later'),c('no','不打算要，认真过两个人的生活','亲密度 +3。以后不会自动触发生育计划，除非你主动改变打算。',{mood:4},'child-no')]),
 e('love-plan','迎接孩子之前，先把现实摊开','你们把预算和作息写在纸上：谁来照顾、工作怎么办、手头的钱够不够。这是这局的家庭计划，不是现实生育或收养流程。',[
 {...c('birth','准备生育，迎接新成员','花 0.5 万准备。游戏中一年后迎来孩子，另有 1.2 万初期支出；0—5 岁时，你每年另承担 1.8 万养育费。',{cash:-.5},'plan-birth'),familyRequires:'birth'},
 {...c('adopt','申请收养，等待评估','花 0.3 万准备。两年后按游戏情景完成评估，70% 获批，届时另付 1 万安置费，孩子初始 3 岁；不保证一定通过。',{cash:-.3},'plan-adopt'),familyRequires:'adopt'},
 c('wait','我们还没准备好，先缓一缓','不新增费用，不安排孩子。三年后可以再谈。',{stress:-3},'child-later')]),
 e('love-care','孩子睡了，工作群又响了','家里多了一个小人之后，时间好像被切得更碎。照顾不是只有你一个人的责任，但你得决定自己拿出多少时间和钱。',[
 c('share','把轮流照护的时间谈明白','压力 −5、亲密度 +8、亲子关系 +8；年薪少 0.6 万，换一点弹性时间。',{salary:-.6,stress:-5},'care-share'),c('help','找可信的人帮忙照护','亲密度 +5、压力 −4；孩子未满 6 岁时，你每年额外承担 0.6 万照护费。',{stress:-4},'care-help'),c('work','先拼收入，空下来再补陪伴','年薪 +0.6 万、压力 +6；亲密度 −6、亲子关系 −7。以后可以用陪伴重心慢慢修复。',{salary:.6,stress:6},'care-work')]),
 e('love-school','孩子第一次背上书包','校门口人很多。你才发现，自己关心的不只是成绩，还有这个小人能不能适应一个新世界。',[
 c('support','先陪TA适应，学习慢慢来','花 0.3 万买用品、安排接送，亲子关系 +10。',{cash:-.3,mood:4},'child-support'),c('classes','先报几门课，别落在后面','花 1.2 万，压力 +4、亲子关系 −4。花得更多，不保证孩子更开心。',{cash:-1.2,stress:4},'child-push'),c('listen','听TA说学校里的事','不额外花钱，亲子关系 +7、压力 −2。',{stress:-2},'child-listen')]),
 e('love-teen','“你能不能先听我讲完？”','孩子开始有不想告诉你的事。你想关心，对方却觉得你每句话都是安排。关系不是小时候那样，抱一下就会好。',[
 c('listen','先别讲道理，听完再说','亲子关系 +14、压力 −3。',{stress:-3},'teen-listen'),c('gift','买点东西，试着缓和一下','花 0.3 万，亲子关系 +3。礼物能表达心意，替代不了谈话。',{cash:-.3},'teen-gift'),c('control','我有经验，还是该按我说的来','亲子关系 −12、压力 +4。',{stress:4},'teen-control')]),
 e('love-grown','孩子成年了，路要怎么选','TA拿来了几个不同的打算。学什么、去哪儿、怎么承担开销，都是人生第一次自己做的大决定。',[
 c('help','量力支持，也留出试错空间','花 1.2 万，亲子关系 +10、心情 +4。',{cash:-1.2,mood:4},'grown-help'),c('budget','把预算摊开，一起定承担办法','花 0.3 万，亲子关系 +7。坦白手头有限，不等于不支持。',{cash:-.3},'grown-budget'),c('respect','听完打算，尊重TA自己选','不额外花钱，亲子关系 +5、压力 −3。',{stress:-3},'grown-respect')]),
 e('love-leave','家里安静了一点','孩子有了自己的住处和生活。你一边觉得轻松，一边又习惯性多买了一份菜。22 岁起，游戏中的固定养育费停止。',[
 c('gift','有余力的话，帮一笔安家费','花 2 万，亲子关系 +8。',{cash:-2},'leave-help'),c('visit','约好偶尔吃饭，各过各的日子','不额外花钱，心情 +5、亲子关系 +6。',{mood:5},'leave-visit'),c('worry','总想多问几句，忍不住替TA担心','压力 +5、亲子关系 −3。',{stress:5},'leave-worry')]),
 e('love-friction','明明住在一起，却像很久没说过话','最近你和{partner}说得最多的是账单和待办。谁都觉得自己很累，谁也没被好好听见。要怎么处理，不能只靠时间拖过去。',[
 c('talk','认真谈一次，重新分工','亲密度 +16、压力 −4。不自动辞职，也不假装所有问题都解决了。',{stress:-4},'repair'),c('help','找咨询支持，一起梳理','花 0.2 万，亲密度 +22、压力 −6。',{cash:-.2,stress:-6},'repair-help'),{...c('separate','谈清楚分开，之后各自生活','花 0.3 万搬家和整理，不足记为欠款，关系结束。有孩子时继续承担自己的养育费；不抹去过去，也不自动分走个人存款。',{cash:-.3,mood:-5,stress:-4},'separate'),allowDebt:true}]),
 e('love-childfree','又一个周末，只属于你们自己','你们没有孩子，也没有等着补齐什么。朋友有朋友的忙碌，你和{partner}在商量，接下来的时间想怎么过。',[
 c('trip','攒点时间，一起出去走走','花 0.4 万，亲密度 +8、心情 +7。',{cash:-.4,mood:7},'two-time'),c('home','把普通的一天过舒服','不额外花钱，亲密度 +6、健康 +3。',{health:3},'two-home'),c('friends','约朋友来吃顿饭','花 0.1 万，关系 +7、亲密度 +4。',{cash:-.1,relations:7},'two-friends')]),
 e('love-later','这么多年了，还想一起去哪儿','你和{partner}翻着旧照片，有些地方没去成，有些争执已经记不清了。未来的计划不必很大，也能认真商量。',[
 c('travel','安排一次量力而行的旅行','花 0.8 万，亲密度 +8、心情 +8。',{cash:-.8,mood:8},'two-time'),c('walk','从每天一起走走开始','不额外花钱，健康 +4、亲密度 +6。',{health:4},'two-home'),c('help','一起参与社区的事','关系 +8、亲密度 +4。',{relations:8},'two-friends')]),
 e('love-solo','一个人生活，也要有自己的后援','你开始认真整理紧急联系人、体检安排，还有那些愿意互相搭把手的人。独处是自己的选择，支持也可以来自很多地方。',[
 c('friends','把值得信赖的朋友联系起来','关系 +9、心情 +5。',{relations:9,mood:5},'solo-support'),c('rest','把身体和生活安排稳一点','花 0.2 万，健康 +6、压力 −5。',{cash:-.2,health:6,stress:-5},'solo-support'),c('open','也许可以给新的关系留个位置','不立刻开始恋爱。重新对相处开放，之后会再有机会。',{mood:3},'reopen')]),
 e('love-talk','抽空，聊聊我们接下来的日子','最近的开销、相处的时间，还有彼此没说出口的事。你和{partner}决定先把手机放到一边。',[
 c('listen','今天先认真听，不急着安排','亲密度 +8、压力 −3。',{stress:-3},'talk'),c('date','留一个不用赶时间的约会','花 0.12 万，亲密度 +11、心情 +4。',{cash:-.12,mood:4},'date-time'),c('plan','重谈养育计划，也尊重彼此的想法','亲密度 +3。下一次会讨论是否要孩子；没有作出新选择前，不会改变原来的决定。',{},'rethink-child')]),
 e('love-adopt-retry','申请没有通过，先把自己照顾好','这次收养评估没通过。失落可以被承认，下一步也不用马上决定。这里的结果是游戏情景，不代表现实收养资格。',[
 {...c('retry','以后再申请，先继续准备','两年后再次评估，准备费 0.3 万；仍有 70% 的游戏通过率，不保证成功。',{cash:-.3},'plan-adopt'),familyRequires:'adopt'},c('later','先不继续，给彼此一点时间','暂停计划，三年后可以再谈。',{stress:-3},'child-later'),c('no','重新决定，不安排孩子了','不再自动申请。关系和生活依然可以认真继续。',{mood:3},'child-no')]),
];
export const FAMILY_IDS=new Set(FAMILY_EVENTS.map(e=>e.id));
export function familyEvent(s,manual=false){const f=s.family;if(!f||s.prison||s.phase!=='live')return null;const age=s.player.age,seen=id=>s.decisions.some(d=>d.eventId===id),open=partnered(f),t=s.elapsed;
 if(f.plan)return manual&&open?'love-talk':null;
 if(open&&f.closeness<35&&t-f.since>=2&&(manual||!s.flags.familyRepairYear||t-s.flags.familyRepairYear>=4))return 'love-friction';
 if(s.flags.adoptFailed&&!seen('love-adopt-retry'))return 'love-adopt-retry';
 const child=f.children[0],ca=child?t-child.born:-1;
 if(child&&ca<6&&!seen('love-care'))return 'love-care';if(child&&ca>=6&&!seen('love-school'))return 'love-school';if(child&&ca>=13&&!seen('love-teen'))return 'love-teen';if(child&&ca>=18&&!seen('love-grown'))return 'love-grown';if(child&&ca>=22&&!seen('love-leave'))return 'love-leave';
 if(!open){if(f.preference!=='solo'&&t>=f.revisit&&(manual||t>=2))return 'love-meet';if((manual||age>=35)&&!seen('love-solo'))return 'love-solo';return manual?'love-solo':null;}
 if(f.status==='partnered'&&(manual||t-f.committedAt>=4&&!seen('love-register')))return 'love-register';
 if(f.status==='dating'&&t-f.since>=2&&t>=f.revisit)return 'love-commit';
 if(f.status==='married'&&t-f.committedAt>=1&&!seen('love-wedding'))return 'love-wedding';
 if(committed(f)&&f.childWish==='yes'&&!f.children.length)return 'love-plan';
 if(committed(f)&&!f.children.length&&f.childWish!=='no'&&age>=26&&age<56&&t-f.committedAt>=1&&t>=f.revisit&&(f.childWish==='undecided'||f.childWish==='later'))return 'love-children';
 if(committed(f)&&f.childWish==='no'&&t-f.committedAt>=8&&!seen('love-childfree'))return 'love-childfree';
 if(committed(f)&&age>=60&&t-f.committedAt>=15&&!seen('love-later'))return 'love-later';
 return manual?'love-talk':null;
}
export function familyBudget(s){const f=s.family;if(!f)return 0;let cost=partnered(f)?(committed(f)?.36:.24):0;for(const c of f.children){const age=s.elapsed-c.born;cost+=age<6?1.8:age<18?1.2:age<22?.8:0;if(age<6&&f.careSupport)cost+=.6;}return Math.round(cost*100)/100;}
export function familySummary(s){const f=s.family;if(!f)return '旧版生活档案';const state={single:f.preference==='solo'?'一个人，按自己的节奏':'单身，慢慢来',dating:`和${f.partner}相处中`,married:`已婚 · ${f.partner}`,partnered:`一起生活 · ${f.partner}`,separated:'已分开，各自生活'}[f.status];return state+(f.children.length?` · ${f.children.length} 个孩子`:f.plan?' · 正在准备迎接孩子':f.childWish==='no'?' · 不安排孩子':'');}
export function familyContext(e,s){if(!s.family)return e;const f=s.family;let text=e.text.replaceAll('{partner}',f.partner);if(e.id==='love-care'&&!partnered(f))text='孩子还小，日常照护需要有人承担。你和另一位家长分别安排自己的生活，也需要把费用和时间谈清楚。';const choices=e.choices.map(c=>({...c}));if(e.id==='love-talk'&&!f.children.length&&s.player.age>=56)choices[2]={...choices[2],label:'把两个人的生活安排稳一点',text:'亲密度 +6、健康 +3。不再新增养育计划。',effects:{health:3},familyOp:'two-home'};if(e.id==='love-talk'&&f.children.length)choices[2]={...choices[2],label:'一起想想，孩子和我们各自需要什么',text:'亲密度 +3、亲子关系 +4。不新增孩子，也不改变已有费用。',familyOp:'family-time'};if(e.id==='love-talk'&&f.plan)choices[2]={...choices[2],label:'先暂停尚未开始的养育准备',text:'共同决定暂停准备，不新增孩子。三年后可以再讨论。',familyOp:'child-later'};return {...e,text,choices};}
export function familyRequirement(s,c){if(!c.familyRequires)return '';if(!s.family)return '这局保留旧规则，完整感情线需要新开局';if(s.family.children.length)return '本局展开一名孩子的成长线，不再新增养育计划';if(s.family.plan)return '已经有一个计划在进行';if(c.familyRequires==='birth'&&s.player.age>=45)return '本局 45 岁起不再安排新增生育情节，可考虑收养或不育';if(c.familyRequires==='adopt'&&s.player.age>=56)return '本局 56 岁起不再安排新增收养情节';return '';}
export function applyFamilyChoice(s,c,h){if(!s.family||!c.familyOp)return;const f=s.family,op=c.familyOp,child=f.children[0];const close=v=>{if(partnered(f))f.closeness=cap(f.closeness+v);};const bond=v=>{if(child)child.bond=cap(child.bond+v);};
 if(op==='date'){if(f.status==='separated'){f.partner=['阿宁','小林','阿言','小夏'].find(x=>x!==f.partner);}f.status='dating';f.preference='open';f.since=s.elapsed;f.closeness=58;f.revisit=s.elapsed+2;}
 if(op==='later'){f.preference='later';f.revisit=s.elapsed+3;}
 if(op==='solo'){f.preference='solo';f.revisit=s.elapsed+3;}
 if(op==='marry'||op==='partner'){f.status=op==='marry'?'married':'partnered';f.committedAt=s.elapsed;close(op==='marry'?10:8);f.revisit=s.elapsed+1;h.milestone(s,'family-commit',op==='marry'?'你们决定，成为家人':'没有登记，也认真决定一起生活',`${f.partner}和你，把以后写进了日常。选择要共同承担，关系也仍要慢慢维护。`);}
 if(op==='stay-partner')close(4);
 if(op==='commit-later'){close(2);f.revisit=s.elapsed+3;}
 if(op==='celebrate')close(5);
 if(op==='want-child')f.childWish='yes';
 if(op==='child-later'){f.childWish='later';f.plan=null;f.revisit=s.elapsed+3;close(3);}
 if(op==='child-no'){f.childWish='no';f.plan=null;close(3);s.flags.adoptFailed=false;}
 if(op==='plan-birth'||op==='plan-adopt'){f.childWish='yes';f.plan={kind:op==='plan-birth'?'birth':'adopt',due:s.elapsed+(op==='plan-birth'?1:2),started:s.elapsed};s.flags.adoptFailed=false;}
 if(op==='care-share'){close(8);bond(8);}if(op==='care-help'){f.careSupport=true;close(5);}if(op==='care-work'){close(-6);bond(-7);}
 const bonds={'child-support':10,'child-push':-4,'child-listen':7,'teen-listen':14,'teen-gift':3,'teen-control':-12,'grown-help':10,'grown-budget':7,'grown-respect':5,'leave-help':8,'leave-visit':6,'leave-worry':-3};if(bonds[op])bond(bonds[op]);
 if(op==='repair'||op==='repair-help'){close(op==='repair'?16:22);s.flags.familyRepairYear=s.elapsed;}
 if(op==='separate'){f.history.push({name:f.partner,ended:s.elapsed});f.status='separated';f.preference='later';f.closeness=0;f.revisit=s.elapsed+3;if(f.plan){f.plan=null;f.childWish='later';h.log(s,'family','迎接孩子的准备先暂停了','你们商量后，暂停了尚未完成的生育或收养准备。已经养育的孩子仍要共同照顾。');}h.milestone(s,'family-separate','分开之后，日子也要继续','关系结束不等于过去全部无效。有孩子时，你承担的固定养育支出会继续，孩子不会从人生里消失。');}
 const intimacy={'two-time':8,'two-home':6,'two-friends':4,talk:8,'date-time':11};if(intimacy[op])close(intimacy[op]);if(op==='family-time'){close(3);bond(4);}if(op==='reopen'){f.preference='open';f.revisit=s.elapsed+1;}if(op==='rethink-child'){close(3);if(!f.children.length&&!f.plan){f.childWish='undecided';f.revisit=s.elapsed+1;}}
}
export function advanceFamily(s,h){const f=s.family;if(!f)return;const active=partnered(f);if(active){f.closeness=cap(f.closeness+(s.focus==='people'?3:s.focus==='hustle'?-2.4:-.7)-(s.player.stress>70?1.2:0)-(s.player.debt>15?.6:0)-(s.prison?3.5:0));if(f.closeness>=72)h.change(s,'mood',.6);else if(f.closeness<35)h.change(s,'stress',1.2);}
 if(f.plan&&f.plan.due<=s.elapsed){const plan=f.plan;f.plan=null;if(plan.kind==='birth'||rnd(s.seed,plan.started,1210)<.7){const child={name:plan.kind==='birth'?'小禾':'小满',born:s.elapsed-(plan.kind==='adopt'?3:0),bond:65,source:plan.kind};f.children.push(child);h.spend(s,plan.kind==='birth'?1.2:1);h.change(s,'mood',8);h.change(s,'stress',8);h.change(s,'health',-3);h.milestone(s,'family-child','你家，多了一个小人',`${child.name}来到你的生活里。初期个人支出 ${plan.kind==='birth'?1.2:1} 万，固定养育费按年龄另记；开心和疲惫，都会变得很具体。`);}else{s.flags.adoptFailed=true;h.log(s,'family','这次申请，没有通过评估','准备的费用已经发生，计划暂停。你们可以再讨论是否重试，系统不会自动替你继续申请。');}}
 for(const child of f.children){child.bond=cap(child.bond+(s.focus==='people'?2:s.focus==='hustle'?-1.2:-.35));const age=s.elapsed-child.born;if(age===6&&f.careSupport)h.log(s,'family','照护支出，终于松了一点','孩子满 6 岁，游戏中的额外托育费停止，基础养育费也调整为每年 1.2 万。');if(age===22)h.log(s,'family','从这一年起，固定养育费不再扣了','孩子 22 岁了。是否额外支持，留给你在具体事情里决定；钱停了，联系没有因此结束。');}
}
export function validFamily(s){if(!(s.rules>=4))return !s.family;const f=s.family,num=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b;return (!s.lastLedger||num(s.lastLedger.familyCost,0,20))&&!!f&&['single','dating','married','partnered','separated'].includes(f.status)&&['open','later','solo'].includes(f.preference)&&typeof f.partner==='string'&&f.partner.length<=12&&num(f.closeness,0,100)&&Number.isInteger(f.since)&&num(f.since,-1,s.elapsed)&&Number.isInteger(f.committedAt)&&num(f.committedAt,-1,s.elapsed)&&['undecided','yes','later','no'].includes(f.childWish)&&Number.isInteger(f.revisit)&&num(f.revisit,0,60)&&typeof f.careSupport==='boolean'&&Array.isArray(f.children)&&f.children.length<=1&&f.children.every(c=>typeof c.name==='string'&&c.name.length<=12&&Number.isInteger(c.born)&&num(c.born,-3,s.elapsed)&&num(c.bond,0,100)&&['birth','adopt'].includes(c.source))&&Array.isArray(f.history)&&f.history.length<30&&f.history.every(x=>typeof x.name==='string'&&Number.isInteger(x.ended))&&(!f.plan||['birth','adopt'].includes(f.plan.kind)&&Number.isInteger(f.plan.due)&&num(f.plan.due,s.elapsed,52)&&Number.isInteger(f.plan.started)&&num(f.plan.started,0,s.elapsed));}
