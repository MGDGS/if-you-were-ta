import {ROLES,ROLE_EVENTS,ROLE_EVENT_IDS,careerEligible} from './life-careers.mjs?v=50';
import {FAMILY_EVENTS,FAMILY_IDS} from './life-family.mjs?v=50';
export const BACKGROUNDS={office:{name:'写字楼打工人',job:'普通职员',salary:9.6,cash:2.4,skill:35,intro:'月薪八千，存款两万四。老板说 AI 能提高效率，你想的是能不能少加班。'},hands:{name:'靠手艺吃饭',job:'维修技工',salary:8.4,cash:3.6,skill:44,intro:'工具箱比电脑值钱。机器人来没来不知道，房租下个月就要交。'},service:{name:'社区小职员',job:'社区办事员',salary:7.8,cash:2,skill:30,intro:'每天接电话、填表、跑腿。你还没有审批权，倒是有一堆没人想干的杂活。'}};
for(const [key,role] of Object.entries(ROLES))if(!BACKGROUNDS[key])BACKGROUNDS[key]=role;
export const FOCUSES={learn:{name:'学点新东西',desc:'每年花 0.36 万，技能 +5，压力 +2；以后找工作更容易。'},hustle:{name:'下班继续搞钱',desc:'每年多赚约 0.8—2 万，压力 +7，健康 −2。'},rest:{name:'身体要紧',desc:'每年花 0.24 万，健康 +3，压力 −6。'},people:{name:'陪陪身边的人',desc:'每年花 0.24 万，关系 +4，心情 +3，压力 −3。'},social:{name:'出去交际',desc:'每年花 0.36 万，关系 +6，口碑 +1，压力 +1；拓宽找工作的人脉。'}};
export const TAXES={honest:{name:'老老实实报',desc:'按游戏税表交税，没有申报风险。'},deduct:{name:'合法扣除，别交冤枉税',desc:'每年花 0.08 万整理材料，应税收入多扣 1.2 万。'},hide:{name:'少报一点，赌没事',desc:'只申报 65% 的应税收入。每年留下记录，未来可能被查，补税另加罚款。'}};
export const LABELS={cash:'存款',health:'健康',mood:'心情',stress:'压力',relations:'关系',reputation:'口碑',skill:'技能',salary:'年薪',power:'话语权',debt:'欠债'};
// Money is denominated in 10,000 fictional city currency units. Risk choices are narrative abstractions.
const c=(id,label,text,effects={},extra={})=>({id,label,text,effects,...extra});
const e=(id,title,text,choices,condition=()=>true)=>({id,title,text,choices,condition});
export const EVENTS=[
 e('first','老板：这个 AI，你研究一下','入职第一天，老板把一个 AI 工具甩进群：“以后大家效率翻倍。”翻倍的是工资，还是工作量？你决定先试试。',[
 c('learn','偷偷学会，给自己省点命','花点时间搞懂它，先把重复工作交出去。',{skill:9,stress:3},{flags:{ai:true}}),c('share','学会后也教教同事','自己多花点工夫，以后大家可以互相搭把手。',{skill:6,relations:7,reputation:3},{flags:{ai:true,helper:true}}),c('wait','先等等，别当小白鼠','工具可能会瞎编。你先用熟悉的办法，暂时也不添新压力。',{stress:-4,skill:1},{flags:{skeptic:true}})]),
 e('tax','第一次认真看工资条','工资条上的“应发”和“实发”，中间总少了一截。还有你的副业收入，也得选一种申报办法。这里用的是虚构城市税制。',[
 c('honest','该交多少交多少','后面每年自动按这个方式申报。',{}, {tax:'honest'}),c('deduct','把合法扣除算明白','需要每年花 800 元整理材料，能少算一些应税收入。',{}, {tax:'deduct'}),c('hide','少报一点，应该查不到吧？','眼前少交，账不会消失。留下的记录未来可能被翻出来。',{stress:3},{tax:'hide'})]),
 e('promotion','“这个小组，你来带？”','前任组长走了，老板问你接不接。年薪多 2.4 万，但项目签字也要你负责。不是当大官，只是终于有人开始找你办事。',[
 c('take','接，工资总算要涨了','成为小组负责人，拿到少量项目话语权。',{salary:2.4,power:1,stress:7},{flags:{manager:true},job:'小组负责人'}),c('expert','不带人，靠技术涨一点','年薪多 1.2 万，不接审批和采购。',{salary:1.2,skill:6},{flags:{expert:true}}),c('no','不了，准点下班更香','少一次涨薪机会，换一点自己的时间。',{mood:6,stress:-6})]),
 e('kickback','供应商说：一点心意','你手里刚好有一笔设备采购的推荐权。对方把“感谢费”说得很轻巧，金额却相当于你几个月工资。',[
 c('refuse','钱拿走，东西按规矩比','这单会慢一点，关系也可能冷下来。',{reputation:7,stress:2},{flags:{cleanDeal:true}}),c('take','收下，谁又能知道呢','存款 +4 万。留下利益输送记录，未来 4 年每年有 28% 的追查概率；不是查一次就安全。',{cash:4,stress:8,reputation:-4},{case:{kind:'corrupt',amount:4,years:4,chance:.28},flags:{corrupt:true}}),c('report','把这事留痕上报','当下麻烦些，也得罪对方。',{reputation:10,stress:6,relations:-3},{flags:{whistle:true}})],s=>s.player.power>0&&!s.flags.fired),
 e('loophole','“政策有个空子，要不要一起？”','熟人说，你的 AI 项目“包装一下”就能多拿补贴。你知道，申报里有几句话根本站不住脚。他只说：别人也这么干。',[
 c('no','不碰，睡个安稳觉','没赚到这笔钱，也不用惦记什么时候被问话。',{stress:-3}),c('apply','只申报自己真符合的部分','花 0.2 万整理材料，拿到 0.7 万真实补贴。',{cash:.5,skill:2},{cost:.2,gain:.7}),c('fake','先拿到钱再说','存款 +2.5 万；未来 3 年每年 24% 概率复核，查实要退钱、罚款，口碑也会掉。',{cash:2.5,stress:5},{case:{kind:'subsidy',amount:2.5,years:3,chance:.24},flags:{gray:true}})],s=>s.elapsed>=3),
 e('heat','热得像在空气炸锅里','连续高温。电费涨了，单位还想让大家照常跑外勤。社区开了避暑点，你得决定这周怎么过。',[
 c('cool','开空调、请假，保命要紧','花 0.3 万，健康 +3，压力 −4。',{cash:-.3,health:3,stress:-4}),c('work','硬撑着干，别扣我工资','省了这笔钱，健康 −8，心情 −5。',{health:-8,mood:-5}),c('help','去避暑点搭把手','花 0.1 万，关系 +8；你的保险不能替别人扇风。',{cash:-.1,relations:8,mood:4,health:-2},{flags:{volunteer:true}})]),
 e('flood','水，已经漫进楼道了','暴雨一夜没停。家具、电脑、通勤都可能受影响。先做眼前的选择，之后会结算损失；有效保险会赔一部分。',[
 c('leave','先撤，东西以后再说','花 0.4 万临时安置，基础财物损失 2 万；有保险时减赔。',{cash:-.4,stress:4},{disaster:{loss:2,health:0}}),c('save','回去抢电脑和家当','基础损失较少，但有 35% 概率受伤，健康 −18；受伤另付 1.2 万医疗费。',{stress:8},{disaster:{loss:.6,injury:.35}}),c('neighbors','和邻居一起撤离','花 0.2 万，基础财物损失 2.4 万，关系 +12。',{cash:-.2,relations:12,reputation:4},{disaster:{loss:2.4,health:0},flags:{rescuer:true}})]),
 e('storm','风把城市按了暂停键','台风停电三天，冰箱空了，工作也停了。公司通知“特殊时期共渡难关”，工资少了半个月。',[
 c('hotel','找个有电的地方住','花 0.6 万，少受点罪；基础财物损失 1 万可按保险赔付。',{cash:-.6,stress:-3},{disaster:{loss:1}}),c('stay','家里蹲，省一笔是一笔','健康 −4，心情 −6；基础损失 1.4 万。',{health:-4,mood:-6},{disaster:{loss:1.4}}),c('community','去社区帮忙，顺便领物资','关系 +9、压力 +3；基础损失 1.2 万。',{relations:9,stress:3},{disaster:{loss:1.2},flags:{volunteer:true}})]),
 e('quake','手机响了地震预警','震感过去后，房屋需要检查。生活突然变得很具体：住哪儿、钱够不够、家人好不好。',[
 c('safe','等检查通过再回去','临时住宿 0.5 万，基础损失 2.8 万；有效保险赔付。',{cash:-.5,stress:5},{disaster:{loss:2.8}}),c('friends','借住朋友家，帮大家联络','关系 +5，基础损失 2.8 万；欠下一份人情。',{relations:5,mood:2},{disaster:{loss:2.8}}),c('return','直接回去，不想再花钱','少花住宿费，但 25% 概率受伤，另付医疗费。',{stress:8},{disaster:{loss:2.8,injury:.25}})]),
 e('crisis','新闻说“短期波动”，群里在晒裁员名单','金融危机来了。市场要跌多久没人知道。你持有的投资已按本年行情结算，接下来怎么保住日子？',[
 c('buffer','接下来先求稳','把投入重心改为休息，省钱过冬；没有自动卖出投资。',{stress:-4},{focus:'rest',flags:{cautious:true}}),c('skill','趁有工作补补技能','花 0.6 万，技能 +12，压力 +3。',{cash:-.6,skill:12,stress:3}),c('gamble','我偏要在这时候赌一把','借 3 万，全投 AI 高风险资产。负债和资产同时增加；未来仍可能继续跌。',{stress:8},{borrowInvest:3,flags:{leveraged:true}})]),
 e('layoff','HR：我们聊十分钟','工牌还没摘，群聊先退了。补偿已经打进账户。你现在没有工资，房租倒是一天没少。',[
 c('search','简历投起来，先找饭碗','技能 +3、压力 +5。每年都能在“过日子”里找工作。',{skill:3,stress:5},{flags:{jobHunter:true}}),c('retrain','拿 0.8 万换个方向','技能 +15，口碑 +2。学完也不保证马上有工作。',{cash:-.8,skill:15,reputation:2}),c('pause','缓一个月，我真的累了','健康 +5，压力 −12，心情 +4。',{health:5,stress:-12,mood:4})]),
 e('sick','体检报告：建议进一步检查','你盯着那行小字，搜了一晚上。AI 的解释一会儿让你放心，一会儿又让你睡不着。',[
 c('doctor','去正规医院，别自己吓自己','花 0.8 万，健康 +14，压力 −5。',{cash:-.8,health:14,stress:-5}),c('cheap','先做基础检查','花 0.2 万，健康 +6，压力 −2。',{cash:-.2,health:6,stress:-2}),c('later','先忙完这阵再说','没花钱，健康 −10，压力 +6；拖着可能触发更严重的病。',{health:-10,stress:6},{flags:{delayedCare:true}})],s=>s.player.health<72||s.elapsed>10),
 e('hospital','这回真得住院了','医生建议治疗。你最先问的不是“多久能好”，是“要多少钱”。这里的医疗账单是游戏设定。',[
 c('full','正规治疗，钱不够也得治','治疗费 3 万，按保险减赔，不足部分记入借款；健康 +30。',{health:30,stress:4},{medical:3,allowDebt:true}),c('basic','先做能负担的治疗','治疗费 1 万，按保险减赔，不足部分借款；健康 +15。',{health:15,stress:3},{medical:1,allowDebt:true}),c('no','扛一扛，手头真的没钱','健康 −12，心情 −8。健康见底会提前结束人生。',{health:-12,mood:-8})],s=>s.player.health<45),
 e('lottery','便利店老板：来一张？','你只是来买水。收银台上的彩票倒是看起来很会许愿。',[
 c('one','两块钱，买个做梦机会','花 0.0002 万。1% 概率中 0.2 万，0.01% 概率中 100 万，否则没中；大奖按游戏税率扣 20%。',{cash:-.0002},{lottery:1}),c('many','花两百，今天手气应该行','花 0.02 万买一组。2% 概率中 0.5 万，0.1% 概率中 100 万；仍很可能白花。',{cash:-.02},{lottery:2}),c('water','我只要那瓶水','不买彩票，今天也能过。',{mood:1})],s=>s.elapsed>=2),
 e('friend-money','朋友：就借三万，月底还','聊天框里一句“只有你能帮我了”。你既怕伤感情，也怕最后钱和朋友都没了。',[
 c('lend','借，留好借据','借出 3 万，关系 +6；两年后 60% 概率归还 3.1 万，否则收不回来。',{cash:-3,relations:6},{delay:{years:2,chance:.6,gain:3.1,good:'朋友把钱还了，还请你吃了顿饭。',bad:'“月底还”变成了已读不回。',badEffects:{relations:-12,mood:-6}}}),c('small','最多帮五千，不要求你还','花 0.5 万，关系 +3，没有后续还款。',{cash:-.5,relations:3}),c('no','对不起，我也得过日子','关系 −4，保住自己的缓冲钱。',{relations:-4,stress:2})],s=>s.elapsed>4),
 e('startup','朋友拉你一起干票大的','“AI 风口，再不进就晚了。”他有 PPT，你有存款。两样东西里只有一样能交房租。',[
 c('full','辞职，拿五万干','投入 5 万，停止原工资；成为创业者，收入波动，两年后项目再结算。',{cash:-5,stress:12,power:1},{job:'小店创业者',business:true,delay:{years:2,chance:.4,gain:12,good:'项目活下来了，第一笔分红终于到账。',bad:'项目关门了。投入没有回来，至少你学会了看合同。',badEffects:{stress:8,skill:8}},flags:{founder:true}}),c('small','只出一万，别辞职','两年后 40% 概率拿回 2.5 万，否则本金归零。',{cash:-1,stress:3},{delay:{years:2,chance:.4,gain:2.5,good:'小项目分红到账，你特意核对了三遍。',bad:'朋友发来一段很长的复盘。钱没了。'}}),c('no','祝你成功，我先保住工资','压力 −2，不参与项目。',{stress:-2})],s=>s.elapsed>5&&s.player.age<58),
 e('family','家里说：今年能回来吗','你翻了翻余额，又看了看请假系统。原来“有空再说”已经说了很多年。',[
 c('go','回去，钱以后再赚','花 0.4 万，关系 +12、心情 +7。',{cash:-.4,relations:12,mood:7}),c('call','先认真打个长电话','关系 +5，压力 −3。',{relations:5,stress:-3}),c('busy','真走不开，下次一定','关系 −8，技能 +2。',{relations:-8,skill:2})]),
 e('ai-error','AI 把你的锅煮熟了','你直接交了 AI 生成的材料，里面一个编造的数据被客户当场指出。老板在群里只发了一个问号。',[
 c('own','认错，重做，自己复核','口碑 +3，技能 +5，压力 +5。',{reputation:3,skill:5,stress:5}),c('blame','说是软件的问题','压力 −2，口碑 −8；之后升职会更难。',{stress:-2,reputation:-8}),c('pay','私下花钱请人补救','花 0.6 万，口碑 +1，压力 −3。',{cash:-.6,reputation:1,stress:-3})],s=>s.flags.ai),
 e('automation','你擅长的活，现在软件也会了','新系统能做掉你一半的工作。有人说终于轻松了，也有人发现，下季度部门人数也要少一半。',[
 c('learn','把剩下一半练成看家本领','花 0.5 万，技能 +13，压力 +4。',{cash:-.5,skill:13,stress:4},{flags:{ai:true}}),c('human','去做更需要和人打交道的活','关系 +8，技能 +4，年薪 −0.6 万。',{relations:8,skill:4,salary:-.6}),c('hide','先装作很忙，撑过这个月','压力 +8，技能不变，裁员风险仍在。',{stress:8})],s=>s.elapsed>7&&s.employed),
 e('procurement','熟人托你“打个招呼”','你有一点签字权以后，饭局突然变多了。这次对方想让不合格的系统先过关，还给你留了一份“咨询费”。',[
 c('no','不签，出了事要担责任','口碑 +6，关系 −4。',{reputation:6,relations:-4}),c('yes','签了，先赚八万','存款 +8 万；未来 5 年每年 32% 概率被查，可能失业、罚款或服刑。',{cash:8,reputation:-8,stress:10},{case:{kind:'corrupt',amount:8,years:5,chance:.32},flags:{corrupt:true}}),c('fix','让他补齐真实测试再来','技能 +5，压力 +4，没有收钱。',{skill:5,stress:4})],s=>s.player.power>0&&s.elapsed>8&&s.employed),
 e('rent','房东：下个月要涨一点','“一点”是每月五百。房东说是跟市场走，你怀疑市场只会往你钱包里走。',[
 c('stay','不想折腾，续租','以后每年生活支出 +0.6 万，心情 +2。',{mood:2},{expense:.6}),c('move','换便宜点的房子','搬家花 0.3 万，以后每年生活支出 −0.4 万，压力 +4。',{cash:-.3,stress:4},{expense:-.4}),c('negotiate','带着周边报价聊聊','关系 +1，技能 +2，涨租取消。',{relations:1,skill:2})],s=>s.elapsed>3),
 e('burnout','醒了，但没完全活过来','周日晚上就开始心慌。手机一响，你先想到的是工作，不是消息。',[
 c('rest','请假，先把自己捡回来','花 0.3 万，健康 +9，压力 −20。',{cash:-.3,health:9,stress:-20}),c('help','找人聊聊，别一个人扛','花 0.1 万，关系 +5，压力 −12。',{cash:-.1,relations:5,stress:-12}),c('push','忍到发奖金就好了','年薪 +0.3 万，健康 −8，压力 +7。',{salary:.3,health:-8,stress:7})],s=>s.player.stress>68),
 e('public-job','社区缺个人，你来不来？','不是坐在顶层指挥世界，而是负责一个小项目：采购、报销、联系居民。钱不算多，手里的签字却有分量。',[
 c('take','去，起码做点看得见的事','换成年薪 10.8 万的社区项目工作，获得话语权。',{power:1,stress:4},{job:'社区项目专员',salarySet:10.8,employ:true,flags:{public:true}}),c('no','不了，我有自己的打算','心情 +2。',{mood:2}),c('volunteer','工作不换，周末去帮忙','关系 +8、压力 +3，不获得审批权。',{relations:8,stress:3},{flags:{volunteer:true}})],s=>s.elapsed>=5&&s.player.age<60&&!s.flags.public),
 e('raise','“今年涨薪名额不多”','老板说得好像名额是从牙缝里省出来的。你手里有成果，也可以继续安静做事。',[
 c('ask','拿着成果谈价格','年薪 +1.2 万，压力 +4。',{salary:1.2,stress:4}),c('jump','换个地方，试试能不能更好','花 0.3 万换工作，年薪 +2 万，关系 −4，压力 +7。',{cash:-.3,salary:2,relations:-4,stress:7}),c('time','钱少一点，换弹性时间','年薪 −0.3 万，健康 +4、压力 −8。',{salary:-.3,health:4,stress:-8})],s=>s.employed&&s.player.age<62),
 e('windfall','旧东西，居然有人出高价','你翻出一台旧游戏机。二手平台上的报价让你认真擦了擦灰。',[
 c('sell','卖，回忆不能付账单','存款 +0.8 万，心情 −1。',{cash:.8,mood:-1}),c('keep','留着，这是我的青春','心情 +6。',{mood:6}),c('gift','送给一个真的喜欢它的人','关系 +5、心情 +3。',{relations:5,mood:3})]),
 e('scam','有人承诺：AI 理财，稳赚','截图里全是盈利。群友比你的亲戚还关心你，唯一的条件是赶紧打钱。',[
 c('no','拉黑，稳赚轮不到我','技能 +2，没损失。',{skill:2}),c('try','投一万试试','花 1 万；这是骗局，一年后不会返款，还可能继续骚扰你。',{cash:-1,stress:3},{delay:{years:1,chance:0,gain:0,good:'',bad:'“理财顾问”失联了，群也没了。',badEffects:{mood:-8,stress:5}},flags:{scammed:true}}),c('warn','提醒群里其他人','口碑 +5、关系 +3。',{reputation:5,relations:3})],s=>s.elapsed>2),
 e('care','家里有人需要长期照护','排班表可以让 AI 来做，夜里起床照顾人这件事还得有人来。钱、时间、心情，很难全顾上。',[
 c('service','请人帮忙，自己也定期去','花 1.5 万，关系 +8，压力 +3。',{cash:-1.5,relations:8,stress:3}),c('self','自己多承担一些','健康 −5，压力 +10，关系 +12。',{health:-5,stress:10,relations:12}),c('share','和家人摊开讲，重新分工','花 0.3 万，关系 +6，压力 +2。',{cash:-.3,relations:6,stress:2})],s=>s.player.age>38),
 e('robot','一台家务机器人，顶三个月工资','广告说它能解放双手。评论区有人说真香，有人说只是多了一个需要照顾的祖宗。',[
 c('buy','买，时间也是钱','花 2.4 万，健康 +4、压力 −8，心情 +5。',{cash:-2.4,health:4,stress:-8,mood:5}),c('rent','先租一个月，别冲动','花 0.2 万，心情 +3、技能 +2。',{cash:-.2,mood:3,skill:2}),c('no','再等等，我的手还能用','存款不变，心情 +1。',{mood:1})],s=>s.elapsed>15),
 e('friend-success','老同学晒出了第二套房','你正蹲在便利店门口吃饭。朋友圈一刷新，手里的饭突然不香了。',[
 c('mute','屏蔽一下，先把饭吃完','心情 +5、压力 −5。',{mood:5,stress:-5}),c('learn','问问对方到底怎么做的','技能 +4、关系 +3。别人的结果不保证能复制。',{skill:4,relations:3}),c('compare','我也要更拼一点','压力 +8，年薪 +0.4 万。',{stress:8,salary:.4})]),
 e('privacy','公司想买你的身体数据','AI 医疗项目在招志愿者。钱会马上到账，数据出去以后，很难完全收回来。',[
 c('yes','签，先拿一万','存款 +1 万，健康 +2，压力 +3；三年后可能发生泄露。',{cash:1,health:2,stress:3},{delay:{years:3,chance:.7,gain:0,good:'这次没有发生数据事故。',bad:'你的健康数据出现在推销电话的话术里。',badEffects:{stress:9,mood:-6}}}),c('limited','只参加不出售原始数据的项目','花 0.1 万，健康 +4。',{cash:-.1,health:4}),c('no','不了，我不想把这个卖掉','心情 +2。',{mood:2})],s=>s.elapsed>8),
 e('housing','换个城市，能不能轻松一点','大城市的机会多，小城市的房租便宜。你终于开始认真算，留下来的代价。',[
 c('move','去生活成本低一点的地方','搬家花 0.8 万，以后生活支出每年少 1.2 万，年薪少 1 万，压力 −8。',{cash:-.8,salary:-1,stress:-8},{expense:-1.2,flags:{moved:true}}),c('stay','留下，我还想试试','技能 +5，压力 +4。',{skill:5,stress:4}),c('remote','争取远程，先试半年','花 0.2 万，生活支出每年少 0.4 万，技能 +3。',{cash:-.2,skill:3},{expense:-.4})],s=>s.elapsed>10),
 e('retire','社保页面弹出：快到你了','年轻时觉得退休是个很远的词。现在你开始认真看，每个月能到账多少。',[
 c('rest','退，换我过自己的日子','65 岁起领取游戏养老金，工作收入停止，压力 −12。',{stress:-12,mood:6},{flags:{retireEarlyMind:true}}),c('part','退休后接点零活','65 岁后每年多约 1.2 万副业收入，压力 +3。',{stress:3},{flags:{retireWork:true}}),c('help','以后多帮帮社区和家人','关系 +10、心情 +6。',{relations:10,mood:6},{flags:{elderHelper:true}})],s=>s.player.age>=60),
 e('meaning','忽然多出来一个没有安排的周末','没有群消息，没有待办。你站在窗边发了会儿呆：这些年赚到的钱，到底是为了什么？',[
 c('trip','带重要的人出去走走','花 1 万，关系 +10、心情 +10。',{cash:-1,relations:10,mood:10}),c('quiet','散步，认真过一天','不额外花钱，健康 +3、心情 +6。',{health:3,mood:6}),c('learn','学一个完全不为赚钱的东西','花 0.2 万，技能 +4、心情 +5。',{cash:-.2,skill:4,mood:5})],s=>s.elapsed>20),
 e('climate-tax','账单多了一项：城市防灾费','海绵道路、避暑点、排水工程要花钱。城市每年新增 0.12 万防灾附加费。你对这笔钱有自己的想法。',[
 c('accept','交，至少公示里写清楚用途','城市年度支出已统一生效，口碑 +2。',{reputation:2}),c('watch','交，但盯着项目公示','技能 +3、关系 +3。费用不会因你监督而自动取消。',{skill:3,relations:3},{flags:{watcher:true}}),c('anger','吐槽一晚上，该交还得交','压力 +3，心情 −2。',{stress:3,mood:-2})],s=>s.elapsed>12),
 e('second-chance','有人问你：愿不愿意重新来过','履历里有过难看的空白，也有认真干活留下的痕迹。一份不算体面的工作，愿意给你机会。',[
 c('take','去，先把日子接上','获得年薪 7.2 万的工作，口碑 +3，压力 −4。',{reputation:3,stress:-4},{employ:true,salarySet:7.2,job:'重新上班的人'}),c('learn','再学一年，再找更合适的','技能 +10，压力 +2，没有工资。',{skill:10,stress:2}),c('small','接些小活过渡','本年多 1.2 万收入，压力 +2，不算正式就业。',{cash:1.2,stress:2})],s=>!s.employed&&!s.prison&&s.player.age<65),
 e('temptation-again','“上次没事，这次也没事吧”','旧相识又找来了。你知道这笔钱是什么意思，也知道“没被发现”和“没有后果”不是一回事。',[
 c('stop','到这儿为止，不再接','压力 −3，不会抹去以前的记录。',{stress:-3}),c('again','再来一次，最后一次','存款 +6 万，再留一条未来 5 年每年 30% 概率追查的记录。',{cash:6,stress:9,reputation:-5},{case:{kind:'corrupt',amount:6,years:5,chance:.3}}),c('return','把以前收的钱退回去','花 2 万，口碑 +3；旧记录仍可能被查，未来处罚会酌情减轻。',{cash:-2,reputation:3},{flags:{returned:true}})],s=>s.flags.corrupt&&s.player.power>0&&s.employed),
 e('severance','公司说自愿降薪，群里没人自愿','行业订单少了。公司给了两份表：接受降薪，或者领补偿走人。',[
 c('stay','先保住岗位','年薪 −1.2 万，压力 +5。',{salary:-1.2,stress:5}),c('leave','拿补偿走人','获得 2 万补偿，停止工资；之后得重新找工作。',{cash:2,stress:3},{unemploy:true}),c('talk','和同事一起谈方案','年薪 −0.5 万，关系 +5，压力 +5。',{salary:-.5,relations:5,stress:5})],s=>s.employed&&s.elapsed>10&&s.player.age<62),
 e('inherited','一个旧存折，留到了你手上','家人整理东西时，交给你一个旧存折。钱不多，但你知道这不是天上掉下来的。',[
 c('save','先留着，做生活缓冲','存款 +3 万，心情 −2。',{cash:3,mood:-2}),c('family','一半留给家里','存款 +1.5 万，关系 +8。',{cash:1.5,relations:8}),c('give','交给更需要照护的家人','关系 +14，心情 +4。',{relations:14,mood:4})],s=>s.player.age>45),
 e('good-day','没什么大事的一天','工资按时到账，体检没大问题，喜欢的人回了消息。好像没有什么值得发朋友圈，又好像什么都有了。',[
 c('meal','请大家吃顿好的','花 0.12 万，关系 +6、心情 +7。',{cash:-.12,relations:6,mood:7}),c('walk','去河边走一走','健康 +3、心情 +5。',{health:3,mood:5}),c('save','记一笔账，今天也没白过','技能 +1，心情 +3。',{skill:1,mood:3})]),
 e('bankruptcy','账本上，已经撑不下去了','债务滚到了很难靠工资还清的程度。你可以申请游戏里的债务重整，也可以继续还。破产会失去投资，但人生不会因此删档。',[
 c('reset','申请重整，承认需要重来','投资清零，清偿可用存款，保留 0.8 万生活费，剩余债务免除；未来 5 年无法借款。',{stress:-15,reputation:-8},{bankrupt:true}),c('repay','卖出投资，能还多少先还','投资全部变现，尽量还债，未来继续承担 5% 年息。',{stress:5},{liquidate:true}),c('support','找债务援助，慢慢还','未来 5 年利息降到 2%；欠债不免除，关系 +2。',{relations:2,stress:-3},{flags:{debtHelp:true}})]),
];
export const BY_ID=Object.fromEntries(EVENTS.map(x=>[x.id,x]));
export const DAILY=[
 '你打开余额看了一眼，又关上。钱没有因为多看两眼变多。','AI 帮你写了三版邮件，你最后还是用了“好的，收到”。','楼下早餐涨了五毛，老板给你多夹了一点菜。','你发现自己已经很久没为工作以外的事认真开心过，于是买了个冰淇淋。','朋友圈里又有人宣布“抓住时代红利”。你决定先抓住最后一班地铁。','同事把 AI 叫作搭子，领导把它叫降本增效。你觉得这两个词不像一回事。','手机提示周均屏幕时间下降了。主要是你最近在补觉。','你拒绝了一场没必要的聚会，回家煮了一碗很认真的面。','小区里的机器人卡在门槛上，你和保安一起把它抬了过去。','你终于删掉了那个一直扣费、又从来不用的会员。','一个很久没联系的人发来“在吗”。你先点开了余额。','你把“下次再说”改成了“周六见”，心里松了一点。','你学会了让 AI 先列出处，而不是先相信它。','维修师傅说新机器修起来更贵了。你突然很想念旧东西。','今天没有暴富，也没有被裁。你觉得这句话有时候也值得庆祝。','你把一张快褪色的合照换了相框。','自动客服转了七次，最后还是一位真人帮你解决了问题。','你忍住没买那个“限时最后一天”的东西。第二天它又限时了。','你开始关心睡眠，而不只是关心银行卡里的数字。','群里聊了一晚上未来，你默默把明天的便当放进冰箱。','你试着跑了两公里，最后一公里主要靠走，也算完成。','有人问你的五年计划。你说，先把牙补了。','你突然想明白：存款是底气，但不是每天不开心的补偿。','城市里开了新的避暑点，你把地址发给了家人。'];
