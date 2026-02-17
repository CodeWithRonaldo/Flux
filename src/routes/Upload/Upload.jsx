import React, { useState } from "react";
import { GlassCard } from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./Upload.module.css";
import Button from "../../components/Button/Button";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState(0);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(null);
  const [imageFile, setImageFile] = useState("");
  const [highQualityFile, setHighQualityFile] = useState(null);
  const [lowQualityFile, setLowQualityFile] = useState(null);
  const [forSale, setForSale] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  };
  return (
    <div className={styles.UploadContainer}>
      <GlassCard className={styles.formCard}>
        <Form
          title={"Upload Music"}
          subtitle={"Share your music to the world"}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="" className={styles["form-label"]}>
              Track Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter track title"
              required
            />
          </div>

          {/* <div className={styles.inputGroup}>
            <label htmlFor="" className={styles["form-label"]}>
              Description
            </label>
            <div className={styles.descriptionContainer}>
              <textarea
                id="description"
                className={styles["form-textarea"]}
                placeholder="Enter track description"
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className={styles.charCount}>
                <span>{description.length}/500</span>
              </div>
            </div>
          </div> */}
          <div className={styles.inputGroup}>
            <select
              name="genre"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={styles["form-select"]}
              required
            >
              <option value="" disabled>
                Select a Genre
              </option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="hiphop">Hip-Hop</option>
              <option value="jazz">Jazz</option>
              <option value="electronic">Electronic</option>
              <option value="classical">Classical</option>
              <option value="afrobeat">Afrobeat</option>
              <option value="r&b">R&B</option>
              <option value="latin">Latin</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="LowQualityFile" className={styles["form-label"]}>
              Upload Standard Quality Track
            </label>
            <input
              type="file"
              value={lowQualityFile}
              id="standard quality"
              accept="audio/*, .mp3, .aac, .ogg, .wav, .flac, .m4a"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setLowQualityFile(e.target.files[0]);
                }
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="highQualityFIle" className={styles["form-label"]}>
              Upload Premium Quality Track
            </label>
            <input
              type="file"
              value={highQualityFile}
              id="premium quality"
              accept="audio/* .mp3, .aac, .ogg, .wav, .flac, .m4a"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setHighQualityFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="imageFile" className={styles["form-label"]}>
              Upload ArtWork
            </label>
            <input
              type="file"
              value={imageFile}
              id="artwork"
              accept="image/* .jpg, .jpeg, .png, .gif"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
            {imageFile && (
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className={styles.removeButton}
              >
                X
              </button>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="" className={styles["form-label"]}>
              Royalty Percentage
            </label>
            <input
              type="number"
              value={royaltyPercentage}
              onChange={(e) => setRoyaltyPercentage(e.target.value)}
            />
          </div>

          {/* Revenue Distribution */}

          <h3>Revenue Distribution</h3>
          <div className={styles.revenueDistribution}>
            <h4>You (Artist)</h4>
            <div className={styles.inputGroup}>
              <label htmlFor="" className={styles["form-label"]}>
              </label>
              <input type="number" readOnly />
            </div>
          </div>
            <div className={styles.inputGroup}>
              <label htmlFor="" className={styles["form-label"]}>
                Add Contributor
              </label>
              <input
                type="text"
                value={contributors}
                onChange={(e) => setContributors(e.target.value)}
              />
            </div>

          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles["form-label"]}>
              Premium Access Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} variant="btn-ghost" className={styles.submitButton}>{isSubmitting ? "Uploading Track" : "Upload Track"}</Button>
        </Form>
      </GlassCard>
    </div>
  );
};

export default Upload;
