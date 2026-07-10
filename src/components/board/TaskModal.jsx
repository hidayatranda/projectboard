import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Trash2, GitBranch, Loader2, Send, MessageCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { Input, Textarea, Select } from "../ui/Input";
import { PRIORITIES, relativeTime } from "../../lib/utils";
import { getTaskComments, addTaskComment } from "../../lib/mockComments";

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const empty = (columnId) => ({
  title: "",
  description: "",
  priority: "medium",
  due_date: "",
  assignee_id: "",
  column_id: columnId || "",
});

const TaskModal = ({ open, onClose, task, defaultColumnId, columns, members, actions, onBreakdown, currentUser }) => {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(empty(defaultColumnId));
  const [saving, setSaving] = useState(false);
  const [breakingDown, setBreakingDown] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (open && task) {
      setComments(getTaskComments(task.id));
    }
  }, [open, task]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        due_date: toDateInput(task.due_date),
        assignee_id: task.assignee_id || "",
        column_id: task.column_id,
      });
    } else {
      setForm(empty(defaultColumnId || columns[0]?.id));
    }
  }, [open, task, defaultColumnId, columns]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      due_date: form.due_date || null,
      assignee_id: form.assignee_id || null,
    };
    try {
      if (isEdit) {
        await actions.updateTask(task.id, payload);
        toast.success("Task updated");
      } else {
        await actions.createTask({ ...payload, column_id: form.column_id });
        toast.success("Task created");
      }
      onClose();
    } catch {
      /* handled in hook */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await actions.deleteTask(task.id);
    onClose();
  };

  const handleBreakdown = async () => {
    setBreakingDown(true);
    try {
      await onBreakdown(task);
    } finally {
      setBreakingDown(false);
    }
  };

  const handleAddComment = () => {
    if (!comment.trim() || !currentUser) return;
    const newComment = addTaskComment(task.id, currentUser.id, currentUser.name, comment);
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit task" : "New task"} size="lg">
      <div className="flex flex-col sm:flex-row gap-6 max-h-[80vh] overflow-y-auto">
        {/* Main form */}
        <form onSubmit={onSubmit} className="flex-1 space-y-4">
          <Input label="Title" placeholder="What needs to be done?" autoFocus value={form.title} onChange={set("title")} />
          <Textarea label="Description" rows={4} placeholder="Add more detail…" value={form.description} onChange={set("description")} />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" value={form.priority} onChange={set("priority")}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
            <Input label="Due date" type="date" value={form.due_date} onChange={set("due_date")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Assignee" value={form.assignee_id} onChange={set("assignee_id")}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
            {!isEdit && (
              <Select label="Column" value={form.column_id} onChange={set("column_id")}>
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </Select>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t">
            <div>
              {isEdit && (
                <Button type="button" variant="ghost" onClick={handleDelete} className="text-priority-urgent">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {isEdit && (
                <Button type="button" variant="outline" onClick={handleBreakdown} disabled={breakingDown}>
                  {breakingDown ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
                  AI breakdown
                </Button>
              )}
              <Button type="submit" loading={saving}>{isEdit ? "Save" : "Create task"}</Button>
            </div>
          </div>
        </form>

        {/* Comments section */}
        {isEdit && (
          <div className="w-full sm:w-80 border-t sm:border-l sm:border-t-0 sm:pl-6 pt-6 sm:pt-0">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-4 w-4 text-muted" />
              <h3 className="font-semibold text-sm">Comments ({comments.length})</h3>
            </div>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-xs text-faint text-center py-6">No comments yet</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.author_name} id={c.author_id} size="xs" />
                      <span className="font-semibold text-ink">{c.author_name}</span>
                      <span className="text-faint">{relativeTime(c.created_at)}</span>
                    </div>
                    <p className="text-muted ml-5">{c.text}</p>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment input */}
            <div className="flex gap-2 items-end">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment..."
                rows={2}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskModal;
