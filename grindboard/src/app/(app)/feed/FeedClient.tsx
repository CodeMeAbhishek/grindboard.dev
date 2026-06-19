"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
    cfRating: number | null;
    lcRating: number | null;
    cfRank: string | null;
    lcBadge: string | null;
  };
  likes: { userId: string }[];
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  user: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
}

interface FeedClientProps {
  currentUserId: string;
  currentUserAvatar: string | null;
  currentUserName: string;
}

export function FeedClient({ currentUserId, currentUserAvatar, currentUserName }: FeedClientProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    fetchPosts();

    const supabase = createClient();
    const channel = supabase.channel("public-feed");

    channel.on("broadcast", { event: "new_post" }, (payload) => {
      setPosts(current => [payload.payload, ...current]);
    });

    channel.on("broadcast", { event: "new_like" }, (payload) => {
      const { postId, userId, liked } = payload.payload;
      setPosts(current => current.map(p => {
        if (p.id === postId) {
          const hasLiked = p.likes.some(l => l.userId === userId);
          if (liked && !hasLiked) return { ...p, likes: [...p.likes, { userId }] };
          if (!liked && hasLiked) return { ...p, likes: p.likes.filter(l => l.userId !== userId) };
        }
        return p;
      }));
    });

    channel.on("broadcast", { event: "new_comment" }, (payload) => {
      const { postId, comment } = payload.payload;
      setPosts(current => current.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, comment] };
        }
        return p;
      }));
    });

    channel.on("broadcast", { event: "delete_post" }, (payload) => {
      setPosts(current => current.filter(p => p.id !== payload.payload.postId));
    });

    channel.on("broadcast", { event: "delete_comment" }, (payload) => {
      const { postId, commentId } = payload.payload;
      setPosts(current => current.map(p => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
        }
        return p;
      }));
    });

    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/feed");
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent }),
      });
      if (res.ok) {
        const post = await res.json();
        const supabase = createClient();
        supabase.channel("public-feed").send({ type: "broadcast", event: "new_post", payload: post });
        // Optimistically add locally as well, or just let the broadcast receiver handle it.
        // Actually, the sender also receives its own broadcast? No, Supabase Broadcast by default does not send back to sender unless configured.
        setPosts([post, ...posts]);
        setNewPostContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/feed/${postId}/like`, { method: "POST" });
      if (res.ok) {
        const { liked, notification } = await res.json();
        const supabase = createClient();
        supabase.channel("public-feed").send({ type: "broadcast", event: "new_like", payload: { postId, userId: currentUserId, liked } });
        if (notification) {
          supabase.channel("public-feed").send({ type: "broadcast", event: "new_notification", payload: notification });
        }
        
        setPosts(posts.map(p => {
          if (p.id === postId) {
            const hasLiked = p.likes.some(l => l.userId === currentUserId);
            if (liked && !hasLiked) return { ...p, likes: [...p.likes, { userId: currentUserId }] };
            if (!liked && hasLiked) return { ...p, likes: p.likes.filter(l => l.userId !== currentUserId) };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/feed/${postId}`, { method: "DELETE" });
      if (res.ok) {
        const supabase = createClient();
        supabase.channel("public-feed").send({ type: "broadcast", event: "delete_post", payload: { postId } });
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;
    const parentId = replyingTo[postId];
    try {
      const res = await fetch(`/api/feed/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });
      if (res.ok) {
        const { comment, notification } = await res.json();
        const supabase = createClient();
        supabase.channel("public-feed").send({ type: "broadcast", event: "new_comment", payload: { postId, comment } });
        if (notification) {
          supabase.channel("public-feed").send({ type: "broadcast", event: "new_notification", payload: notification });
        }

        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...p.comments, comment] };
          }
          return p;
        }));
        setCommentInputs({ ...commentInputs, [postId]: "" });
        setReplyingTo({ ...replyingTo, [postId]: undefined });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`/api/feed/${postId}/comment?commentId=${commentId}`, { method: "DELETE" });
      if (res.ok) {
        const supabase = createClient();
        supabase.channel("public-feed").send({ type: "broadcast", event: "delete_comment", payload: { postId, commentId } });
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-label-mono">Loading feed...</div>;
  }

  const renderComment = (comment: Comment, allComments: Comment[], postId: string, depth: number = 0) => {
    const children = allComments.filter(c => c.parentId === comment.id);
    return (
      <div key={comment.id} className="w-full">
        <div className={`group flex gap-2 text-sm bg-surface-container rounded-lg p-2 relative ${depth > 0 ? "mt-1 border-l-2 border-primary/20" : ""}`} style={{ marginLeft: depth > 0 ? `${Math.min(depth * 16, 48)}px` : '0px' }}>
          <div className="font-bold text-on-background shrink-0">{comment.user.name}:</div>
          <div className="text-on-background flex-1 pr-10">{comment.content}</div>
          
          <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setReplyingTo({ ...replyingTo, [postId]: comment.id })}
              className="text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-[14px]">reply</span>
            </button>
            {comment.user.id === currentUserId && (
              <button 
                onClick={() => handleDeleteComment(postId, comment.id)}
                className="text-on-surface-variant hover:text-red-500"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
              </button>
            )}
          </div>
        </div>
        {children.length > 0 && (
          <div className="w-full">
            {children.map(child => renderComment(child, allComments, postId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="bg-surface border border-outline rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          {currentUserAvatar ? (
            <img src={currentUserAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-outline" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {currentUserName[0]}
            </div>
          )}
          <div className="flex-1 pt-1">
            <textarea
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-background placeholder:text-on-surface-variant resize-none text-base p-2 leading-relaxed"
              placeholder="What's on your mind? Share your progress..."
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex justify-end mt-3 pt-3 border-t border-outline">
              <button
                onClick={handlePost}
                disabled={submitting || !newPostContent.trim()}
                className="bg-primary text-green-950 px-5 py-2 rounded-full font-label-mono font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => {
          const isAuthor = post.user.id === currentUserId;
          const hasLiked = post.likes.some(l => l.userId === currentUserId);
          return (
            <div key={post.id} className="bg-surface border border-outline rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  {post.user.avatarUrl ? (
                    <img src={post.user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-outline" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {post.user.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-on-background flex items-center gap-2 flex-wrap">
                      {post.user.name}
                      {post.user.cfRating && (
                        <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-sm font-label-mono capitalize">
                          CF: {post.user.cfRank || 'Unrated'} ({post.user.cfRating})
                        </span>
                      )}
                      {post.user.lcRating && (
                        <span className="text-[10px] bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded-sm font-label-mono capitalize">
                          LC{post.user.lcBadge ? `: ${post.user.lcBadge}` : ''} ({Math.round(post.user.lcRating)})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-on-surface-variant font-label-mono">
                      {post.user.username && `@${post.user.username} • `}
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                {isAuthor && (
                  <button onClick={() => handleDelete(post.id)} className="text-on-surface-variant hover:text-red-500">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
              
              <p className="text-on-background whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex items-center gap-4 text-on-surface-variant pt-2">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 text-sm font-label-mono transition-colors ${hasLiked ? "text-red-500" : "hover:text-red-500"}`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  {post.likes.length}
                </button>
                <button className="flex items-center gap-1 text-sm font-label-mono hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  {post.comments.length}
                </button>
              </div>

              {post.comments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-outline/50 flex flex-col items-start w-full">
                  {post.comments.filter(c => !c.parentId).map(comment => renderComment(comment, post.comments, post.id, 0))}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {replyingTo[post.id] && (
                  <div className="flex items-center justify-between bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    <span>Replying to {post.comments.find(c => c.id === replyingTo[post.id])?.user.name}</span>
                    <button onClick={() => setReplyingTo({ ...replyingTo, [post.id]: undefined })} className="hover:text-red-500">
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-1 bg-surface-container text-on-background placeholder:text-on-surface-variant border-none rounded-lg py-1.5 px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleComment(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    disabled={!commentInputs[post.id]?.trim()}
                    className="text-primary disabled:opacity-50 px-2"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="text-center text-on-surface-variant font-label-mono py-12">
            No posts yet. Be the first to share something!
          </div>
        )}
      </div>
    </div>
  );
}
