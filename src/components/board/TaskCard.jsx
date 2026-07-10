import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageCircle, Check } from "lucide-react";
import Avatar from "../ui/Avatar";
import { PriorityTag } from "../ui/Badge";
import { Label } from "../ui/Label";
import { cn, formatDueDate } from "../../lib/utils";
import { getTaskComments } from "../../lib/mockComments";

const TaskCard = ({ task, onClick, overlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = { transform: CSS.Translate.toString(transform), transition };
  const due = formatDueDate(task.due_date);
  const comments = getTaskComments(task.id);
  const isCompleted = task.status === "completed";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onClick?.(task)}
      className={cn(
        "group cursor-grab rounded-2xl border border-line bg-surface p-4 active:cursor-grabbing",
        "shadow-[var(--shadow-card)] transition-all duration-200",
        "hover:shadow-[var(--shadow-soft)] hover:border-line/60",
        isDragging && "opacity-40",
        overlay && "rotate-2 cursor-grabbing shadow-[var(--shadow-lift)]",
        isCompleted && "opacity-75 bg-surface/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <PriorityTag priority={task.priority} />
            {isCompleted && (
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500/10">
                <Check className="h-3 w-3 text-green-600" />
              </div>
            )}
          </div>

          <p className={cn(
            "mt-2.5 text-[15px] font-semibold leading-snug tracking-tight",
            isCompleted ? "text-muted line-through" : "text-ink"
          )}>
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
              {task.description}
            </p>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <Label key={label} text={label} variant="light" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 space-y-2.5">
        {/* Due date */}
        {due && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-faint" />
            <span
              className={cn(
                "text-[12px] font-medium",
                due.overdue ? "text-priority-urgent" : "text-muted"
              )}
            >
              {due.label}
            </span>
          </div>
        )}

        {/* Assignee & Comments */}
        <div className="flex items-center justify-between">
          {task.assignee_id ? (
            <div className="flex items-center gap-1.5">
              <Avatar name={task.assignee_name} id={task.assignee_id} src={task.assignee_avatar} size="xs" />
              <span className="max-w-[7rem] truncate text-[11px] text-muted">{task.assignee_name}</span>
            </div>
          ) : (
            <span className="text-[11px] text-faint">Unassigned</span>
          )}

          {comments.length > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5">
              <MessageCircle className="h-3 w-3 text-muted" />
              <span className="text-[11px] font-medium text-muted">{comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
