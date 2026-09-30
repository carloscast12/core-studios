import api from "../services/api";
import { optimizedImage } from "./cloudinaryUrl";
import podcastPhoto from "../assets/podcast.png";
import grabacionPhoto from "../assets/abdel.jpg";
import equiposDjPhoto from "../assets/notalex.jpg";

const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

export const preloadAppImages = async () => {
  [podcastPhoto, grabacionPhoto, equiposDjPhoto].forEach(preloadImage);

  try {
    const res = await api.get("/posts?page=1&limit=5");
    res.data
      .filter((post) => post.images?.length > 0)
      .forEach((post) => preloadImage(optimizedImage(post.images[0], 700)));
  } catch {
    // la precarga es "best effort", no interrumpe nada si falla
  }
};
