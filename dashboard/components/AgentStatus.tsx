interface AgentStatus {
  agentName: string;
  status: 'idle' | 'working' | 'error';
  currentTask: string;
  lastUpdate: string;
}

interface AgentStatusProps {
  agents: AgentStatus[];
}

export default function AgentStatusPanel({ agents }: AgentStatusProps) {
  const statusIcons: Record<string, string> = {
    idle: '⚪',
    working: '🔄',
    error: '❌',
  };

  const statusColors: Record<string, string> = {
    idle: 'text-gray-400',
    working: 'text-blue-500',
    error: 'text-red-500',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-bold mb-4">Agent Activity</h3>
      {agents.length === 0 ? (
        <p className="text-gray-500">No agents active.</p>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.agentName} className="flex items-center space-x-3">
              <span className={`text-lg ${statusColors[agent.status]} ${agent.status === 'working' ? 'animate-spin' : ''}`}>
                {statusIcons[agent.status]}
              </span>
              <div className="flex-1">
                <span className="font-medium text-sm">{agent.agentName.replace('Agent', '')}</span>
                <p className="text-xs text-gray-500">{agent.currentTask}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(agent.lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
