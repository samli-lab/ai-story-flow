// Mock 剧本数据
import { Script } from '../../types/script';

export const mockScripts: Script[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: '科幻短剧：时间旅行者',
    description: '一个关于时间旅行的科幻故事',
    outline: '一位科学家发明了时间机器，但在第一次使用时发现了时间旅行的危险后果...',
    world_setting: {
      era: '未来',
      location: '地球',
      main_characters: ['科学家', '助手', '时间守护者'],
      theme: '科幻、冒险',
    },
    status: 'editing',
    is_auto_generated: false,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:20:00Z',
    tags: [
      { id: 'tag-1', script_id: '1', tag_name: '科幻', color: '#1890ff', created_at: '2024-01-15T10:30:00Z' },
      { id: 'tag-2', script_id: '1', tag_name: '冒险', color: '#52c41a', created_at: '2024-01-15T10:30:00Z' },
    ],
  },
  {
    id: '2',
    user_id: 'user-1',
    title: '悬疑剧：消失的线索',
    description: '一个关于失踪案件的悬疑故事',
    outline: '一名侦探调查一起神秘的失踪案，随着调查深入，发现了更多隐藏的秘密...',
    world_setting: {
      era: '现代',
      location: '都市',
      main_characters: ['侦探', '失踪者', '嫌疑人'],
      theme: '悬疑、推理',
    },
    status: 'draft',
    is_auto_generated: true,
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-18T09:15:00Z',
    tags: [
      { id: 'tag-3', script_id: '2', tag_name: '悬疑', color: '#722ed1', created_at: '2024-01-18T09:15:00Z' },
      { id: 'tag-4', script_id: '2', tag_name: '推理', color: '#eb2f96', created_at: '2024-01-18T09:15:00Z' },
    ],
  },
  {
    id: '3',
    user_id: 'user-1',
    title: '爱情剧：重逢',
    description: '一个关于重逢的爱情故事',
    outline: '两个高中时代的恋人，在十年后意外重逢，但各自都有了新的生活...',
    world_setting: {
      era: '现代',
      location: '城市',
      main_characters: ['男主角', '女主角', '现任'],
      theme: '爱情、成长',
    },
    status: 'completed',
    is_auto_generated: false,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-25T16:45:00Z',
    tags: [
      { id: 'tag-5', script_id: '3', tag_name: '爱情', color: '#f5222d', created_at: '2024-01-10T08:00:00Z' },
    ],
  },
  {
    id: '4',
    user_id: 'user-1',
    title: '古装剧：江湖恩怨',
    description: '一个关于江湖恩怨的武侠故事',
    outline: '一位年轻的剑客为了复仇踏入江湖，却发现了更大的阴谋...',
    world_setting: {
      era: '古代',
      location: '江湖',
      main_characters: ['剑客', '仇人', '师父'],
      theme: '武侠、复仇',
    },
    status: 'editing',
    is_auto_generated: false,
    created_at: '2024-01-22T11:20:00Z',
    updated_at: '2024-01-23T10:30:00Z',
    tags: [
      { id: 'tag-6', script_id: '4', tag_name: '武侠', color: '#fa8c16', created_at: '2024-01-22T11:20:00Z' },
      { id: 'tag-7', script_id: '4', tag_name: '古装', color: '#13c2c2', created_at: '2024-01-22T11:20:00Z' },
    ],
  },
  {
    id: '5',
    user_id: 'user-1',
    title: '恐怖剧：废弃医院',
    description: '一个关于废弃医院的恐怖故事',
    outline: '一群年轻人探索一座废弃的医院，却发现了医院中隐藏的恐怖秘密...',
    world_setting: {
      era: '现代',
      location: '废弃医院',
      main_characters: ['探险者1', '探险者2', '神秘存在'],
      theme: '恐怖、悬疑',
    },
    status: 'archived',
    is_auto_generated: false,
    created_at: '2024-01-05T15:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
    tags: [
      { id: 'tag-8', script_id: '5', tag_name: '恐怖', color: '#000000', created_at: '2024-01-05T15:00:00Z' },
    ],
  },
  {
    id: '003ab0f6-a980-49d5-b27b-3dfe49b64ce6',
    user_id: 'user-1',
    title: '故事test11.18 - 分支',
    description: '从 CSV 导入的分支故事',
    outline: undefined,
    world_setting: undefined,
    status: 'draft',
    is_auto_generated: false,
    created_at: '2025-11-27T21:19:31.000Z',
    updated_at: '2025-11-27T21:19:31.000Z',
    tags: [],
  },
];

// 模拟延迟
export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

