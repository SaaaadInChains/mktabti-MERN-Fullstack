import { Router } from "express";
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlistController.js";
import { authenticate } from "../middleware/auth.js";
import { imageUpload } from "../middleware/fileFilter.js";

const router = Router();

router.use(authenticate);

router.post("/", imageUpload.single("cover"), createPlaylist);
router.get("/", getMyPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", imageUpload.single("cover"), updatePlaylist);
router.delete("/:id", deletePlaylist);

export default router;
