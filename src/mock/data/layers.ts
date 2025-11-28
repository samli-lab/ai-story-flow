// Mock 层和节点数据
import { Layer, StoryNode, Branch } from "../../types/layer";

// 根据 SQL 数据生成真实的分支故事数据
export const generateStoryTestLayers = (scriptId: string): Layer[] => {
  // 定义层数据
  const layers: Layer[] = [
    {
      id: "6cb48640-90d7-44e1-bdba-94ff74c01e20",
      script_id: scriptId,
      layer_order: 1,
      title: "第1层",
      description: undefined,
      is_collapsed: false,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      nodes: [],
    },
    {
      id: "a9fd0876-4e01-464d-8840-9612dc2c6f47",
      script_id: scriptId,
      layer_order: 2,
      title: "第2层",
      description: undefined,
      is_collapsed: false,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      nodes: [],
    },
    {
      id: "c7e8b199-5630-4848-a1d3-35891686500b",
      script_id: scriptId,
      layer_order: 3,
      title: "第3层",
      description: undefined,
      is_collapsed: false,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      nodes: [],
    },
    {
      id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      script_id: scriptId,
      layer_order: 4,
      title: "第4层",
      description: undefined,
      is_collapsed: false,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      nodes: [],
    },
  ];

  // 定义节点数据
  const nodes: StoryNode[] = [
    {
      id: "c50187dc-f61e-4576-981b-c2eddba0bcbd",
      layer_id: "6cb48640-90d7-44e1-bdba-94ff74c01e20",
      node_order: 1,
      title:
        "肺里的空气被一点点挤压殆尽，脖颈上的那只手像铁钳一样越收越紧。你努力睁开眼，看到的是一张俊美却扭曲的脸，男人眼底的厌恶浓稠得几乎要溢出来。",
      content:
        '肺里的空气被一点点挤压殆尽，脖颈上的那只手像铁钳一样越收越紧。你努力睁开眼，看到的是一张俊美却扭曲的脸，男人眼底的厌恶浓稠得几乎要溢出来。\n"Isabella，你这次做得太过了。"\n"咳……Aiden……放……手……"\n\n你像一条缺水的鱼徒劳地拍打着他的手臂。窒息带来的眩晕感让你眼前发黑，耳边却突然响起一道冰冷的机械音。\n【系统激活。主线任务开启：存活至剧终。唯一通关条件：攻略男主Aiden Sterling。】\n【检测到宿主生命值急速下降，请尽快采取行动。】\n你甚至来不及消化这荒谬的信息。脑海里涌入的记忆告诉你，眼前这个要把你掐死的男人是你名义上的哥哥，这个世界的男主Aiden，而你穿越成了那个最后会被他碎尸万段的恶毒女配Isabella。就在十分钟前，原主刚刚把你那个名义上的妹妹，也是Aiden的心尖宠Lily，推下了楼梯。\n这简直是地狱开局。攻略他？他现在只想把你的颈椎捏碎。\n\nAiden的手背上青筋暴起，显然是在极力克制着直接下杀手的冲动。\n"我说过，这是最后一次。"\n他的声音很轻，却让你脊背发凉。\n"如果Lily有什么三长两短，我会让你后悔来到这个世上。"\n"不……不是……"\n你艰难地从喉咙里挤出几个字，眼泪不受控制地滑落，滴在他的手背上。烫得他似乎瑟缩了一下。\n"我……只想……拉住她……"\n这是一句谎话，但却是你现在唯一的生路。原主是个演技派，这具身体残留的肌肉记忆让你此刻看起来楚楚可怜，完全不像刚刚那个推人下楼的恶魔。\n\nAiden盯着你的眼睛，似乎想从里面看出哪怕一丝破绽。僵持了几秒，他猛地甩开了手。\n你跌坐在地上，大口大口地贪婪呼吸着空气，喉咙火辣辣地疼。\n他居高临下地看着你，眼神依旧冰冷。\n"滚。"\n他转身走向门口，脚步停顿了一下。\n"在Lily醒来之前，别让我看到你走出这个房间半步。"\n\n房门被重重关上。你瘫软在昂贵的地毯上，摸着脖子上那道触目惊心的红痕。活下来了，暂时。\n【新手保护期结束。请宿主选择下一步行动策略。】\n系统的声音再次响起，完全没有给你喘息的机会。\n你看着紧闭的房门，脑海里全是Aiden刚才那个仿佛在看死人的眼神。要让这样一个恨你入骨的人爱上你，这比登天还难。\n但你不想死。\n你撑着地板慢慢站起来，走到镜子前。镜子里是一张苍白却精致的脸，脖子上的掐痕显得格外刺眼。这就是你的本钱，也是你的诅咒。\n现在，你必须做出选择。是老老实实待在房间里等待未知的审判，还是主动出击，去看看那个关键人物——Lily？',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "936e0d13-0b92-42a4-9e54-95b8785da6db",
      layer_id: "a9fd0876-4e01-464d-8840-9612dc2c6f47",
      node_order: 2,
      title:
        "你张了张嘴，最终什么也没说。那股刚刚涌上来的冲动像潮水一样退去，你重新靠回床头，垂下了眼帘。",
      content:
        '你张了张嘴，最终什么也没说。那股刚刚涌上来的冲动像潮水一样退去，你重新靠回床头，垂下了眼帘。\n你只是轻轻点了点头，甚至把那个屏蔽器往床头柜里面推了推，摆出一副"悉听尊便"的姿态。\n\nLeo那张仿佛永久面瘫的脸上终于出现了一丝裂痕。他准备好的说辞——如果你大吵大闹就给你注射镇静剂的方案——突然没了用武之地。\n他推眼镜的手指在半空中停滞了半秒。\n那双藏在镜片后的眼睛像扫描仪一样在你身上扫过，似乎想从你平静的表情下挖出什么阴谋诡计。但你只是闭上了眼，一副拒绝交流的样子。\n"……明智的选择。"\nLeo收回视线，扔下这句话，转身离开。房门再次落锁的声音在空旷的房间里回荡。\n\n接下来的三天，你真的像个幽灵一样待在房间里。没有人来送饭，只有每天早上门口放着的营养液和面包，像是喂养一只不听话的宠物。\n你没有吵，没有闹，甚至连放在门口的食物都按时吃光。系统除了偶尔报时，安静得像死机了一样。你在赌，赌你的反常会让Aiden感到不安，或者至少，感到好奇。\n直到第四天傍晚，楼下传来了久违的喧闹声。\n【主线任务更新：Lily出院。关键剧情节点已触发。】\n【警告：Aiden心情波动剧烈，请小心应对。】\n\n豪车的引擎声，佣人们的问候声，还有……那个让你听了就头皮发麻的、属于Aiden的低沉嗓音。\n"小心台阶。"\n哪怕隔着这么远，你都能听出那语气里的小心翼翼和温柔——那是你这个"恶毒姐姐"永远无法得到的待遇。\n你的房门并没有被打开。禁闭似乎还在继续，但你知道，真正的审判现在才开始。楼下的欢声笑语和你房间的死寂形成了鲜明的对比。\n你是继续在房间里装死，做一个被遗忘的配角？还是主动走出去，迎接即将到来的暴风雨？毕竟，如果不主动出现在镜头里，这出戏要怎么演下去？\n房门没有锁，或者说，刚才送餐的人故意没有锁死？\n你站起身，赤着脚走到门边，手放在冰凉的把手上。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "69953413-da57-4fb9-b975-918f6e51cb6e",
      layer_id: "a9fd0876-4e01-464d-8840-9612dc2c6f47",
      node_order: 3,
      title: '"Lily她……怎么样了？"',
      content:
        '"Lily她……怎么样了？"\n话一出口，你就看到了Leo眼底闪过的一丝讥诮。\n"这重要吗？如果我说她还没醒，你会开香槟庆祝？还是说如果她醒了，你会失望没能一次解决掉麻烦？"\nLeo推了推眼镜，镜片反光挡住了他的眼神，但这语气已经说明了一切。在他眼里，你现在问这个，无非是想确认自己的"战果"。\n\n如果是以前的Isabella，现在估计已经跳起来指着他的鼻子骂他只是个下人了。但你只是深吸了一口气，压下了心里的憋屈。\n"我不指望你相信。但我不想Aiden……不想再激怒Aiden了。"\n你抬起头，直视着Leo冷漠的脸。\n"如果她醒了，告诉Aiden，不管他信不信，我没想推她。医药费……虽然我的卡被停了，但我名下还有些首饰，拿去卖了应该够赔偿。"\n\nLeo原本正准备转身离开的动作顿住了。他转过头，这次是用一种全新的、像是在看某种未知生物的眼神审视着你。原主视财如命，那些首饰比她的命还重要，现在的你居然主动提出要卖掉赔偿？\n"苦肉计？"\n他轻笑了一声，并不买账。\n"这招对Boss没用。不过，你的话我会转达。至于首饰……"\n他扫视了一圈房间里琳琅满目的奢侈品。\n"Sterling家不缺这点钱。留着给自己买棺材吧，如果Lily小姐这次有后遗症的话。"\n\n房门再次被关上，这次落锁的声音格外清晰。\n虽然被奚落了一顿，但你赌赢了一件事——Leo是个完美的传声筒。他绝对会把你反常的态度一字不落地告诉Aiden。怀疑也好，试探也罢，只要能让Aiden觉得"不对劲"，你就成功了一半。\n接下来的几天，你被彻底软禁。饭菜会被定时送进来，没人跟你说话，Aiden也没出现。这是一种精神折磨。\n直到第三天傍晚，那个让你神经紧绷的系统提示音突然炸响。\n【警告：关键剧情点触发。】\n【检测到Kane家族成员Julian即将对医院进行探视。原剧情：Julian趁机给Lily下毒嫁祸给Isabella。】\n【当前任务：阻止Lily再次受害，洗脱嫌疑。】\n房门没有锁死，或许是送餐的人忘了，又或许是某种默许。\n如果你现在溜出去，不仅违反了Aiden的禁足令，还可能直接撞上Aiden或者Julian。但如果不去，那口原本就背在你身上的黑锅，这次恐怕会变成焊死在身上的铁棺材。\n窗外下起了暴雨，雷声滚滚。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "528031db-63d9-46aa-b3c2-f85aca7621d3",
      layer_id: "c7e8b199-5630-4848-a1d3-35891686500b",
      node_order: 4,
      title:
        "实木扶手冰凉刺骨，你赤着脚踩在厚重的羊毛地毯上，每一步都像踩在棉花里，没有发出一点声音。",
      content:
        '实木扶手冰凉刺骨，你赤着脚踩在厚重的羊毛地毯上，每一步都像踩在棉花里，没有发出一点声音。\n楼下的水晶吊灯开得很亮，刺得你在这个昏暗房间里待了三天的眼睛生疼。\n"今晚让厨房做点清淡的……"\nAiden的声音戛然而止。\n\n就像被按下了暂停键，大厅里原本忙碌的佣人们瞬间僵在原地。Aiden正背对着你，正在帮轮椅上的Lily整理盖毯。\n他几乎是出于野兽般的直觉猛地回过头。\n在看到你的那一瞬间，他原本还有些温度的眼神瞬间冻结成冰。下一秒，他侧过身，将Lily严严实实地挡在身后，隔绝了你的视线。\n"谁准你出来的。"\n这一声不高，却让周围的几个佣人吓得低下了头，恨不得把自己缩进地板缝里。\n\n被他挡在身后的Lily探出半个脑袋。她脸色苍白，头上还缠着纱布，看到你站在楼梯转角的那一刻，她下意识地瑟缩了一下，苍白的手指紧紧抓住了Aiden的袖口。\n"姐……姐姐……"\n她的声音在发抖。\n这一声"姐姐"无疑是火上浇油。Aiden周身的气压更低了，他反手握住Lily的手，安抚性地拍了拍，目光却死死锁在你身上，像是在看一个随时会暴起伤人的疯子。\n【警告：Aiden怒气值正在攀升。】\n\n你扶着楼梯扶手，因为几天的营养不良，身形显得有些单薄。身上那件真丝睡裙松垮垮地挂在身上，和你平时盛气凌人的样子判若两人。\n你没有像原主那样看到这就歇斯底里地尖叫"她在装可怜"，也没有冲下去解释。\n你只是站在那里，目光穿过Aiden充满敌意的防线，落在Lily缠着纱布的额头上。\n"我饿了。"\n声音很轻，却在死寂的大厅里清晰可闻。\n"厨房还有吃的吗？"\n\n这个完全不按套路出牌的开场白让Aiden怔了一瞬。他似乎准备好了一肚子恶毒的警告和威胁，却像一拳打在了棉花上。\n他眯起眼，似乎在评估你这是不是一种新的挑衅手段。\n"Isabella。"\n他念着你的名字，语气里带着研判。\n"你觉得你现在有资格提要求吗？"\n他没有直接让人把你拖上去，这就是机会。你现在站在楼梯上，他在楼下，这种居高临下的位置并没有给你带来任何优势，反而让你像个等待审判的犯人。\n是继续用这种示弱的姿态博取同情，还是利用Lily的善良来打破僵局？',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "bd80fea5-984e-4533-a688-335a86393495",
      layer_id: "c7e8b199-5630-4848-a1d3-35891686500b",
      node_order: 5,
      title:
        "你松开门把手，转身走向通往露台的落地窗。厚重的丝绒窗帘是你天然的掩体，你侧身躲在阴影里，透过缝隙向下窥视。",
      content:
        '你松开门把手，转身走向通往露台的落地窗。厚重的丝绒窗帘是你天然的掩体，你侧身躲在阴影里，透过缝隙向下窥视。\n夕阳把花园染成了一片暧昧的橘红色。Aiden的车停在喷泉旁，佣人们站成两排，阵仗大得像是在迎接皇室成员。\n车门打开，Aiden先下了车。他没有立刻走开，而是弯下腰，向车内伸出手。动作轻柔得让你想起那天他掐你脖子时的反差。\n一只苍白纤细的手搭在他的掌心。Lily出来了。她穿着白色的连衣裙，看上去弱不禁风，整个人几乎是挂在Aiden身上的。\n\nAiden低头在说着什么，侧脸的线条柔和得不可思议。他甚至抬手帮Lily理了理被风吹乱的碎发。\n这就是你要攻略的对象？在你面前是修罗，在Lily面前是圣父。你觉得系统的运算逻辑一定有大病。\n突然，Lily像是感应到了什么，身体僵硬了一下。她缓缓抬起头，那双如同受惊小鹿般的湿润眼眸，精准地穿过二楼的距离，直直地看向你藏身的方向。\n\n下一秒，她像看到了什么恐怖的东西，瑟缩着往Aiden怀里躲去。\n"怎么了？"\n虽然听不清声音，但你看得懂口型。Aiden顺着她的视线猛地抬头。\n四目相对。\n那一瞬间，空气仿佛凝固了。Aiden眼底的温柔瞬间结冰，取而代之的是毫不掩饰的暴戾和厌恶。隔着这么远，你都能感觉到那股扑面而来的窒息感。你就像阴沟里的老鼠，被聚光灯当场抓获。\n你下意识地想躲，但身体却僵在原地。既然已经被发现了，再躲就显得更猥琐了。你索性站直了身体，面无表情地看着他们。\nAiden眯起了眼睛，那是危险的信号。他低头安抚了Lily几句，然后对身后的Leo打了个手势。那是一个冰冷的、向上的手势。\n\n不到两分钟，你房间的门被重重敲响。\n"Isabella小姐。"\n又是Leo。这次他的声音里多了一丝不耐烦。\n"Boss请您下去。立刻。"\n躲不过去了。Aiden显然认为你在楼上"监视"Lily是图谋不轨，他要当面清算。\n你深吸一口气，拉开了房门。Leo站在门口，侧身为这一场即将到来的审判让出了一条路。\n走到楼梯口时，那对兄妹正坐在客厅的沙发上。Lily手里捧着热茶，还在微微发抖。Aiden正在检查她的膝盖，听到脚步声，他没有回头，只是背影散发出的寒气更重了。\n这是一场鸿门宴。你该怎么入场？\n走过去，道歉？那是原主才会做的虚伪戏码。\n保持沉默？Aiden可能会觉得你在挑衅。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "106820ba-5e81-404e-b183-1b86d1ad5a44",
      layer_id: "c7e8b199-5630-4848-a1d3-35891686500b",
      node_order: 6,
      title:
        "这就是一场豪赌。输了，你会死在Aiden手里；赢了，或许能在他那颗石头心上砸出一条缝。",
      content:
        '这就是一场豪赌。输了，你会死在Aiden手里；赢了，或许能在他那颗石头心上砸出一条缝。\n你抓起一件深色连帽衫套上，趁着雷声掩盖了脚步声，从那个没锁严的侧门溜了出去。暴雨瞬间把你浇了个透心凉，豪宅的安保系统似乎因为雷暴出现了短暂的故障，让你奇迹般地钻了空子。\n没有钱，没有车。你光着脚跑在泥泞的公路上，直到一辆好心的货车司机把你捎到了市区。\n\n到达圣玛丽医院时，你看起来就像个从水鬼。头发贴在脸上，衣服还在往下滴水，浑身都在发抖。\n你冲进电梯，按下了顶层VIP病房的按钮。\n电梯门一开，你就看到了那个让你心跳骤停的身影——Julian Kane。他穿着一身笔挺的白色西装，手里捧着一束鲜花，正站在Lily的病房门口，和一个推着药车的护士低声交谈。\n那个护士点点头，从推车上拿起一杯水，准备推门进去。\n如果不阻止那杯水，Lily必死无疑，而你就是那个替罪羊。\n\n你顾不上周围保镖诧异的目光，用尽全身力气冲了过去。\n"别进去！"\n嘶哑的吼声在安静的走廊里显得格外刺耳。Julian转过身，看到是你，嘴角勾起一抹意味深长的笑，那眼神就像在看一直自投罗网的猎物。\n护士被吓了一跳，手里的托盘晃了一下。你趁机扑上去，一把打翻了那杯水。\n"哗啦——"\n玻璃碎裂的声音在走廊上炸开。\n\n"如果你想喝水，我让人给你倒。为什么要为难护士？"\n一道低沉阴冷的声音从身后传来。\n你的心脏猛地紧缩。回过头，Aiden就站在电梯口，黑色的风衣上带着外面的寒气，身后的Leo脸色难看到了极点。\nJulian立刻换上了一副惊讶又遗憾的表情，摊开手：\n"Aiden，我还以为你妹妹需要这杯水。看来Isabella小姐对我的探视很有意见啊……或者说，是对这杯药有意见？"\n这一招倒打一耙简直完美。在Aiden眼里，这画面就是你这个被禁足的恶毒女人，像疯子一样冲到医院，打翻了给妹妹的救命药（或水），还在针对他生意上的伙伴。\nAiden一步步走过来，皮鞋踩在碎玻璃上发出令人牙酸的声响。\n"查……查那杯水……"\n你浑身发抖，不知道是因为冷还是因为怕。你指着地上的水渍，眼神死死盯着Aiden。\n"水里……有东西……"\nAiden停在你面前，伸手捏住了你的下巴，力道大得像是要捏碎你的骨头。\n"你是想告诉我，Julian Kane，Kane家族的继承人，会亲自跑来医院给Lily下毒？而你，这个推她下楼的凶手，是来救她的？"',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "b0496a39-1626-422b-b158-f41ee7ddaa39",
      layer_id: "c7e8b199-5630-4848-a1d3-35891686500b",
      node_order: 7,
      title:
        "通讯器被收走了，手机没信号。你盯着床头那个复古的内线电话——这是唯一可能没被切断的线路。你抓起听筒，手指颤抖着按下了那个只在记忆里出现过的快捷键：1号键，直通总控室，也就是Leo此时所在的地方。",
      content:
        '通讯器被收走了，手机没信号。你盯着床头那个复古的内线电话——这是唯一可能没被切断的线路。你抓起听筒，手指颤抖着按下了那个只在记忆里出现过的快捷键：1号键，直通总控室，也就是Leo此时所在的地方。\n"嘟……嘟……"\n通了。\n这一秒漫长得像一个世纪。\n"说。"\nLeo的声音冷硬，伴随着键盘敲击的背景音。他显然知道是谁打来的，也显然没什么耐心。\n\n"Julian Kane今晚会去医院。拦住他，或者检查他带去的所有东西，尤其是那束花。"\n你没有寒暄，也没有求饶，直接抛出了剧透。原著里，毒药就藏在那束看似无害的百合花花粉里。\n电话那头沉默了两秒。\n"Kane家和我们刚签了合作意向书。你在发什么疯？想用这种低劣的借口骗我放你出去？"\nLeo的声音里带着显而易见的荒谬感，但他没有立刻挂断电话。涉及到Kane家族，哪怕是疯话，他也必须听完。\n\n窗外一道惊雷炸响，震得玻璃嗡嗡作响。\n"如果是假的，你可以让Aiden把我的手剁了。反正他本来也就想这么做，不是吗？"\n你握着听筒的手指发白，语气却出奇地冷静。\n"但我如果是对的，而你没拦住……Leo，你也知道Aiden发疯起来是什么样。Lily如果今晚出事，你负得起责吗？"\n\n又是漫长的沉默。你甚至能听到那头Leo呼吸频率的变化。他在权衡。你是出了名的恶毒花瓶，你的话毫无信誉可言。但Julian Kane确实是个深不可测的伪君子，Leo作为Aiden的左右手，对Kane家族一直存有戒心。\n而且，你那句"剁手"的赌注太过血腥，反而增加了一丝可信度。\n"我会加强医院的安保。如果Julian Kane没去，或者什么都没发生……"\nLeo顿了顿，声音里透着刺骨的寒意。\n"我会亲自向Boss申请执行刚才那个\'剁手\'的提议。"\n"嘟。"\n电话挂断了。\n\n你脱力地靠在床头，后背已经被冷汗湿透。只要Leo介入，Julian那种谨慎的性格绝对不敢顶风作案，或者Leo真的能查出那束花的问题。无论哪种，Lily今晚安全了。\n而你，刚刚在Aiden最信任的人那里，种下了一颗"预知者"的种子。\n雨越下越大。几个小时后，深夜。\n房门突然被人猛地推开。走廊昏暗的灯光下，一个高大的身影逆光而立。雨水顺着他的风衣下摆滴落在地毯上，空气中弥漫着潮湿的水汽和……淡淡的血腥味。\n是Aiden。\n他一步步走进房间，手里把玩着一只被揉烂的百合花，眼神晦暗不明地盯着你。\n"Julian真的去了。带了一束百合。"\n他停在你面前，将那残破的花扔在你身上。\n"花粉里有神经毒素。你是怎么知道的？"',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "3a06378a-9970-47b7-a37c-b18275482882",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 8,
      title:
        "你无视了Aiden那句充满嘲讽的反问，甚至没有看他一眼。你的视线绕过他宽阔的肩膀，精准地落在那个缩在轮椅上的女孩身上。",
      content:
        '你无视了Aiden那句充满嘲讽的反问，甚至没有看他一眼。你的视线绕过他宽阔的肩膀，精准地落在那个缩在轮椅上的女孩身上。\n这是原主造的孽，现在得由你来还。\n你扶着栏杆，一步一步走下剩下的台阶。每走一步，Aiden身上的肌肉就紧绷一分，仿佛你是一颗移动的定时炸弹。\n在距离他们三步远的地方，你停下了。\n"Lily。"\n你叫了她的名字，声音干涩却异常清晰。\n"对不起。推你下楼的事，是我做的。我不求你原谅，只希望你知道，以后不会了。"\n\n空气死一般的寂静。\nAiden脸上的表情凝固了。他似乎预想过你会撒泼、会狡辩、会装无辜，唯独没想过你会这么直白地认罪。\n随即，一声冷笑打破了沉默。\n"这就是你的新剧本？以退为进？"\nAiden上前一步，逼视着你，眼底的寒意没有消退半分。\n"Isabella，你这张嘴里吐出的每一个字，都让我觉得恶心。"\n\n如果是以前的Isabella，现在大概已经尖叫着扑上去了。但你只是站在那里，甚至没有反驳一句。\n就在Aiden准备叫保镖把你扔出去的时候，一只苍白的小手拽住了他的衣角。\n"哥哥……等一下。"\nLily从他身后探出身子，那双像极了小鹿的眼睛里带着惊疑，更多的却是一种复杂的探究。她看着你，像是第一次认识这个姐姐。\n"让她……说完。"\n\nAiden回头看了Lily一眼，眼底的风暴勉强压了下去，但身体依旧维持着防御姿态。\n你得到了许可，但这已经耗尽了你所有的力气。三天只靠营养液维持的身体在这一刻终于提出了抗议。道歉说完，那股支撑你的肾上腺素瞬间退去。\n眼前的景象开始摇晃，水晶吊灯的光晕散开成无数个光斑。你的膝盖一软，那种令人作呕的眩晕感铺天盖地而来。\n这一次，不是演戏。\n你连伸手去抓扶手的力气都没有，身体直挺挺地向前栽去。\n在意识彻底陷入黑暗的前一秒，你看到那双总是盛满厌恶的眼睛里，第一次闪过了一丝错愕。\n还有那个向你伸出的手，到底是想推开你，还是接住你？\n【系统提示：苦肉计判定成功。虽然是被动的。】\n\n……\n再次醒来的时候，鼻尖萦绕着消毒水的味道。\n你睁开眼，发现自己并没有睡在冰冷的地板上，而是躺回了自己的房间。手背上插着输液管，透明的液体正一滴一滴地流进你的血管。\n房间里并不是只有你一个人。\n昏暗的壁灯下，一个人影坐在离床不远的沙发上，指间夹着一点猩红的火光。烟雾缭绕中，你看不太清他的脸。\n是Aiden？还是Leo？或者是……那个一直想置你们于死地的反派Julian？',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "7b124b13-3d29-4c38-83ed-cff03062ff8a",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 9,
      title:
        "你的视线开始在Aiden那张冷峻的脸上聚焦，又涣散。这不仅仅是演技，三天只靠营养液维持的身体确实到了极限，你只需要顺水推舟，把那份眩晕感放大十倍。",
      content:
        '你的视线开始在Aiden那张冷峻的脸上聚焦，又涣散。这不仅仅是演技，三天只靠营养液维持的身体确实到了极限，你只需要顺水推舟，把那份眩晕感放大十倍。\n你松开了抓着扶手的手。\n身体像断了线的风筝一样向前倾倒。失重的瞬间，你看到Aiden瞳孔猛地收缩。\n\n"姐姐！"\nLily的尖叫声刺破了空气。\n你并没有感觉到预想中滚落楼梯的剧痛。在你的脸即将亲吻大理石台阶的前一秒，一股大力的拉扯止住了你的下坠势头。\nAiden的手臂横在你的腰间，硬得像块石头。与其说是抱，不如说是把你当作什么脏东西一样截停在了半空中。惯性让你的头重重撞在他的胸口，只有这一瞬间，你闻到了他身上那股冷冽的烟草味。\n\n【系统提示：肢体接触达成。Aiden情绪极度不稳定。】\n"该死。"\n头顶传来一声低咒。Aiden浑身紧绷，肌肉硬得像铁块。他没有立刻推开你，大概是因为Lily就在旁边看着。\n"Leo！叫医生！"\n他冲着不知何时出现的助理吼了一声，声音里听不出半点担心，只有处理麻烦事的暴躁。\n\n你紧闭着眼，把身体的重量完全压在他身上，哪怕能感觉到他抱着你的手正在微微颤抖——那是他在克制把你扔出去的冲动。\n你是被"扔"回房间的床上。不是那种温柔的放置，而是带着明显情绪的抛掷。床垫的弹力让你差点真晕过去。\n"如果这是你在演戏，"Aiden的声音在你耳边响起，近在咫尺，却冷得掉渣，"那你最好祈祷你的演技足够好，好到能骗过医生。"\n不管你是真晕还是装晕，这一局你赢了。至少今晚，没人会再追究你私自下楼的罪过，那份资产剥离协议也没人再提。\n现在，房间里只剩下医生在收拾仪器的声音，还有Aiden站在床边那极具压迫感的呼吸声。\n你必须决定醒来的时机。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "c920e08e-7f6e-4053-9cd5-8df59a26f957",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 10,
      title:
        "你停在离沙发还有三米远的地方。这个距离既不至于显得咄咄逼人，也能保证如果Aiden突然暴起，你有足够的反应时间。",
      content:
        '你停在离沙发还有三米远的地方。这个距离既不至于显得咄咄逼人，也能保证如果Aiden突然暴起，你有足够的反应时间。\n"关于楼梯那件事，我很抱歉。"\n你的声音冷得像是在读一份尸检报告。没有眼泪，没有颤抖，没有那句经典的"我是为了你好"。只有一句光秃秃的陈述句。\n\n客厅里陷入了死一般的寂静。Lily捧着茶杯的手顿在半空，那双刚才还泪光点点准备接受（或者拒绝）你痛哭流涕忏悔的眼睛里，闪过一丝错愕。这不在她的剧本里。\n但她反应很快。\n"没关系的，姐姐……"\nLily放下茶杯，试图从沙发上站起来，脸上挂着那种标准的、圣母般原谅的微笑。\n"我知道你那天心情不好，我不怪——"\n"坐下。"\nAiden的声音不高，却成功让Lily刚离地的屁股又坐了回去。\n\n他甚至没有看你一眼，只是把玩着Lily那缕发丝的手指停了下来。他慢条斯理地转过头，那双深灰色的眼睛里写满了嘲弄。\n"什么时候，我们的Isabella大小姐学会了这么廉价的表演？"\n他站起身，一步步走到你面前。身高的压迫感让你不得不仰视他。\n"没有眼泪，没有下跪，也没有借口。怎么，换策略了？以为这种欲擒故纵的把戏能引起我的注意？"\n\n他突然伸出手，捏住你的下巴，强迫你抬起头。力道很大，你的下颚骨隐隐作痛。\n"Leo。"\n"是，Boss。"一直在角落里当背景板的Leo立刻上前。\n"从今天起，撤掉她在主宅的所有用餐资格。"Aiden甩开你的脸，像甩开什么脏东西，"我不希望Lily吃饭的时候看到任何倒胃口的东西。"\n【Aiden好感度更新：-79（稍微觉得你有点意思，但不多）。】\n【警告：您已被降级为"隐形人"。生存难度提升。】\n这算什么？好感度居然涨了一点？这个男人果然是个抖M吗？\nAiden重新坐回Lily身边，温柔地递给她一块切好的水果，仿佛刚刚那个暴君根本不存在。\n"带她下去。别让我说第二遍。"\nLeo走到你身边，做了一个"请"的手势，方向直指厨房后门——那是佣人进出的通道。\n你被流放了。在这个家里，你从这一刻起，地位甚至不如一条宠物狗。\n你是默默忍受这个新的羞辱转身离开，还是在这个时候，利用Aiden的变态心理，再给他加点料？',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "0be9cf2b-a99b-4ab4-b33c-ab2bdd00c8d7",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 11,
      title:
        "你一步一步走下楼梯，高跟鞋踩在木质地板上的声音在死寂的客厅里显得格外清晰。每走一步，Aiden背影散发的冷意就重一分。",
      content:
        '你一步一步走下楼梯，高跟鞋踩在木质地板上的声音在死寂的客厅里显得格外清晰。每走一步，Aiden背影散发的冷意就重一分。\n走到沙发侧面站定，你没有看那个想用眼神杀死你的男人，而是将视线落在了那个缩成一团的女孩身上。\n"欢迎回家，Lily。"\n语气平稳，甚至有点乏味。既没有原主那种令人作呕的甜腻，也没有包含任何歉意。就像是你刚刚只是去厨房倒了杯水，顺路打了个招呼。\n\nLily正在喝茶的手猛地一抖。滚烫的红茶泼了出来，溅在她雪白的裙摆上，在这个安静的空间里显得格外突兀。\n"啊……"她短促地惊叫了一声，杯子从手中滑落，在地毯上发出一声闷响。\nAiden几乎是瞬间弹了起来。他一把抓住Lily的手腕检查烫伤，确认无碍后，才猛地转过身面对你。那张俊脸因为极度的愤怒而微微扭曲。\n"这就是你的目的？稍微露个面就能让她吓成这样，Isabella，你现在的存在本身就是一种暴力。"\n他上前一步，高大的身躯完全笼罩了你，逼人的气势让你不得不后退半步。\n"既然你学不会在这个家里隐形，那就让我教你。"\n\n【警告：检测到男主Aiden杀意值飙升。】\n【突发任务触发：消除Aiden当前的杀意。】\n【方法提示：肢体接触是缓解狂躁症的最佳手段（虽然风险极大）。】\n系统在这个节骨眼上弹出的提示简直是在让你送死。肢体接触？现在？他看起来只想折断你的手。\n你还没来得及反应，Aiden已经不想再废话。\n"Leo，把她关进地下室。既然房间关不住你，那就换个更彻底的地方。"\n地下室。原著里Isabella被关进去后发了疯的地方。那是真的要把你当犯人对待了。\n\nLeo从阴影里走出来，面无表情地向你伸出手。\n如果不做点什么，这局就真的完了。系统说的"肢体接触"是你唯一的救命稻草，尽管它看起来更像是催命符。\nAiden正转身准备去安抚Lily，他的西装袖口离你的手指只有几厘米的距离。\n你是要在这个疯批男主气头上，去抓他的手？\n如果不赌这一次，等待你的就是暗无天日的地下室结局。\n你的手颤抖着抬起来，伸向那个背对着你的男人。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "0eb58774-f84e-46c1-bb94-d37532c5b018",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 12,
      title: "解释是多余的。在他的逻辑里，你连呼吸都是错的。",
      content:
        '解释是多余的。在他的逻辑里，你连呼吸都是错的。\n你看着Aiden那双冷得像冰一样的眼睛，心里最后一点名为"尊严"的东西被生存的渴望碾得粉碎。你想活下去，哪怕是用这种最卑贱的方式。\n你没有说话，甚至没有挣扎摆脱他的手。你只是猛地俯下身，在那片狼藉中抓起一块还残留着液体的玻璃碎片。\n手指被边缘割破，鲜血混着那不明液体顺着指尖流下。\n"Isabella！"\nAiden似乎意识到了你要做什么，声音里第一次出现了一丝裂痕。\n\n太晚了。\n你毫不犹豫地将那块碎片送进嘴里，舌尖卷过那残留的液体。苦涩，带着一股令人作呕的杏仁味，瞬间在口腔里炸开。\n"咳……咳咳……"\n灼烧感顺着喉咙一路烧到胃里，像是吞下了一团火炭。你的视线开始模糊，原本就因为淋雨而虚弱的身体剧烈抽搐起来。\n一口鲜红的血直接喷在了Aiden那件昂贵的黑色风衣上。\n\n周围死一般的寂静。\nJulian脸上的假笑僵住了，他下意识地后退了一步，眼底闪过一丝不可置信的惊慌。他没料到你会疯到这个地步，也没料到这毒药发作得这么快。\nAiden把你接在怀里。他的手在抖，那种不可一世的从容彻底崩塌。\n"Leo！叫医生！现在！"\n你死死抓着他的衣领，指甲几乎陷进肉里，用尽最后一点力气指着站在一旁面色苍白的Julian。\n"是……他……"\n鲜血不断从你嘴角溢出，堵住了剩下的声音。但那个眼神已经说明了一切。\n\nAiden猛地抬头看向Julian。那一瞬间，他眼里爆发出的杀意浓烈得仿佛实质，让整个走廊的空气都凝固了。\n"Aiden，这……这女人疯了，她可能是自己吃了什么……"\nJulian试图辩解，但声音有些干涩。\n"滚。"\nAiden没有咆哮，只有一个字，却像是从地狱里爬出来的恶鬼发出的低吼。\n"如果你再多说一个字，我就让你从这里横着出去。"\nLeo已经带着医生冲了过来。你感觉身体轻飘飘的，周围的声音越来越远，最后定格在Aiden那张近在咫尺、充满了惊慌和不知所措的脸上。\n好感度提示音似乎响了，但你已经听不清了。黑暗吞噬了一切。\n\n再次醒来时，只有刺鼻的消毒水味。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "06db0dd9-869d-4862-bb29-1227b0ca0037",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 13,
      title: '"Leo……"',
      content:
        '"Leo……"\n你没有理会Aiden足以杀人的目光，而是艰难地转过头，看向那个一直站在阴影里的助理。这是你最后的赌注。\n"你是……最理智的……哪怕只有万分之一的可能……查一下……"\n你的手颤抖着伸向Leo的裤脚，还没碰到就被Aiden狠狠甩开。你的头重重磕在墙上，视线模糊了一瞬，但你依然死死盯着Leo。\n"求你。"\n\nLeo面无表情地看着你，镜片后的目光在Julian那一脸完美的无辜和地上的水渍之间来回扫视了一次。作为一个顶级家族的特助，哪怕是再荒谬的风险，只要涉及到主人的安全，他都有责任排除。\n他越过Aiden，从口袋里掏出一块洁白的手帕，蹲下身，在那滩尚未干涸的水渍上沾了沾。\n"Leo？"\nJulian脸上的笑容僵硬了一瞬，随即立刻恢复正常，但这一瞬间的不自然没能逃过Leo的眼睛。\n"只是为了让Isabella小姐死心，Kane先生。"\nLeo淡淡地回了一句，随后将沾了水的手帕凑近鼻端闻了闻，又迅速从随身携带的公文包里取出一支便携式检测试剂——那是为了防止商业投毒常备的。\n\n走廊里死一般的寂静。Aiden松开了捏着你下巴的手，站直了身体，目光阴沉地盯着Leo手中的动作。\n几秒钟后，Leo的手顿住了。\n那张原本白色的试纸，在接触到手帕上的液体后，迅速变成了刺眼的深紫色。\n"高浓度神经毒素。"\nLeo站起身，这一次，他看向Julian的眼神里不再有任何客套，只有如同看死人般的冰冷。\n"只要一口，Lily小姐现在已经是一具尸体了。"\n\n空气仿佛在这一瞬间凝固。\nJulian脸上的笑容彻底消失了。他没有辩解，而是遗憾地叹了口气，整理了一下袖口。\n"看来Sterling家的安保也没有传说中那么严密。Aiden，我们改日再聊。"\n他甚至没有否认，因为否认在Leo的证据面前毫无意义。他转身就走，几个保镖试图拦住他，却被他身后的雇佣兵挡开。\nAiden没有下令追击。他站在原地，浑身散发着令人窒息的低气压。他缓缓转过头，看向还瘫坐在地上、浑身湿透的你。\n这一次，他眼中的情绪不再是单纯的厌恶，而是一种极为复杂的、夹杂着震惊、怀疑，以及一丝不易察觉的……后怕。\n如果不是你发疯般地冲过来。\n如果不是你打翻了那杯水。\n如果在刚才他直接把你扔出去。\nLily现在已经死了。\n你在这个男人的注视下，只觉得眼皮越来越沉。紧绷的神经一旦放松，身体的极限也就到了。\n"我……没想害她……"\n这是你在昏迷前留下的最后一句话。\n\n当你再次醒来时，不再是那个冰冷的地板，也不是被软禁的房间。\n鼻尖萦绕着淡淡的消毒水味。你睁开眼，发现自己躺在一张病床上，手背上挂着点滴。\n房间里很安静，只有仪器的滴答声。\n你动了动手指，发现床边坐着一个人。\n不是Leo。\n是Aiden。\n他看着手里的平板，头也没抬，但你知道他知道你醒了。\n"醒了？"\n"……嗯。"\n他合上平板，终于看向你。那双深邃的眼睛里依然看不出喜怒，但他接下来说的话，却让你心跳漏了一拍。\n"为什么？"\n这一问，没有了之前的暴戾，反而多了一种要把你看穿的压迫感。\n他想知道的不仅仅是为什么你会知道水里有毒，更是为什么你会不顾一切地来救Lily——那个你曾经恨之入骨的人。\n怎么回答？是告诉他是"直觉"，还是在这个时候表露一下"姐妹情深"？',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "ee2241a8-5ed0-4668-94fb-b24c5c38e935",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 14,
      title: '"如果我说，我看到了一本书，你信吗？"',
      content:
        '"如果我说，我看到了一本书，你信吗？"\n你迎着他阴鸷的目光，声音在雷声中显得有些飘忽。\n"书里写着，今晚Lily会死，你会为了给她报仇发疯，把整个Kane家族连根拔起。而我，会被你剁碎了喂狗。"\n\nAiden的瞳孔骤然收缩。他猛地俯下身，一把掐住你的下巴，力道大得像是要卸掉你的骨头。\n"你在找死。Isabella，别以为救了Lily一次，就有资格在我面前编这种荒诞的故事来诅咒我们。"\n他身上的雨水滴在你的脸上，冰冷刺骨。那双眼睛里不仅仅是杀意，还有一种被窥探后的暴戾。\n\n"是不是编故事，你自己心里清楚。"\n你被迫仰着头，看着这个原著里注定孤独一生的男人。既然已经开口了，那就只能赌到底。\n"就像我知道，你从来不在雷雨夜睡觉。因为七岁那年，把你锁在地下室的那个人，就是在一个雷雨夜当着你的面……"\n"够了！"\n\nAiden的手猛地松开，像是触电一般后退了半步。他死死盯着你，胸口剧烈起伏。那是他埋藏在心底最深处、连Leo都不完全清楚的梦魇。原主Isabella绝不可能知道这些。\n房间里的空气仿佛凝固了。只有窗外的雷声还在轰鸣。\n他看着你的眼神变了。不再是看一个恶毒的蠢货，而是在看一个危险的谜团。\n"不管你是从哪偷听来的，还是真的疯了……"\n他慢慢直起身，恢复了那副居高临下的姿态，但眼底的轻蔑已经消失，取而代之的是深不见底的寒意。\n"从今天开始，你最好祈祷你看到的那个\'剧本\'永远准确。因为一旦你没用处了，我会让你比那个结局死得更惨。"\n他转身离开，没有再提剁手的事，也没有解开你的禁足令。但他带走了那只烂掉的百合花。\n【警告：Aiden对你的怀疑度达到峰值。】\n【提示：Aiden好感度变化：-80 -> -60（即使是利用工具，也是有价值的工具）。】\n你瘫软在床上，大口喘气。你活下来了，但也彻底引起了他的注意。现在在他眼里，你不再是个只会争风吃醋的废物妹妹，而是一个拥有情报价值的、危险的"预言家"。\n第二天清晨，房门再次被打开。这次进来的不是送餐的女佣，也不是Leo，而是一群拿着化妆箱和礼服的人。\n为首的造型师恭敬却冷淡地鞠了一躬。\n"Isabella小姐，Aiden少爷吩咐，今晚的家族晚宴，您必须出席。"\n家族晚宴？原著里根本没有这段剧情。看来你的介入已经产生了蝴蝶效应。Aiden这是要把你放在眼皮子底下监控，还是准备在晚宴上试探你的"预言"能力？\n无论哪种，这都是鸿门宴。\n你看着托盘里那件露背的红色礼服——像血一样的颜色。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
    {
      id: "1f810e4f-1842-4e38-a6c2-50a030582391",
      layer_id: "90d4d77d-bc2e-4f1d-bba9-76d0757beec1",
      node_order: 15,
      title: '"上周的慈善晚宴。"',
      content:
        '"上周的慈善晚宴。"\n你强迫自己直视他那双仿佛能洞穿灵魂的眼睛，声音尽量平稳，指甲却深深掐进了掌心。\n"我在露台休息时，听到Julian在打电话。他提到了Sterling家，提到了Lily的名字，还有\'医院\'和\'意外\'这几个词。当时我没在意，以为又是商业上的手段……直到听说Lily住院。"\n\n这是一个半真半假的谎言。原主确实去了那场晚宴，也确实在露台躲懒，只不过当时她忙着嫉妒Lily，根本没听到什么阴谋。但死无对证，Julian绝不会承认，而Aiden也无法查证露台那个死角的监控。\nAiden眯起眼睛，冰冷的手指突然钳住你的下巴，强迫你仰起头。他身上的雨水滴在你的脸上，冷得刺骨。\n"你是说，你之所以把Lily推下楼，是因为你在意她的安危？Isabella，你的演技越来越拙劣了。"\n\n他的拇指摩挲着你下巴上的皮肤，力度大到让你感到疼痛。他在试探，也在评估。\n"不。"\n你没有躲闪，任由那股疼痛蔓延。现在任何退缩都会被视为心虚。\n"推她……是我的错，那是嫉妒，我承认。但Julian要杀她，性质不一样。如果我想让Lily死，我就应该闭嘴，看着Julian动手，然后把责任推得干干净净，而不是冒着被你剁手的风险给Leo打电话。"\n这番话逻辑闭环。一个单纯坏的蠢女人，和一个勾结外敌的叛徒，是有区别的。你赌Aiden能分清这一点。\n\nAiden盯着你看了许久，眼底的暴戾似乎消退了一些，取而代之的是一种更为复杂的深沉。他松开了手，指腹上似乎还残留着你皮肤的温度。\n"Leo查过了，那束花的来源确实有问题。"\n他站直身体，居高临下地看着你，恢复了那种平日里斯文败类的模样，只是语气依旧没有温度。\n"你救了Lily一次，这改变不了你伤害过她的事实。但……这笔账我可以暂时记下。"\n他从风衣口袋里掏出一块手帕，慢条斯理地擦着刚才碰过你的手指，仿佛沾染了什么脏东西。\n"既然你这么喜欢听墙角，那就发挥点余热。从今天起，解禁。但你只有这一个机会——把你脑子里知道的所有关于Kane家的事，不管真假，全部吐出来。"\n他把那块擦过的手帕扔到你脸上，遮住了你的视线。\n"别让我发现你还有所保留，或者在撒谎。否则，我不介意再把你关回去，永远。"\n\n手帕带着淡淡的烟草味和雨水的潮气滑落。Aiden已经转身离开了，只留下一个冷漠的背影。\n你捡起那块手帕，上面似乎还带着他的体温。这一关算是过了。虽然从"死囚"变成了"污点证人"，但这至少意味着你可以走出这个房间，接触到更多剧情人物了。\n【系统提示：Aiden好感度更新：-75（极度厌恶，但认为你有利用价值）。】\n【主线任务更新：利用"情报"优势，进一步获取信任。】\n第二天，禁足令解除。你重新获得了在这个豪宅里行走的权利，虽然佣人们看你的眼神依旧充满了鄙夷和畏惧。\n早餐时间，你走进餐厅。长桌尽头，Aiden正一边喝咖啡一边看报纸，而他对面……坐着那个刚刚出院、脸色苍白却依旧美丽的Lily。\n空气瞬间凝固。',
      duration: undefined,
      position_x: undefined,
      position_y: undefined,
      metadata: undefined,
      created_at: "2025-11-27T21:19:31.000Z",
      updated_at: "2025-11-27T21:19:31.000Z",
      branches: [],
    },
  ];

  // 定义分支连接数据
  const branches: Branch[] = [
    {
      id: "056e237e-d318-460a-9975-9d70d11b4ab6",
      from_node_id: "c50187dc-f61e-4576-981b-c2eddba0bcbd",
      to_node_id: "936e0d13-0b92-42a4-9e54-95b8785da6db",
      branch_label: "Accept silently",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "3599807c-55f2-498d-a884-eccdb5d917d5",
      from_node_id: "c50187dc-f61e-4576-981b-c2eddba0bcbd",
      to_node_id: "69953413-da57-4fb9-b975-918f6e51cb6e",
      branch_label: "Ask about Lily",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "d4163acb-e237-40b0-8304-757f78a99a11",
      from_node_id: "936e0d13-0b92-42a4-9e54-95b8785da6db",
      to_node_id: "528031db-63d9-46aa-b3c2-f85aca7621d3",
      branch_label: "Go downstairs",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "61c61378-d93b-4238-8900-d08871efab66",
      from_node_id: "936e0d13-0b92-42a4-9e54-95b8785da6db",
      to_node_id: "bd80fea5-984e-4533-a688-335a86393495",
      branch_label: "Watch from balcony",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "fd8fd368-cb5f-41fa-88ed-d8e9476c49f3",
      from_node_id: "69953413-da57-4fb9-b975-918f6e51cb6e",
      to_node_id: "106820ba-5e81-404e-b183-1b86d1ad5a44",
      branch_label: "Sneak to hospital",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "f495d39d-c7e6-4d8e-89ab-7eaa20ff7999",
      from_node_id: "69953413-da57-4fb9-b975-918f6e51cb6e",
      to_node_id: "b0496a39-1626-422b-b158-f41ee7ddaa39",
      branch_label: "Call Leo for help",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "a7b88bd2-5096-49a4-bd27-89e49631872e",
      from_node_id: "528031db-63d9-46aa-b3c2-f85aca7621d3",
      to_node_id: "3a06378a-9970-47b7-a37c-b18275482882",
      branch_label: "Apologize to Lily",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "097bf0b7-8cc2-4f95-a559-63368a72de64",
      from_node_id: "528031db-63d9-46aa-b3c2-f85aca7621d3",
      to_node_id: "7b124b13-3d29-4c38-83ed-cff03062ff8a",
      branch_label: "Faint (fake it)",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "a511746e-fc3f-4d09-b971-b2a296606d21",
      from_node_id: "bd80fea5-984e-4533-a688-335a86393495",
      to_node_id: "c920e08e-7f6e-4053-9cd5-8df59a26f957",
      branch_label: "Apologize coldly",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "f41eb425-3ca5-4f39-8baa-47e153571a9e",
      from_node_id: "bd80fea5-984e-4533-a688-335a86393495",
      to_node_id: "0be9cf2b-a99b-4ab4-b33c-ab2bdd00c8d7",
      branch_label: "Greet Lily calmly",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "13e44f0b-936e-4474-8bc6-602ad1edd14b",
      from_node_id: "106820ba-5e81-404e-b183-1b86d1ad5a44",
      to_node_id: "0eb58774-f84e-46c1-bb94-d37532c5b018",
      branch_label: "Test the water yourself",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "5b4fb1cd-2794-4c0b-ae40-665d62cf6081",
      from_node_id: "106820ba-5e81-404e-b183-1b86d1ad5a44",
      to_node_id: "06db0dd9-869d-4862-bb29-1227b0ca0037",
      branch_label: "Beg Leo to check",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "61389847-b059-4ddd-a861-c57f703d8af9",
      from_node_id: "b0496a39-1626-422b-b158-f41ee7ddaa39",
      to_node_id: "ee2241a8-5ed0-4668-94fb-b24c5c38e935",
      branch_label: "Admit knowing plot",
      branch_type: "choice",
      condition: undefined,
      branch_order: 1,
      created_at: "2025-11-27T21:19:31.000Z",
    },
    {
      id: "0bcf731c-eef6-4fef-89e5-5d3d281eb25f",
      from_node_id: "b0496a39-1626-422b-b158-f41ee7ddaa39",
      to_node_id: "1f810e4f-1842-4e38-a6c2-50a030582391",
      branch_label: "Claim overhead plot",
      branch_type: "choice",
      condition: undefined,
      branch_order: 2,
      created_at: "2025-11-27T21:19:31.000Z",
    },
  ];

  // 将节点分配到对应的层
  nodes.forEach((node) => {
    const layer = layers.find((l) => l.id === node.layer_id);
    if (layer) {
      if (!layer.nodes) {
        layer.nodes = [];
      }
      layer.nodes.push(node);
    }
  });

  // 将分支分配到对应的节点
  branches.forEach((branch) => {
    const node = nodes.find((n) => n.id === branch.from_node_id);
    if (node) {
      if (!node.branches) {
        node.branches = [];
      }
      node.branches.push(branch);
    }
  });

  // 按 node_order 排序每个层的节点
  layers.forEach((layer) => {
    if (layer.nodes) {
      layer.nodes.sort((a, b) => a.node_order - b.node_order);
    }
  });

  return layers;
};

// 生成6个层，金字塔结构的mock数据
// 第1层：1个节点
// 第2层：2个节点（每个节点从第1层分出）
// 第3层：4个节点（每个节点从第2层分出）
// 第4层：8个节点（每个节点从第3层分出）
// 以此类推
export const generateMockLayers = (scriptId: string): Layer[] => {
  const layers: Layer[] = [];
  let nodeIdCounter = 1;
  let branchIdCounter = 1;

  // 存储每层的节点ID，用于创建分支连接
  const layerNodeIds: string[][] = [];

  for (let layerOrder = 1; layerOrder <= 6; layerOrder++) {
    const layerId = `layer-${layerOrder}`;
    const nodes: StoryNode[] = [];

    // 计算当前层的节点数量（金字塔结构：1, 2, 4, 8, 16, 32...）
    const nodeCount = Math.pow(2, layerOrder - 1);

    // 当前层的节点ID数组
    const currentLayerNodeIds: string[] = [];

    // 创建当前层的节点
    for (let nodeOrder = 1; nodeOrder <= nodeCount; nodeOrder++) {
      const nodeId = `node-${nodeIdCounter++}`;
      currentLayerNodeIds.push(nodeId);
      const branches: Branch[] = [];

      // 如果不是最后一层，创建分支连接到下一层的节点
      if (layerOrder < 6) {
        // 下一层的节点数量
        const nextLayerNodeCount = Math.pow(2, layerOrder);
        // 当前节点在层中的索引（从0开始）
        const currentNodeIndex = nodeOrder - 1;
        // 每个节点分出2个分支到下一层
        const startIndex = currentNodeIndex * 2;

        // 创建2个分支
        for (let branchIndex = 0; branchIndex < 2; branchIndex++) {
          const nextNodeIndex = startIndex + branchIndex;
          if (nextNodeIndex < nextLayerNodeCount) {
            // 下一层的节点ID需要预先计算
            // 由于下一层还没创建，我们需要使用公式计算
            const nextLayerStartNodeId = `node-${
              nodeIdCounter + nextNodeIndex
            }`;
            branches.push({
              id: `branch-${branchIdCounter++}`,
              from_node_id: nodeId,
              to_node_id: nextLayerStartNodeId,
              branch_label: branchIndex === 0 ? "选择A" : "选择B",
              branch_type: "choice",
              branch_order: branchIndex + 1,
              created_at: new Date().toISOString(),
            });
          }
        }
      }

      nodes.push({
        id: nodeId,
        layer_id: layerId,
        node_order: nodeOrder,
        title: `第${layerOrder}层 - 节点${nodeOrder}`,
        content: `这是第${layerOrder}层第${nodeOrder}个节点的内容。\n\n这里可以描述场景、对话、动作等详细信息。\n\n点击编辑可以修改此内容。`,
        duration: 30 + (layerOrder - 1) * 10 + nodeOrder * 5,
        metadata: {
          camera_type: layerOrder % 2 === 0 ? "特写" : "全景",
          characters: [`角色${nodeOrder}`],
          scene: `场景${layerOrder}`,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        branches,
      });
    }

    layerNodeIds.push(currentLayerNodeIds);

    layers.push({
      id: layerId,
      script_id: scriptId,
      layer_order: layerOrder,
      title: `第${layerOrder}幕`,
      description: `第${layerOrder}幕的描述信息（${nodeCount}个节点）`,
      is_collapsed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      nodes,
    });
  }

  // 重新处理分支连接，使用实际的节点ID
  layers.forEach((layer, layerIndex) => {
    if (layerIndex < layers.length - 1) {
      const nextLayer = layers[layerIndex + 1];
      const nextNodeIds = layerNodeIds[layerIndex + 1];

      layer.nodes?.forEach((node, nodeIndex) => {
        const branches: Branch[] = [];
        const startIndex = nodeIndex * 2;

        // 每个节点分出2个分支
        for (let branchIndex = 0; branchIndex < 2; branchIndex++) {
          const nextNodeIndex = startIndex + branchIndex;
          if (nextNodeIndex < nextNodeIds.length && nextLayer.nodes) {
            const nextNode = nextLayer.nodes[nextNodeIndex];
            branches.push({
              id: `branch-${branchIdCounter++}`,
              from_node_id: node.id,
              to_node_id: nextNode.id,
              branch_label: branchIndex === 0 ? "选择A" : "选择B",
              branch_type: "choice",
              branch_order: branchIndex + 1,
              created_at: new Date().toISOString(),
            });
          }
        }

        // 更新节点的分支
        node.branches = branches;
      });
    }
  });

  return layers;
};

// 获取剧本的所有层和节点
export const getLayersByScriptId = async (
  scriptId: string
): Promise<Layer[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 如果是故事test11.18的剧本ID，返回真实数据
  if (scriptId === "003ab0f6-a980-49d5-b27b-3dfe49b64ce6") {
    return generateStoryTestLayers(scriptId);
  }

  // 否则返回默认的mock数据
  return generateMockLayers(scriptId);
};

// 获取单个节点
export const getNodeById = async (
  nodeId: string,
  layers: Layer[]
): Promise<StoryNode | null> => {
  for (const layer of layers) {
    const node = layer.nodes?.find((n) => n.id === nodeId);
    if (node) return node;
  }
  return null;
};

// 更新节点内容
export const updateNodeContent = async (
  nodeId: string,
  content: string,
  layers: Layer[],
  title?: string
): Promise<StoryNode | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (const layer of layers) {
    const nodeIndex = layer.nodes?.findIndex((n) => n.id === nodeId);
    if (nodeIndex !== undefined && nodeIndex >= 0 && layer.nodes) {
      layer.nodes[nodeIndex] = {
        ...layer.nodes[nodeIndex],
        content,
        ...(title !== undefined && { title }),
        updated_at: new Date().toISOString(),
      };
      return layer.nodes[nodeIndex];
    }
  }
  return null;
};

// 保存节点位置和所有层数据
export const saveNodePositions = async (
  scriptId: string,
  layers: Layer[]
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // 在实际应用中，这里应该调用 API 保存到数据库
  // 目前只是模拟保存，数据保存在内存中
  console.log("保存节点位置和层数据:", { scriptId, layers });

  // TODO: 实际应该调用 API，例如：
  // await api.post(`/scripts/${scriptId}/layers`, { layers });
};
