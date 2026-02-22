import React, { useState } from "react";
import { BlackCard, GlassCard } from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./Upload.module.css";
import Button from "../../components/Button/Button";
import { Check, Music, UploadIcon, User } from "lucide-react";
import Image1 from "../../assets/fakelove.jpg";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState(0);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [highQualityFile, setHighQualityFile] = useState(null);
  const [lowQualityFile, setLowQualityFile] = useState(null);
  const [forSale, setForSale] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, label: "Basics", icon: <Music size={18} /> },
    { id: 2, label: "Media", icon: <UploadIcon size={18} /> },
    { id: 3, label: "Royalties", icon: <User size={18} /> },
    { id: 4, label: "Review", icon: <Check size={18} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  return (
    <div className={styles.UploadContainer}>
      <BlackCard className={styles.uploadHeader}>
        <div className={styles.headerContent}>
          <div>Creator Studio</div>
          <h1>Release New Music</h1>
          <p>
            Upload your latest masterpiece and define how the world supports
            you.
          </p>
        </div>

        <div className={styles.stepper}>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`${styles.stepItem} ${
                activeStep === step.id ? styles.active : ""
              } ${activeStep > step.id ? styles.completed : ""}`}
              onClick={() => activeStep > step.id && setActiveStep(step.id)}
            >
              <div className={styles.stepIcon}>{step.icon}</div>
              <span className={styles.stepLabel}>{step.label}</span>
              {step.id < 4 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>
      </BlackCard>
      <div className={styles.formContainer}>
        <div className={styles.uploadForm}>
          <BlackCard className={styles.formCard}>
            <Form
              title={"Media Asset"}
              subtitle={"Upload your high-quality audio and cover art."}
              onSubmit={handleSubmit}
            >
              {activeStep === 1 && (
                <>
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

                  <div className={styles.inputGroup}>
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
                        <span>{description.length}/10</span>
                      </div>
                    </div>
                  </div>
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
                </>
              )}

              {activeStep === 2 && (
                <div className={styles.mediaGrid}>
                  <div className={styles.musicQuality}>
                    <label
                      htmlFor="LowQualityFile"
                      className={styles.mediaLabel}
                    >
                      <UploadIcon size={48} />
                      Standard Quality Track
                      <span>(mp3, aac up to 20mb)</span>
                      <input
                        type="file"
                        value={lowQualityFile}
                        id="LowQualityFile"
                        accept="audio/*, .mp3, .aac, .ogg, .wav, .flac, .m4a"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setLowQualityFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    <label
                      htmlFor="highQualityFIle"
                      className={styles.mediaLabel}
                    >
                      <UploadIcon size={48} />
                      Premium Quality Track
                      <span>(wav, flac up to 50mb)</span>
                      <input
                        type="file"
                        value={highQualityFile}
                        id="highQualityFIle"
                        accept="audio/* .mp3, .aac, .ogg, .wav, .flac, .m4a"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            setHighQualityFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <label htmlFor="imageFile" className={styles.mediaLabel}>
                    <UploadIcon size={48} />
                    Music ArtWork
                    <span>(jpg, jpeg, png, gif up to 5mb)</span>
                    <input
                      type="file"
                      // value={imageFile}
                      id="imageFile"
                      accept="image/* .jpg, .jpeg, .png, .gif"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
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
              )}

              {activeStep === 3 && (
                <>
                  {/* Revenue Distribution */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="price" className={styles["form-label"]}>
                      Premium Access Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      id="price"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className={styles.revenueDistribution}>
                    <div className={styles.header}>
                      <h4>Revenue Distribution</h4>
                      <span>0% Left</span>
                    </div>
                    <div className={styles.distributionGrid}>
                      <div className={styles.distributionInput}>
                        <input type="text" placeholder="Role" />
                        <input type="text" placeholder="Wallet Address" />
                        <input type="number" placeholder="0" />
                      </div>
                      <Button
                        type="button"
                        variant="btn-ghost"
                        className={styles.submitButton}
                      >
                        Add Collaborator
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {activeStep === 4 && (
                <div className={styles.review}>
                  <div className={styles.reviewImage}>
                    <img src={Image1} alt="cover art" />
                  </div>
                  <div className={styles.reviewDetails}>
                    <p>
                      TITLE <span>The girl in Lemonade dress</span>
                    </p>
                    <p>
                      DESCPRITION
                      <span>The girl in Lemonade dress is my baby</span>
                    </p>
                    <p>
                      GENRE
                      <span className={styles.genre}>Takawaka</span>
                    </p>
                    <p>
                      PRICE
                      <span>2 IOTA</span>
                    </p>
                    <div>
                      <p>REVENUE SPLITTING</p>
                      <div className={styles.tinySplitsList}>
                        <div className={styles.tinySplit}>
                          <strong>Artist</strong>
                          <code>0x123456...abcdef</code>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.buttonContainer}>
                {activeStep > 1 && (
                  <Button
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="btn-ghost"
                    className={styles.submitButton}
                  >
                    Back
                  </Button>
                )}
                {activeStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    variant="btn-primary"
                    className={styles.submitButton}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="btn-primary"
                    className={styles.submitButton}
                  >
                    {isSubmitting ? "Uploading Track" : "Upload Track"}
                  </Button>
                )}
              </div>
            </Form>
          </BlackCard>
        </div>

        <div className={styles.uploadFormAside}>
          <BlackCard className={styles.aside}>
            <h3>Gas Estimates</h3>
            <p>
              You need approx. 0.1 IOTA for transaction fees on the network.
            </p>
            <Button variant="btn-secondary">Get Testnet Token</Button>
          </BlackCard>

          <BlackCard className={styles.aside}>
            <h3>Quick Guidelines</h3>
            <ul>
              <li>Use high-quality WAV or FLAC for premium audio.</li>
              <li>Artwork should be at least 1500x1500px for best results.</li>
              <li>Ensure your revenue splits add up to exactly 100%.</li>
            </ul>
          </BlackCard>
        </div>
      </div>
    </div>
  );
};

export default Upload;
