import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import eliminar from "../assets/eliminar.svg";
import { fadeInUp, staggerDelay } from "../utils/motionVariants";

const POSTS_PER_PAGE = 5;

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: authUser, login, token } = useAuth();
  const isOwnProfile = authUser?.id === userId;

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [listView, setListView] = useState(null); // null | "followers" | "following"
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    instagram: "",
    soundcloud: "",
  });
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, statsRes, postsRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/users/${userId}/stats`),
          api.get(`/posts?user=${userId}&page=1&limit=${POSTS_PER_PAGE}`),
        ]);
        setProfile(profileRes.data);
        setForm({
          name: profileRes.data.name || "",
          bio: profileRes.data.bio || "",
          instagram: profileRes.data.socialLinks?.instagram || "",
          soundcloud: profileRes.data.socialLinks?.soundcloud || "",
        });
        setStats(statsRes.data);
        setPosts(postsRes.data);
        setPage(1);
        setHasMore(postsRes.data.length === POSTS_PER_PAGE);
        setLoadError(false);
      } catch (err) {
        console.error(err);
        setLoadError(true);
      }
    };
    fetchAll();
  }, [userId]);

  const handleCargarMas = async () => {
    try {
      const nextPage = page + 1;
      const res = await api.get(
        `/posts?user=${userId}&page=${nextPage}&limit=${POSTS_PER_PAGE}`,
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

  const handleEliminarPost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setStats((prev) => ({ ...prev, posts: prev.posts - 1 }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el post, intenta de nuevo");
    }
  };

  const handleEliminarUsuario = async () => {
    if (!window.confirm(`¿Eliminar a ${profile.name}? Esto borrará también sus posts, comentarios, reservas y follows. No se puede deshacer.`)) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      navigate("/social");
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el usuario, intenta de nuevo");
    }
  };

  const handleShowFollowers = async () => {
    if (listView === "followers") {
      setListView(null);
      return;
    }
    try {
      const res = await api.get(`/users/${userId}/followers`);
      setFollowers(res.data);
      setListView("followers");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de seguidores");
    }
  };

  const handleShowFollowing = async () => {
    if (listView === "following") {
      setListView(null);
      return;
    }
    try {
      const res = await api.get(`/users/${userId}/following`);
      setFollowing(res.data);
      setListView("following");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la lista de seguidos");
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await api.delete(`/follows/${targetUserId}`);
      setFollowing((prev) => prev.filter((u) => u._id !== targetUserId));
      setStats((prev) => ({ ...prev, following: prev.following - 1 }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo dejar de seguir a este usuario");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/users/avatar", formData);
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      login({ ...authUser, avatar: res.data.avatar }, token);
    } catch (err) {
      setError("Error al subir la foto");
    }
  };

  const handleGuardar = async () => {
    try {
      const res = await api.put("/users/profile", {
        name: form.name,
        bio: form.bio,
        socialLinks: { instagram: form.instagram, soundcloud: form.soundcloud },
      });
      setProfile(res.data);
      login({ ...authUser, name: res.data.name }, token);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError("Error al actualizar el perfil");
    }
  };

  if (loadError) {
    return (
      <div style={{ padding: "2rem 1.5rem", maxWidth: "600px", margin: "0 auto", fontFamily: "Montserrat, sans-serif" }}>
        <p style={{ fontSize: "14px", color: "#e24b4a" }}>No se pudo cargar este perfil. Intenta recargar la página.</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div
      style={{
        padding: "2rem 1.5rem",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isOwnProfile ? (
            <label
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#E6F1FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "500",
                color: "#185FA5",
                cursor: "pointer",
                backgroundImage: profile.avatar
                  ? `url(${profile.avatar})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!profile.avatar && profile.name?.charAt(0).toUpperCase()}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#E6F1FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "500",
                color: "#185FA5",
                backgroundImage: profile.avatar
                  ? `url(${profile.avatar})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!profile.avatar && profile.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: "600",
                fontSize: "18px",
                color: "#1B1F24",
              }}
            >
              {profile.name}
            </p>
            {isOwnProfile && (
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#888" }}>
                {authUser?.email}
              </p>
            )}
            {!editing && profile.bio && (
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#666" }}>
                {profile.bio}
              </p>
            )}
            {!editing &&
              (profile.socialLinks?.instagram ||
                profile.socialLinks?.soundcloud) && (
                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  {profile.socialLinks?.instagram && (
                    <span style={{ fontSize: "12px", color: "#185FA5" }}>
                      {profile.socialLinks.instagram}
                    </span>
                  )}
                  {profile.socialLinks?.soundcloud && (
                    <span style={{ fontSize: "12px", color: "#185FA5" }}>
                      {profile.socialLinks.soundcloud}
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>
        {isOwnProfile && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-motion"
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#185FA5",
              border: "1px solid #185FA5",
              borderRadius: "18px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Editar perfil
          </button>
        )}
        {!isOwnProfile && authUser?.role === "admin" && (
          <button
            onClick={handleEliminarUsuario}
            className="btn-motion"
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#e24b4a",
              border: "1px solid #e24b4a",
              borderRadius: "18px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Eliminar usuario
          </button>
        )}
      </div>

      {error && !editing && (
        <p style={{ fontSize: "13px", color: "#e24b4a", marginBottom: "1rem" }}>{error}</p>
      )}

      {/* Formulario de edición */}
      {isOwnProfile && editing && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "#888",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Nombre
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "0.5px solid #ccc",
                fontSize: "14px",
                color: "#1B1F24",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "#888",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Cuéntanos algo sobre ti..."
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "0.5px solid #ccc",
                fontSize: "14px",
                color: "#1B1F24",
                resize: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "#888",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Instagram
            </label>
            <input
              type="text"
              value={form.instagram}
              placeholder="@tuusuario"
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "0.5px solid #ccc",
                fontSize: "14px",
                color: "#1B1F24",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "#888",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Soundcloud
            </label>
            <input
              type="text"
              value={form.soundcloud}
              placeholder="URL de tu perfil"
              onChange={(e) => setForm({ ...form, soundcloud: e.target.value })}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "0.5px solid #ccc",
                fontSize: "14px",
                color: "#1B1F24",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: "13px",
                color: "#e24b4a",
                textAlign: "center",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleGuardar}
              className="btn-motion"
              style={{
                flex: 1,
                padding: "10px",
                background: "#185FA5",
                color: "#fff",
                border: "none",
                borderRadius: "18px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Guardar cambios
            </button>
            <button
              onClick={() => setEditing(false)}
              className="btn-motion"
              style={{
                padding: "10px 16px",
                background: "transparent",
                color: "#666",
                border: "1px solid #ccc",
                borderRadius: "18px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div
          className="profile-stats"
          style={{ marginBottom: isOwnProfile && listView ? "0" : "1.5rem" }}
        >
          <div
            className="profile-stats-item"
            onClick={isOwnProfile ? handleShowFollowers : undefined}
            style={{ cursor: isOwnProfile ? "pointer" : "default" }}
          >
            <span className="profile-stats-value">{stats.followers}</span>
            <span className="profile-stats-label">Seguidores</span>
          </div>
          <div
            className="profile-stats-item"
            onClick={isOwnProfile ? handleShowFollowing : undefined}
            style={{ cursor: isOwnProfile ? "pointer" : "default" }}
          >
            <span className="profile-stats-value">{stats.following}</span>
            <span className="profile-stats-label">Seguidos</span>
          </div>
          <div className="profile-stats-item">
            <span className="profile-stats-value">{stats.posts}</span>
            <span className="profile-stats-label">Posts</span>
          </div>
        </div>
      )}

      {/* Lista de seguidores/seguidos (solo dueño del perfil) */}
      {isOwnProfile && listView && (
        <div
          className="who-to-follow"
          style={{ marginBottom: "1.5rem", marginTop: "1rem" }}
        >
          <h2 className="who-to-follow-title">
            {listView === "followers" ? "Seguidores" : "Seguidos"}
          </h2>
          {(listView === "followers" ? followers : following).length === 0 && (
            <p className="who-to-follow-empty">
              {listView === "followers"
                ? "Todavía no tienes seguidores"
                : "Todavía no sigues a nadie"}
            </p>
          )}
          {(listView === "followers" ? followers : following).map((u) => (
            <div key={u._id} className="follow-card">
              <div
                className="follow-avatar"
                style={{
                  cursor: "pointer",
                  backgroundImage: u.avatar ? `url(${u.avatar})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => navigate(`/profile/${u._id}`)}
              >
                {!u.avatar && u.name?.charAt(0).toUpperCase()}
              </div>
              <div className="follow-info">
                <span
                  className="follow-name"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/profile/${u._id}`)}
                >
                  {u.name}
                </span>
              </div>
              {listView === "following" && (
                <button
                  className="follow-button"
                  onClick={() => handleUnfollow(u._id)}
                >
                  Dejar de seguir
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 && (
        <p style={{ fontSize: "13px", color: "#888" }}>
          Todavía no tiene posts
        </p>
      )}
      {posts.map((post, i) => (
        <motion.div
          key={post._id}
          className="lift-card"
          {...fadeInUp}
          {...staggerDelay(i)}
          style={{
            background: "#ffffff",
            borderRadius: "18px 18px 18px 4px",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 20px rgba(50, 50, 50, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <p style={{ fontSize: "12px", color: "#666", margin: "0 0 6px" }}>
              {new Date(post.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </p>
            {isOwnProfile && (
              <span
                onClick={() => handleEliminarPost(post._id)}
                style={{ cursor: "pointer", fontSize: "16px", color: "#666" }}
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
          <span style={{ fontSize: "13px", color: "#666" }}>
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </span>
        </motion.div>
      ))}
      {hasMore && posts.length > 0 && (
        <button
          onClick={handleCargarMas}
          className="btn-motion"
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
  );
}

export default UserProfile;
