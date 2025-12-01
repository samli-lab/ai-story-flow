
export const generateStoryNode = async (context: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`我穿进书里第一天，男主就想掐死我。窒息感让我眼前发黑，这是什么年度最差员工，刚入职就要被老板送走？

冰冷的机械音在我脑子里响起。

【系统提示：男主好感度-100%，生命值-10%，任务目标：活到大结局。】

掐着我脖子的男人，也就是本书男主戴米安·布莱克伍德，面无表情地看着我，那张俊美如神祇的脸上满是厌恶。
我反而奇异地冷静下来，社畜的专业素养让我开始思考破局之法。

“伊莎贝拉，你真该死。”

他的手臂还在收紧，我的肺里已经没有一丝空气。不行，不能就这么死了。求饶没用，我看着他近在咫尺的脸，决定搏一把。
<options>
1. Kiss him to survive
2. Bite his hand hard
</options>`);
    }, 1000);
  });
};

