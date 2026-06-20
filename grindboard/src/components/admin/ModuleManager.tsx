"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ModuleManager({ initialModules }: { initialModules: any[] }) {
  const router = useRouter();
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newMaterial, setNewMaterial] = useState({ title: "", url: "", type: "LINK", topicId: "" });

  const handleAddTopic = async (moduleId: string) => {
    if (!newTopicName.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, name: newTopicName }),
      });
      setNewTopicName("");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (topicId: string) => {
    if (!newMaterial.title.trim() || !newMaterial.url.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          title: newMaterial.title,
          url: newMaterial.url,
          type: newMaterial.type,
        }),
      });
      setNewMaterial({ title: "", url: "", type: "LINK", topicId: "" });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Delete this path?")) return;
    setLoading(true);
    await fetch(`/api/admin/topics?id=${topicId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("Delete this material?")) return;
    setLoading(true);
    await fetch(`/api/admin/materials?id=${materialId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {initialModules.length === 0 ? (
        <div className="text-center py-4 text-on-surface-variant font-label-mono text-xs">No modules found</div>
      ) : (
        initialModules.map((mod) => (
          <div key={mod.id} className="border border-outline rounded-lg overflow-hidden bg-surface">
            {/* Module Header */}
            <div 
              className="p-3 flex justify-between items-center cursor-pointer hover:bg-surface-container transition-colors"
              onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
            >
              <div className="flex items-center gap-2 font-medium text-on-background">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mod.color || "#10B981" }} />
                {mod.name}
              </div>
              <div className="text-xs text-on-surface-variant font-label-mono flex gap-4">
                <span>{mod.topics?.length || 0} Paths</span>
                <span>{mod.enrolled || 0} Enrolled</span>
                <span className="material-symbols-outlined text-sm">
                  {expandedModuleId === mod.id ? "expand_less" : "expand_more"}
                </span>
              </div>
            </div>

            {/* Expanded Content: Topics & Materials */}
            {expandedModuleId === mod.id && (
              <div className="p-4 bg-surface-container-low border-t border-outline space-y-6">
                
                {/* Topic List */}
                <div className="space-y-4">
                  {mod.topics?.map((topic: any) => (
                    <div key={topic.id} className="border border-outline rounded p-3 bg-surface">
                      <div className="flex justify-between items-center border-b border-outline pb-2 mb-2">
                        <h4 className="font-medium text-sm text-on-background">{topic.name}</h4>
                        <button onClick={() => handleDeleteTopic(topic.id)} className="text-[#EF4444] hover:text-[#EF4444]/80 text-xs">Delete Path</button>
                      </div>
                      
                      {/* Materials List */}
                      <div className="space-y-2 mb-3">
                        {topic.materials?.length === 0 ? (
                          <div className="text-xs text-on-surface-variant italic">No materials yet.</div>
                        ) : (
                          topic.materials?.map((mat: any) => (
                            <div key={mat.id} className="flex justify-between items-center bg-surface-container p-2 rounded text-xs">
                              <a href={mat.url} target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">link</span>
                                [{mat.type}] {mat.title}
                              </a>
                              <button onClick={() => handleDeleteMaterial(mat.id)} className="text-[#EF4444] hover:text-[#EF4444]/80">
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Material Inline Form */}
                      <div className="flex flex-col md:flex-row gap-2 mt-3 pt-3 border-t border-outline">
                        <input
                          type="text"
                          placeholder="Material Title"
                          className="flex-1 border border-outline rounded-lg px-3 py-1.5 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs transition-all"
                          value={newMaterial.topicId === topic.id ? newMaterial.title : ""}
                          onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value, topicId: topic.id })}
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          className="flex-1 border border-outline rounded-lg px-3 py-1.5 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs transition-all"
                          value={newMaterial.topicId === topic.id ? newMaterial.url : ""}
                          onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value, topicId: topic.id })}
                        />
                        <div className="flex gap-2">
                          <select
                            className="border border-outline rounded-lg px-3 py-1.5 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-xs transition-all"
                            value={newMaterial.topicId === topic.id ? newMaterial.type : "LINK"}
                            onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value, topicId: topic.id })}
                          >
                            <option value="LINK">Link</option>
                            <option value="YOUTUBE">YouTube</option>
                            <option value="PDF">PDF</option>
                          </select>
                          <button 
                            disabled={loading || newMaterial.topicId !== topic.id}
                            onClick={() => handleAddMaterial(topic.id)}
                            className="bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-[#059669] disabled:opacity-50 text-xs font-medium whitespace-nowrap transition-colors"
                          >
                            Add Material
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Topic Inline Form */}
                <div className="flex flex-col md:flex-row gap-2 text-sm border-t border-outline pt-4">
                  <input
                    type="text"
                    placeholder="New Path (Topic) Name"
                    className="flex-1 border border-outline rounded-lg px-4 py-2 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                  />
                  <button 
                    disabled={loading || !newTopicName}
                    onClick={() => handleAddTopic(mod.id)}
                    className="bg-surface-container-highest border border-outline px-6 py-2 rounded-lg hover:border-primary text-on-background transition-colors disabled:opacity-50 font-medium"
                  >
                    Add Path
                  </button>
                </div>

              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
