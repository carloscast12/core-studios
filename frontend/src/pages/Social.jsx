import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import WhoToFollow from "../components/WhoToFollow";
import ProfileStats from "../components/ProfileStats";
import getCroppedImg from "../utils/cropImage";
import like from "../assets/like.svg";
import sinlike from "../assets/sinlike.svg";
import eliminar from "../assets/eliminar.svg";
import upload from "../assets/upload.svg";

function Social() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [statsKey, setStatsKey] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/posts?page=1&limit=${POSTS_PER_PAGE}`);
        setPosts(res.data);
        setPage(1);
        setHasMore(res.data.length === POSTS_PER_PAGE);
        setLoadError(false);
      } catch (err) {
        console.error(err);
        setLoadError(true);
      }
    };
    fetchPosts();
  }, []);

  const handleCargarMas = async () => {
    try {
      const nextPage = page + 1;
      const res = await api.get(
        `/posts?page=${nextPage}&limit=${POSTS_PER_PAGE}`,
      );
      setPosts((prev) => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(res.data.length === POSTS_PER_PAGE);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar más posts, intenta de nuevo");
    }
  };

  const handleCrearPost = async () => {
    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append("text", newPost);
      newImages.forEach((file) => formData.append("images", file));
      await api.post("/posts", formData);
      setNewPost("");
      setNewImages([]);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setError(null);
      const res = await api.get(`/posts?page=1&limit=${page * POSTS_PER_PAGE}`);
      setPosts(res.data);
      setStatsKey((k) => k + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "El post no puede superar los 120 caracteres",
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleImagesChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRawImage(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleCropComplete = (_, pixels) => {
    setCroppedAreaPixels(pixels);
  };

  const handleConfirmCrop = async () => {
    const blob = await getCroppedImg(rawImage, croppedAreaPixels);
    const croppedFile = new File([blob], "post-image.jpg", { type: "image/jpeg" });
    setNewImages([croppedFile]);
    setPreviewUrl(URL.createObjectURL(blob));
    URL.revokeObjectURL(rawImage);
    setRawImage(null);
  };

  const handleCancelCrop = () => {
    URL.revokeObjectURL(rawImage);
    setRawImage(null);
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setNewImages([]);
    setPreviewUrl(null);
  };

  const handleLike = async (postId) => {
    try {
      await api.put(`/posts/${postId}/like`);
      const res = await api.get(`/posts?page=1&limit=${page * POSTS_PER_PAGE}`);
      setPosts(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el like, intenta de nuevo");
    }
  };

  const handleEliminarPost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
      setStatsKey((k) => k + 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el post, intenta de nuevo");
    }
  };

  const toggleComments = async (postId) => {
    const isOpen = openComments[postId];
    setOpenComments({ ...openComments, [postId]: !isOpen });
    if (!isOpen && !comments[postId]) {
      try {
        const res = await api.get(`/posts/${postId}`);
        setComments((prev) => ({ ...prev, [postId]: res.data.comments }));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los comentarios");
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = (newComment[postId] || "").trim();
    if (!text) return;
    try {
      await api.post(`/comments/${postId}`, { text });
      setNewComment({ ...newComment, [postId]: "" });
      const res = await api.get(`/posts/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data.comments }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo publicar el comentario, intenta de nuevo");
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c._id !== commentId),
      }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el comentario, intenta de nuevo");
    }
  };

  return (
    <div className="social-page">
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "500",
          maxWidth: "940px",
          margin: "0 auto 1.5rem",
          color: "#000000",
        }}
      >
        Feed
      </h1>
      <div className="social-layout">
        <div
          className="social-compose"
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {/* Crear post */}
          <div
            style={{
              background: "transparent",
              borderBottom: "1px solid #e1e1e1",
              padding: "0 0 1rem",
              marginBottom: "3rem",
            }}
          >
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="¿Qué estás trabajando hoy?"
              rows={1}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "14px",
                resize: "none",
                fontFamily: "Montserrat, sans-serif",
                background: "transparent",
                color: "#888",
              }}
            />
            {rawImage && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                    background: "#333",
                    borderRadius: "10px",
                  }}
                >
                  <Cropper
                    image={rawImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{ width: "100%", marginTop: "8px" }}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    onClick={handleConfirmCrop}
                    style={{
                      padding: "6px 14px",
                      background: "#1B35C6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Confirmar recorte
                  </button>
                  <button
                    onClick={handleCancelCrop}
                    style={{
                      padding: "6px 14px",
                      background: "transparent",
                      color: "#666",
                      border: "1px solid #ccc",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {previewUrl && (
              <div style={{ position: "relative", width: "120px", marginTop: "8px" }}>
                <img
                  src={previewUrl}
                  alt=""
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <button
                  onClick={handleRemoveImage}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#1B1F24",
                    color: "#fff",
                    border: "2px solid #fff",
                    fontSize: "12px",
                    lineHeight: 1,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ cursor: "pointer", fontSize: "16px" }}>
                  <img
                    src={upload}
                    alt=""
                    style={{ width: "18px", height: "18px" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagesChange}
                    style={{ display: "none" }}
                  />
                </label>
                <span
                  style={{
                    fontSize: "12px",
                    color: newPost.length > 120 ? "#e24b4a" : "#666",
                  }}
                >
                  {newPost.length}/120
                </span>
              </div>
              <button
                onClick={handleCrearPost}
                disabled={!newPost.trim() || newPost.length > 120 || publishing}
                style={{
                  padding: "6px 16px",
                  background: "#1B35C6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "18px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: publishing ? "default" : "pointer",
                  opacity: publishing ? 0.7 : 1,
                }}
              >
                {publishing ? "Publicando..." : "Publicar"}
              </button>
            </div>
            {error && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#e24b4a",
                  margin: "8px 0 0",
                }}
              >
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="social-sidebar">
          <ProfileStats key={statsKey} />
          <WhoToFollow onFollow={() => setStatsKey((k) => k + 1)} />
        </div>

        <div
          className="social-posts"
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {loadError && (
            <p style={{ fontSize: "13px", color: "#e24b4a" }}>
              No se pudo cargar el feed. Intenta recargar la página.
            </p>
          )}
          {posts.map((post) => (
            <div
              key={post._id}
              style={{
                background: "#ffffff",
                borderRadius: "18px 18px 18px 4px",
                padding: "1rem",
                marginBottom: "1rem",
                maxWidth: "100%",
                boxShadow: "0 4px 20px rgba(50, 50, 50, 0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div
                  onClick={() => navigate(`/profile/${post.user?._id}`)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#1d3a5f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#3b82f6",
                    flexShrink: 0,
                    cursor: "pointer",
                    backgroundImage: post.user?.avatar
                      ? `url(${post.user.avatar})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!post.user?.avatar && post.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    onClick={() => navigate(`/profile/${post.user?._id}`)}
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#1B1F24",
                      cursor: "pointer",
                    }}
                  >
                    {post.user?.name}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginLeft: "8px",
                    }}
                  >
                    {new Date(post.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                {post.user?._id === user?.id && (
                  <span
                    onClick={() => handleEliminarPost(post._id)}
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    <img
                      src={eliminar}
                      alt=""
                      style={{ width: "18px", height: "18px" }}
                    />
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "0 0 10px",
                  color: "#1B1F24",
                }}
              >
                {post.text}
              </p>
              {post.images?.length > 0 && (
                <img
                  src={post.images[0]}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  onClick={() => handleLike(post._id)}
                  style={{ cursor: "pointer", fontSize: "16px" }}
                >
                  {post.likes.includes(user?.id) ? (
                    <img
                      src={like}
                      alt=""
                      style={{ width: "18px", height: "18px" }}
                    />
                  ) : (
                    <img
                      src={sinlike}
                      alt=""
                      style={{ width: "18px", height: "18px" }}
                    />
                  )}
                </span>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {post.likes.length}
                </span>
              </div>

              <div style={{ marginTop: "10px" }}>
                <span
                  onClick={() => toggleComments(post._id)}
                  style={{
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#185FA5",
                    fontWeight: "500",
                  }}
                >
                  {openComments[post._id]
                    ? "Ocultar comentarios"
                    : "Ver comentarios"}
                </span>

                {openComments[post._id] && (
                  <div style={{ marginTop: "10px" }}>
                    {(comments[post._id] || []).map((c) => (
                      <div
                        key={c._id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          onClick={() => navigate(`/profile/${c.user?._id}`)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "#1d3a5f",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "#3b82f6",
                            flexShrink: 0,
                            cursor: "pointer",
                            backgroundImage: c.user?.avatar
                              ? `url(${c.user.avatar})`
                              : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {!c.user?.avatar && c.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span
                            onClick={() => navigate(`/profile/${c.user?._id}`)}
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#1B1F24",
                              cursor: "pointer",
                            }}
                          >
                            {c.user?.name}
                          </span>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#333",
                              margin: "2px 0 0",
                            }}
                          >
                            {c.text}
                          </p>
                        </div>
                        {c.user?._id === user?.id && (
                          <span
                            onClick={() => handleDeleteComment(c._id, post._id)}
                            style={{
                              cursor: "pointer",
                              fontSize: "13px",
                              color: "#888",
                            }}
                          >
                            <img
                              src={eliminar}
                              alt=""
                              style={{ width: "18px", height: "18px" }}
                            />
                          </span>
                        )}
                      </div>
                    ))}

                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                    >
                      <input
                        value={newComment[post._id] || ""}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            [post._id]: e.target.value,
                          })
                        }
                        placeholder="Escribe un comentario..."
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          borderRadius: "14px",
                          border: "0.5px solid #ccc",
                          fontSize: "13px",
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        style={{
                          padding: "6px 14px",
                          background: "#1B35C6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "14px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={handleCargarMas}
              style={{
                display: "block",
                margin: "0 auto",
                padding: "8px 20px",
                background: "transparent",
                color: "#1B35C6",
                border: "1px solid #1B35C6",
                borderRadius: "18px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cargar más
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Social;