const FUTURE=[
 e('agent','你的新同事，不用睡觉','公司开始试用能连续处理任务的 AI 代理。它还会出错，但已经能接走不少流程。老板问谁愿意负责检查它。',[
 c('learn','学会检查它，别只会用它','花 0.5 万，技能 +14，压力 +5；更有机会保住工作。',{cash:-.5,skill:14,stress:5},{flags:{ai:true,verifier:true}}),c('people','去做客户真正需要人出面的事','关系 +10，技能 +5；你的出路不只写提示词。',{relations:10,skill:5},{flags:{humanWork:true}}),c('rest','我先把身体养好再说','健康 +5、压力 −8，技能不变；以后仍要面对岗位变化。',{health:5,stress:-8})]),
 e('energy-cheap','电终于便宜了，账单却没全消失','本局情景里，储能、电网和低碳发电跨过了成本门槛。这不是无限免费能源：供电更便宜，住房、照护和分配仍是难题。你的生活费每年少 0.6 万，城市也进入新一轮岗位调整。',[
 c('learn','学点和新设备有关的东西','花 0.4 万，技能 +10，压力 +3。',{cash:-.4,skill:10,stress:3},{flags:{energyTrade:true}}),c('life','把省下的时间还给生活','健康 +5、心情 +8，投入重心改成休息。',{health:5,mood:8},{focus:'rest'}),c('service','去试试机器不擅长的服务','关系 +10、技能 +5。',{relations:10,skill:5},{flags:{humanWork:true}})]),
 e('energy-tight','AI 越跑越快，电网却没跟上','本局没有出现便宜又稳定的供能突破。算力、制冷、交通都在争电，极端天气又增加了压力。生活费每年增加 0.3 万。',[
 c('adapt','学节能和维修，干点实在的','花 0.3 万，技能 +10，压力 +2。',{cash:-.3,skill:10,stress:2},{flags:{energyTrade:true}}),c('save','缩小生活半径，别把自己耗干','以后每年生活费少 0.4 万，心情 −2。',{mood:-2},{expense:-.4}),c('neighbors','和邻里一起做应急准备','花 0.2 万，关系 +9，健康 +2。',{cash:-.2,relations:9,health:2},{flags:{prepared:true}})]),
 e('dividend','机器赚的钱，能分到你吗','城市正在讨论自动化红利。投票结果由本局的社会情景决定，你只是其中一票；有便宜的机器，不等于人人都有它。',[
 c('public','支持基本生活补助','关系 +4、口碑 +3。之后是否通过，会在下一年的新闻里公布。',{relations:4,reputation:3}),c('owner','我更想攒钱买生产资产','技能 +4，压力 +2。只是明确方向，不会自动买入投资。',{skill:4,stress:2}),c('shorter','我想要更短的工时','心情 +5、压力 −3。收入之外，时间也是红利。',{mood:5,stress:-3})]),
 e('medicine-future','新疗法能多给你几年好身体吗','AI 辅助研发让一种治疗更容易找到合适的人，但长期效果仍有不确定性。医保没全覆盖，价钱很具体。',[
 c('pay','花钱做经过验证的治疗','花 4 万，健康 +22；游戏收益不代表现实医疗效果。',{cash:-4,health:22}),c('basic','用常规方案，把日常养好','花 0.6 万，健康 +10、压力 −4。',{cash:-.6,health:10,stress:-4}),c('wait','先等更多长期数据','健康不变，压力 +2。',{stress:2})],s=>s.elapsed>28),
 e('digital','“数字版的你”也能接单了','平台说，可以用你的经验训练一个分身。它能替你接一些小活，也可能以你的名义说错话。',[
 c('yes','开，但每周自己检查','花 0.5 万，今后退休后每年副业多 1.2 万，压力 +4。',{cash:-.5,skill:5,stress:4},{flags:{retireWork:true,digital:true}}),c('limited','只当工具，不让它代表我','花 0.1 万，技能 +4、压力 −2。',{cash:-.1,skill:4,stress:-2}),c('no','不了，我不想随时营业','心情 +6、压力 −5。',{mood:6,stress:-5})],s=>s.elapsed>25),
 e('choice-after','如果不用把全部时间卖掉，你想干什么','技术让一部分生活变便宜了，稀缺的东西却换了名字：好位置、人的信任、被需要的感觉。你打开一个空白日历。',[
 c('care','陪人，比再多一笔钱重要','关系 +12、心情 +8。',{relations:12,mood:8}),c('build','做一个没老板催的小东西','花 0.3 万，技能 +9、心情 +6。',{cash:-.3,skill:9,mood:6}),c('work','我还是喜欢做事和挣钱','压力 +4、口碑 +4，技能 +3。',{stress:4,reputation:4,skill:3})],s=>s.era.energy==='cheap'&&s.elapsed>35),
 e('older-job','年轻人也焦虑，你也焦虑','招聘软件把你归进了“经验丰富”那一栏，邀请却少了。AI 学得快，人不可能永远像刚毕业那样熬。',[
 c('mentor','带新人，靠经验吃饭','技能 +4、关系 +8；获得更适合转型的经历。',{skill:4,relations:8},{flags:{humanWork:true}}),c('update','再学一轮，量力而行','花 0.3 万，技能 +10、压力 +6。',{cash:-.3,skill:10,stress:6},{flags:{ai:true}}),c('reduce','少赚一点，身体先别垮','年薪 −0.6 万，健康 +5、压力 −8。',{salary:-.6,health:5,stress:-8})],s=>s.player.age>=45&&s.player.age<63)
];
EVENTS.push(...FUTURE);Object.assign(BY_ID,Object.fromEntries(FUTURE.map(x=>[x.id,x])));
const FOLLOWUPS=[
 e('home-repair','水退了，家里还没缓过来','上次进水以后，柜子底下总有一股潮味。隔壁开始加挡水板、抬高插座。你也得想想，下次下雨怎么办。',[
 c('fix','花钱做一次防水改造','花 0.8 万，以后的暴雨、台风财损先减少 30%，剩下的再按保险赔；地震不减。',{cash:-.8,stress:-3},{flags:{homePrepared:true}}),c('together','和邻居一起整理排水口','不额外花钱，关系 +7、健康 −1；自家防水没有升级。',{relations:7,health:-1},{flags:{volunteer:true}}),c('later','先把生活恢复，改造以后再说','压力 +3，保留手里的钱。',{stress:3})],s=>s.flags.wetHome&&s.elapsed>s.flags.wetHomeYear),
 e('heat-home','空调开了，电费也追上来了','上次热得睡不好，你开始看遮阳、通风和屋顶隔热。外面的天气管不了，家里的夏天也许能好过一点。',[
 c('shade','做遮阳和隔热','花 0.6 万，以后年度生活费少 0.12 万，高温事件的健康损失减半。',{cash:-.6,health:2},{expense:-.12,flags:{heatProtected:true}}),c('center','和街坊约好去避暑点','关系 +6、压力 −3，下次高温仍要自己安排。',{relations:6,stress:-3}),c('no','暂时不改，先把钱留着','心情 −2，不新增开支。',{mood:-2})],s=>s.flags.heatExperienced&&s.elapsed>s.flags.heatYear),
 e('work-referral','以前搭过手的人，给你发来一条招聘','对方记得你办事靠谱，知道你最近没工作，把一个岗位推给了你。工资不算惊艳，但不用再对着空白收件箱发愣。',[
 c('take','先去，把日子接上','找到年薪 9 万的协调服务工作，不带审批权；压力 −5。',{stress:-5},{employ:true,salarySet:9,job:'服务协调员',flags:{humanWork:true},clearPower:true}),c('try','先接些临时活，再看看','存款 +0.8 万、关系 +3；仍没有正式工作。',{cash:.8,relations:3}),c('learn','谢谢，我还想再准备一下','技能 +4，关系 +2。',{skill:4,relations:2})],s=>!s.employed&&!s.prison&&s.player.age<65&&(s.flags.helper||s.flags.volunteer||s.player.relations>=65)),
 e('loan-followup','钱没收回来，人还要不要见','那笔借款拖了很久。今天有人拉了一个聚餐群，你和借钱的朋友都在。对方还没解释，你已经有点累了。',[
 c('ask','把欠款和关系分开说清楚','技能 +3，压力 +2；不保证要回钱，不再追加借款。',{skill:3,stress:2}),c('distance','以后少来往，先照顾自己','关系 −3、压力 −5，不免除也不追回原借款。',{relations:-3,stress:-5}),c('peace','放下这件事，别再耗着','心情 +5、压力 −4，已经损失的钱不会回来。',{mood:5,stress:-4})],s=>s.flags.friendDefault),
];
EVENTS.push(...FOLLOWUPS);Object.assign(BY_ID,Object.fromEntries(FOLLOWUPS.map(e=>[e.id,e])));
export const FOLLOWUP_IDS=new Set(FOLLOWUPS.map(e=>e.id));
EVENTS.push(...ROLE_EVENTS);Object.assign(BY_ID,Object.fromEntries(ROLE_EVENTS.map(e=>[e.id,e])));
EVENTS.push(...FAMILY_EVENTS);Object.assign(BY_ID,Object.fromEntries(FAMILY_EVENTS.map(e=>[e.id,e])));
export function connectedEligible(e,s){
 if(FAMILY_IDS.has(e.id)||!careerEligible(e,s))return false;
 if(!(s.rules>=2))return !FOLLOWUP_IDS.has(e.id);
 const working=s.employed&&!s.prison&&s.player.age<65;
 if(['promotion','raise','severance','automation','ai-error','procurement','kickback','temptation-again','older-job'].includes(e.id)&&!working)return false;
 if(e.id==='climate-tax'&&!(s.flags.wetHome||s.flags.heatExperienced))return false;
 if(e.id==='retire'&&s.player.age>65)return false;
 if(e.id==='second-chance'&&s.flags.businessActive)return false;
 return !s.prison||e.id==='hospital'||e.id==='sick';
}
export function dailyPool(s){return DAILY.filter(t=>{
 if((!s.employed||s.career&&s.career.kind!=='employee')&&/同事|领导|老板|公司|工牌|加班|最后一班地铁/.test(t))return false;
 if(!s.flags.ai&&/AI 帮|让 AI 先/.test(t))return false;
 if(s.player.mood<30&&/认真开心|也值得庆祝/.test(t))return false;
 if(s.player.relations<30&&/合照|周六见/.test(t))return false;
 return true;
});}
