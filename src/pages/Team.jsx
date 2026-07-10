import { useState } from "react";
import { Mail, Plus, Trash2, Shield, User, Clock } from "lucide-react";
import toast from "react-hot-toast";
import Topbar from "../components/layout/Topbar";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import { relativeTime } from "../lib/utils";

const TEAM_MEMBERS = [
  {
    id: "u-alex",
    name: "Alex Rivera",
    email: "alex@timetoprogram.com",
    role: "admin",
    joined_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    status: "active",
  },
  {
    id: "u-maya",
    name: "Maya Chen",
    email: "maya@timetoprogram.com",
    role: "member",
    joined_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    status: "active",
  },
  {
    id: "u-diego",
    name: "Diego Santos",
    email: "diego@timetoprogram.com",
    role: "member",
    joined_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    status: "active",
  },
  {
    id: "u-priya",
    name: "Priya Nair",
    email: "priya@timetoprogram.com",
    role: "member",
    joined_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    status: "active",
  },
  {
    id: "u-sam",
    name: "Sam Okafor",
    email: "sam@timetoprogram.com",
    role: "member",
    joined_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    status: "inactive",
  },
];

const RoleSelect = ({ value, onChange, disabled = false }) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
  >
    <option value="admin">Admin</option>
    <option value="member">Member</option>
    <option value="viewer">Viewer</option>
  </select>
);

const MemberCard = ({ member, onRemove, onRoleChange, isCurrentUser }) => (
  <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:shadow-[var(--shadow-soft)]">
    <div className="flex items-center gap-3">
      <Avatar name={member.name} id={member.id} size="md" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-ink">{member.name}</h3>
          {isCurrentUser && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700">
              You
            </span>
          )}
          {member.status === "active" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
            </span>
          ) : (
            <span className="rounded-full bg-gray-500/10 px-2 py-0.5 text-xs font-medium text-gray-600">
              Inactive
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Mail className="h-3 w-3" />
          {member.email}
        </div>
        <div className="flex items-center gap-2 text-xs text-faint mt-1">
          <Clock className="h-3 w-3" />
          Joined {relativeTime(member.joined_at)}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <RoleSelect
        value={member.role}
        onChange={(e) => {
          onRoleChange(member.id, e.target.value);
          toast.success(`${member.name}'s role updated`);
        }}
        disabled={isCurrentUser}
      />
      {!isCurrentUser && (
        <button
          onClick={() => {
            if (window.confirm(`Remove ${member.name} from the team?`)) {
              onRemove(member.id);
              toast.success(`${member.name} removed from team`);
            }
          }}
          className="flex items-center justify-center h-10 w-10 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

const Team = () => {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    if (members.some((m) => m.email === inviteEmail)) {
      toast.error("This person is already on your team");
      return;
    }

    const newMember = {
      id: `u-${Math.random().toString(36).slice(2, 9)}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "member",
      joined_at: new Date().toISOString(),
      status: "pending",
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
    setShowInviteForm(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRemove = (memberId) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleRoleChange = (memberId, newRole) => {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const activeCount = members.filter((m) => m.status === "active").length;
  const adminCount = members.filter((m) => m.role === "admin").length;

  return (
    <>
      <Topbar title="Team" subtitle="Manage workspace members and permissions" />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with stats */}
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs font-semibold text-faint uppercase tracking-wide">Total Members</p>
                <p className="mt-2 text-2xl font-bold text-ink">{members.length}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs font-semibold text-faint uppercase tracking-wide">Active Now</p>
                <p className="mt-2 text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs font-semibold text-faint uppercase tracking-wide">Admins</p>
                <p className="mt-2 text-2xl font-bold text-blue-600">{adminCount}</p>
              </div>
            </div>
          </div>

          {/* Invite section */}
          <div className="mb-8">
            {!showInviteForm ? (
              <Button onClick={() => setShowInviteForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Invite Team Member
              </Button>
            ) : (
              <form onSubmit={handleInvite} className="space-y-3 rounded-xl border border-line bg-surface-2 p-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="flex-1 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
                    autoFocus
                  />
                  <Button type="submit">Send Invite</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Members list */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-ink">Team Members</h2>
            <div className="space-y-2">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onRemove={handleRemove}
                  onRoleChange={handleRoleChange}
                  isCurrentUser={member.id === "u-alex"}
                />
              ))}
            </div>
          </div>

          {/* Roles info */}
          <div className="mt-12 rounded-xl border border-line bg-surface-2 p-6">
            <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role Permissions
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-ink">Admin</p>
                  <p className="text-xs text-muted">Full access to all boards and team settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-ink">Member</p>
                  <p className="text-xs text-muted">Can create and edit boards, manage tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-500/10 p-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-ink">Viewer</p>
                  <p className="text-xs text-muted">Can view boards and tasks, no editing rights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
