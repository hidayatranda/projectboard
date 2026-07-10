const DAY = 86400000;
const iso = (offsetDays = 0) => new Date(Date.now() + offsetDays * DAY).toISOString();
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const TASK_COMMENTS = {
  "b-roadmap-t-0": [
    {
      id: "c-1",
      task_id: "b-roadmap-t-0",
      author_id: "u-maya",
      author_name: "Maya Chen",
      author_email: "maya@timetoprogram.com",
      author_avatar: null,
      text: "I've started researching the Q3 priorities. Should we align on this during the next sync?",
      created_at: iso(-2),
      updated_at: iso(-2),
    },
    {
      id: "c-2",
      task_id: "b-roadmap-t-0",
      author_id: "u-alex",
      author_name: "Alex Rivera",
      author_email: "alex@timetoprogram.com",
      author_avatar: null,
      text: "Yes! Let's schedule a 30-min sync this week to discuss. I'll send a calendar invite.",
      created_at: iso(-1.5),
      updated_at: iso(-1.5),
    },
  ],
  "b-roadmap-t-2": [
    {
      id: "c-3",
      task_id: "b-roadmap-t-2",
      author_id: "u-diego",
      author_name: "Diego Santos",
      author_email: "diego@timetoprogram.com",
      author_avatar: null,
      text: "Completed the synthesis from the last 5 interviews. Summary doc is linked in the drive.",
      created_at: iso(-0.5),
      updated_at: iso(-0.5),
    },
  ],
};

export const getTaskComments = (taskId) => {
  return (TASK_COMMENTS[taskId] || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};

export const addTaskComment = (taskId, authorId, authorName, text) => {
  const comment = {
    id: uid("c"),
    task_id: taskId,
    author_id: authorId,
    author_name: authorName,
    author_email: `${authorName.toLowerCase().replace(/\s+/g, ".")}@timetoprogram.com`,
    author_avatar: null,
    text,
    created_at: iso(),
    updated_at: iso(),
  };

  if (!TASK_COMMENTS[taskId]) TASK_COMMENTS[taskId] = [];
  TASK_COMMENTS[taskId].push(comment);
  return comment;
};

export const ACTIVITY_EVENTS = [
  {
    id: "a-1",
    type: "task_created",
    task_id: "b-roadmap-t-0",
    task_title: "Define Q3 OKRs",
    user_id: "u-alex",
    user_name: "Alex Rivera",
    created_at: iso(-10),
  },
  {
    id: "a-2",
    type: "task_assigned",
    task_id: "b-roadmap-t-0",
    task_title: "Define Q3 OKRs",
    user_id: "u-alex",
    user_name: "Alex Rivera",
    assignee_id: "u-maya",
    assignee_name: "Maya Chen",
    created_at: iso(-9),
  },
  {
    id: "a-3",
    type: "task_moved",
    task_id: "b-roadmap-t-0",
    task_title: "Define Q3 OKRs",
    user_id: "u-maya",
    user_name: "Maya Chen",
    from_column: "Todo",
    to_column: "In Progress",
    created_at: iso(-3),
  },
  {
    id: "a-4",
    type: "task_updated",
    task_id: "b-roadmap-t-1",
    task_title: "Prioritize backlog",
    user_id: "u-diego",
    user_name: "Diego Santos",
    changes: "priority changed to high",
    created_at: iso(-1),
  },
];

export const getBoardActivity = (boardId, limit = 20) => {
  return ACTIVITY_EVENTS.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
};
