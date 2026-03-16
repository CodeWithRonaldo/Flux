import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./EditTrackModal.module.css";
import { Pencil, Music, CheckCircle } from "lucide-react";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import purchaseStyles from "../PurchaseModal/PurchaseModal.module.css";

const EditTrackModal = ({ isOpen, onClose, music, onSuccess }) => {
  const { updateMusic, loading } = useVibetraxHook();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    musicImage: "",
    previewMusic: "",
    fullMusic: "",
  });

  useEffect(() => {
    if (music) {
      setForm({
        title: music.title ?? "",
        description: music.description ?? "",
        genre: music.genre ?? "",
        musicImage: music.music_image ?? "",
        previewMusic: music.preview_music ?? "",
        fullMusic: music.full_music ?? "",
      });
    }
  }, [music]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!music) return;
    const result = await updateMusic({
      musicId: music.music_id,
      title: form.title || null,
      description: form.description || null,
      genre: form.genre || null,
      musicImage: form.musicImage || null,
      previewMusic: form.previewMusic || null,
      fullMusic: form.fullMusic || null,
    });
    if (!result) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      onSuccess?.();
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setDone(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      {!loading && !done && (
        <div className={styles.container}>
          <div className={styles.iconWrapper}>
            <Pencil size={32} />
          </div>
          <h2 className={styles.title}>Edit Track</h2>
          <p className={styles.subtitle}>{music?.title}</p>

          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                name="title"
                className={styles.input}
                value={form.title}
                onChange={handleChange}
                placeholder="Track title"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                className={`${styles.input} ${styles.textarea}`}
                value={form.description}
                onChange={handleChange}
                placeholder="Track description"
                rows={3}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Genre</label>
              <input
                name="genre"
                className={styles.input}
                value={form.genre}
                onChange={handleChange}
                placeholder="e.g. Hip-Hop, Jazz, Electronic"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Cover Image URL</label>
              <input
                name="musicImage"
                className={styles.input}
                value={form.musicImage}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Preview Audio URL</label>
              <input
                name="previewMusic"
                className={styles.input}
                value={form.previewMusic}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Full Audio URL</label>
              <input
                name="fullMusic"
                className={styles.input}
                value={form.fullMusic}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="btn-ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      )}

      {loading && (
        <div className={purchaseStyles.loadingContainer}>
          <div className={purchaseStyles.loadingOrb}>
            <div className={purchaseStyles.orbRing} />
            <div className={purchaseStyles.orbRing} />
            <div className={purchaseStyles.orbRing} />
            <div className={purchaseStyles.orbIcon}>
              <Music size={32} />
            </div>
          </div>
          <h2 className={purchaseStyles.loadingTitle}>Saving changes</h2>
          <p className={purchaseStyles.loadingSubtitle}>
            Confirming on IOTA blockchain
            <span className={purchaseStyles.dots} />
          </p>
        </div>
      )}

      {done && (
        <div className={purchaseStyles.successContainer}>
          <div className={purchaseStyles.successIcon}>
            <CheckCircle size={56} />
          </div>
          <h2 className={purchaseStyles.successTitle}>Track updated!</h2>
        </div>
      )}
    </Modal>
  );
};

export default EditTrackModal;
