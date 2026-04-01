import React, { useState, useEffect } from "react";
import { BlackCard, GlassCard } from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./Upload.module.css";
import Button from "../../components/Button/Button";
import {
  Check,
  Music,
  UploadIcon,
  User,
  X,
  CheckCircle2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { useIota } from "../../hooks/useIota";
import { uploadToPinata } from "../../util/helper";
import { useMusicUpload } from "../../hooks/useMusicUpload";
import { useFetchMusic } from "../../hooks/useFetchMusic";
import { useVibetraxHook } from "../../hooks/useVibetraxHook";
import Modal from "../../components/Modal/Modal";
import modalStyles from "../../components/PurchaseModal/PurchaseModal.module.css";
import TransactionLoader from "../../components/TransactionLoader/TransactionLoader";
import { useIotaClientQuery } from "@iota/dapp-kit";
import { useNetworkVariable } from "../../config/networkConfig";

const Upload = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [highQualityFile, setHighQualityFile] = useState(null);
  const [lowQualityFile, setLowQualityFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingPreviewUrl, setExistingPreviewUrl] = useState("");
  const [existingFullUrl, setExistingFullUrl] = useState("");
  const [artistPercentage, setArtistPercentage] = useState(100);
  const [artistHasRoyalty, setArtistHasRoyalty] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState({
    name: "",
    image_url: "",
    role: "",
    address: "",
    percentage: "",
    hasRoyalty: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadState, setUploadState] = useState({
    isOpen: false,
    step: "",
    isDone: false,
    error: "",
  });
  const [activeStep, setActiveStep] = useState(1);
  const { currentUser } = useOutletContext();
  const { address } = useIota();
  const { uploadMusic, error: uploadError } = useMusicUpload();
  const { updateMusic } = useVibetraxHook();
  const { musics } = useFetchMusic();
  const vibeTraxPackageId = useNetworkVariable("vibeTraxPackageId");

  const { data: registeredUsers } = useIotaClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${vibeTraxPackageId}::vibetrax::UserRegistered`,
      },
    },
    {
      select: (data) => data.data.flatMap((x) => x.parsedJson),
      // .filter((y) => y.role === "artist"),
      refetchInterval: 3000,
    },
  );

  useEffect(() => {
    if (uploadError) setUploadState((s) => ({ ...s, error: uploadError }));
  }, [uploadError]);

  const existingMusic = isEditMode
    ? musics?.find((m) => m.music_id === id)
    : null;

  useEffect(() => {
    if (!existingMusic) return;
    setTitle(existingMusic.title ?? "");
    setDescription(existingMusic.description ?? "");
    setGenre(existingMusic.genre ?? "");
    setExistingImageUrl(existingMusic.music_image ?? "");
    setExistingPreviewUrl(existingMusic.preview_music ?? "");
    setExistingFullUrl(existingMusic.full_music ?? "");
  }, [existingMusic]);

  const uploadSteps = [
    { id: 1, label: "Basics", icon: <Music size={18} /> },
    { id: 2, label: "Media", icon: <UploadIcon size={18} /> },
    { id: 3, label: "Royalties", icon: <User size={18} /> },
    { id: 4, label: "Review", icon: <Check size={18} /> },
  ];
  const editSteps = [
    { id: 1, label: "Basics", icon: <Music size={18} /> },
    { id: 2, label: "Media", icon: <UploadIcon size={18} /> },
    { id: 3, label: "Review", icon: <Check size={18} /> },
  ];
  const steps = isEditMode ? editSteps : uploadSteps;
  const totalSteps = steps.length;
  const collaboratorTotal = contributors.reduce(
    (sum, c) => sum + c.percentage,
    0,
  );
  const totalUsed = artistPercentage + collaboratorTotal;
  const remaining = 100 - totalUsed;

  const canProceed = () => {
    switch (activeStep) {
      case 1:
        return title.trim() !== "" && description.trim() !== "" && genre !== "";
      case 2:
        if (isEditMode) return true;
        return lowQualityFile !== null && imageFile !== null;
      case 3:
        if (isEditMode) return true;
        return Number(price) > 0 && remaining === 0;
      default:
        return true;
    }
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);
    setUploadState({ isOpen: true, step: "Preparing files", isDone: false });
    try {
      let imageUrl = existingImageUrl;
      let previewUrl = existingPreviewUrl;
      let fullUrl = existingFullUrl;

      if (imageFile) {
        setUploadState((s) => ({ ...s, step: "Uploading cover art to IPFS" }));
        const cid = await uploadToPinata(imageFile);
        imageUrl = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${cid}`;
      }
      if (lowQualityFile) {
        setUploadState((s) => ({
          ...s,
          step: "Uploading standard quality track",
        }));
        const cid = await uploadToPinata(lowQualityFile);
        previewUrl = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${cid}`;
      }
      if (highQualityFile) {
        setUploadState((s) => ({
          ...s,
          step: "Uploading premium quality track",
        }));
        const cid = await uploadToPinata(highQualityFile);
        fullUrl = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${cid}`;
      }

      setUploadState((s) => ({ ...s, step: "Saving changes to blockchain" }));
      const result = await updateMusic({
        musicId: id,
        title,
        description,
        genre,
        musicImage: imageUrl,
        previewMusic: previewUrl,
        fullMusic: fullUrl || null,
      });

      if (result)
        setUploadState((s) => ({ ...s, step: "Changes saved!", isDone: true }));
    } catch (e) {
      setUploadState((s) => ({
        ...s,
        error: e.message || "File upload failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadState({
      isOpen: true,
      step: "Uploading cover art to IPFS",
      isDone: false,
    });
    try {
      const imageCid = await uploadToPinata(imageFile);

      setUploadState((s) => ({
        ...s,
        step: "Uploading standard quality track",
      }));
      const lowQualityCid = await uploadToPinata(lowQualityFile);

      let highQualityCid = null;
      if (highQualityFile) {
        setUploadState((s) => ({
          ...s,
          step: "Uploading premium quality track",
        }));
        highQualityCid = await uploadToPinata(highQualityFile);
      }

      setUploadState((s) => ({ ...s, step: "Publishing track to blockchain" }));
      const musicData = {
        title,
        description,
        genre,
        price: Number(price),
        imageFile: `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${imageCid}`,
        lowQualityFile: `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${lowQualityCid}`,
        highQualityFile: highQualityCid
          ? `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${highQualityCid}`
          : "",
        collaboratorNames: contributors.map((c) => c.name),
        collaboratorAddresses: contributors.map((c) => c.address),
        collaboratorRoles: contributors.map((c) => c.role),
        collaboratorPercentage: contributors.map((c) => c.percentage),
        collaboratorHasRoyalty: contributors.map((c) => c.hasRoyalty),
        artist: {
          name: currentUser?.username,
          address,
          role: currentUser?.role,
          artistPercentage,
          artistHasRoyalty,
        },
      };

      const result = await uploadMusic(musicData);
      if (result)
        setUploadState((s) => ({
          ...s,
          step: "Track published successfully!",
          isDone: true,
        }));
    } catch (e) {
      setUploadState((s) => ({
        ...s,
        error: e.message || "File upload failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.UploadContainer}>
      <BlackCard className={styles.uploadHeader}>
        <div className={styles.headerContent}>
          <div>Creator Studio</div>
          <h1>{isEditMode ? "Edit Track" : "Release New Music"}</h1>
          <p>
            {isEditMode
              ? "Update your track details below. Media files are optional — only upload if replacing."
              : "Upload your latest masterpiece and define how the world supports you."}
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
              {step.id < totalSteps && <div className={styles.stepLine} />}
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
                        <span>{description.length}/500</span>
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

              {activeStep === 2 && isEditMode && (
                <div className={styles.editMediaGrid}>
                  <div className={styles.editMediaField}>
                    <label className={styles["form-label"]}>Cover Image</label>
                    {existingImageUrl && !imageFile && (
                      <img
                        src={existingImageUrl}
                        alt="current cover"
                        className={styles.editMediaPreview}
                      />
                    )}
                    <label
                      htmlFor="editImageFile"
                      className={`${styles.mediaLabel} ${imageFile ? styles.mediaLabelSelected : ""}`}
                    >
                      {imageFile ? (
                        <CheckCircle2
                          size={32}
                          className={styles.mediaSelectedIcon}
                        />
                      ) : (
                        <UploadIcon size={32} />
                      )}
                      {imageFile ? imageFile.name : "Replace cover image"}
                      <input
                        type="file"
                        id="editImageFile"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0])
                            setImageFile(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>

                  <div className={styles.editMediaField}>
                    <label className={styles["form-label"]}>
                      Standard Quality Track
                    </label>
                    {existingPreviewUrl && !lowQualityFile && (
                      <p className={styles.editMediaUrl}>
                        Current: {existingPreviewUrl.split("/").pop()}
                      </p>
                    )}
                    <label
                      htmlFor="editLowFile"
                      className={`${styles.mediaLabel} ${lowQualityFile ? styles.mediaLabelSelected : ""}`}
                    >
                      {lowQualityFile ? (
                        <CheckCircle2
                          size={32}
                          className={styles.mediaSelectedIcon}
                        />
                      ) : (
                        <UploadIcon size={32} />
                      )}
                      {lowQualityFile
                        ? lowQualityFile.name
                        : "Replace standard audio"}
                      <input
                        type="file"
                        id="editLowFile"
                        accept="audio/*"
                        onChange={(e) => {
                          if (e.target.files[0])
                            setLowQualityFile(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>

                  <div className={styles.editMediaField}>
                    <label className={styles["form-label"]}>
                      Premium Quality Track
                    </label>
                    {existingFullUrl && !highQualityFile && (
                      <p className={styles.editMediaUrl}>
                        Current: {existingFullUrl.split("/").pop()}
                      </p>
                    )}
                    <label
                      htmlFor="editHighFile"
                      className={`${styles.mediaLabel} ${highQualityFile ? styles.mediaLabelSelected : ""}`}
                    >
                      {highQualityFile ? (
                        <CheckCircle2
                          size={32}
                          className={styles.mediaSelectedIcon}
                        />
                      ) : (
                        <UploadIcon size={32} />
                      )}
                      {highQualityFile
                        ? highQualityFile.name
                        : "Replace premium audio (optional)"}
                      <input
                        type="file"
                        id="editHighFile"
                        accept="audio/*"
                        onChange={(e) => {
                          if (e.target.files[0])
                            setHighQualityFile(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeStep === 2 && !isEditMode && (
                <div className={styles.mediaGrid}>
                  <div className={styles.musicQuality}>
                    <label
                      htmlFor="LowQualityFile"
                      className={`${styles.mediaLabel} ${lowQualityFile ? styles.mediaLabelSelected : ""}`}
                    >
                      {lowQualityFile ? (
                        <CheckCircle2
                          size={48}
                          className={styles.mediaSelectedIcon}
                        />
                      ) : (
                        <UploadIcon size={48} />
                      )}
                      Standard Quality Track
                      <span>
                        {lowQualityFile
                          ? lowQualityFile.name
                          : "(mp3, aac up to 20mb)"}
                      </span>
                      <input
                        type="file"
                        id="LowQualityFile"
                        accept="audio/*, .mp3, .aac, .ogg, .wav, .flac, .m4a"
                        onChange={(e) => {
                          if (e.target.files[0])
                            setLowQualityFile(e.target.files[0]);
                        }}
                      />
                    </label>

                    <label
                      htmlFor="highQualityFIle"
                      className={`${styles.mediaLabel} ${highQualityFile ? styles.mediaLabelSelected : ""}`}
                    >
                      {highQualityFile ? (
                        <CheckCircle2
                          size={48}
                          className={styles.mediaSelectedIcon}
                        />
                      ) : (
                        <UploadIcon size={48} />
                      )}
                      Premium Quality Track
                      <span>
                        {highQualityFile
                          ? highQualityFile.name
                          : "(mp3, aac, flac up to 50mb)"}
                      </span>
                      <input
                        type="file"
                        id="highQualityFIle"
                        accept="audio/* .mp3, .aac, .ogg, .wav, .flac, .m4a"
                        onChange={(e) => {
                          if (e.target.files[0])
                            setHighQualityFile(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>

                  <label
                    htmlFor="imageFile"
                    className={`${styles.mediaLabel} ${imageFile ? styles.mediaLabelSelected : ""}`}
                    style={
                      imageFile
                        ? {
                            backgroundImage: `url(${URL.createObjectURL(imageFile)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  >
                    {!imageFile && <UploadIcon size={48} />}
                    {!imageFile && "Music Artwork"}
                    {!imageFile && <span>(jpg, jpeg, png, gif up to 5mb)</span>}
                    {imageFile && (
                      <div className={styles.imageOverlay}>
                        <CheckCircle2
                          size={32}
                          className={styles.mediaSelectedIcon}
                        />
                        <span>{imageFile.name}</span>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={(e) => {
                            e.preventDefault();
                            setImageFile(null);
                          }}
                        >
                          <X size={14} /> Remove
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      id="imageFile"
                      accept="image/* .jpg, .jpeg, .png, .gif"
                      onChange={(e) => {
                        if (e.target.files[0]) setImageFile(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              )}

              {activeStep === 3 && !isEditMode && (
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
                      <span
                        className={
                          remaining < 0
                            ? styles.overLimit
                            : remaining === 0
                              ? styles.fullLimit
                              : ""
                        }
                      >
                        {Math.max(0, remaining)}% Left
                      </span>
                    </div>

                    {/* Artist row — fixed role & address, editable percentage */}
                    <div className={styles.collaboratorList}>
                      <div className={styles.collaboratorItem}>
                        <span className={styles.collaboratorRole}>Artist</span>
                        <code className={styles.collaboratorAddress}>
                          {address
                            ? `${address.slice(0, 6)}...${address.slice(-4)}`
                            : "—"}
                        </code>
                        <input
                          type="number"
                          className={styles.collaboratorPctInput}
                          min="0"
                          max={100 - collaboratorTotal}
                          value={artistPercentage}
                          onChange={(e) => {
                            const val = Math.min(
                              Number(e.target.value),
                              100 - collaboratorTotal,
                            );
                            setArtistPercentage(Math.max(0, val));
                          }}
                        />
                        <span className={styles.collaboratorPctLabel}>%</span>
                        <button
                          type="button"
                          className={`${styles.collaboratorRoyaltyBtn} ${artistHasRoyalty ? styles.collaboratorRoyaltyBtnActive : ""}`}
                          onClick={() => setArtistHasRoyalty(!artistHasRoyalty)}
                        >
                          {artistHasRoyalty ? "Has Royalty" : "No Royalty"}
                        </button>
                      </div>

                      {contributors.map((c, i) => (
                        <div key={i} className={styles.collaboratorItem}>
                          <span className={styles.collaboratorRole}>
                            {c.role}
                          </span>
                          <code className={styles.collaboratorAddress}>
                            {c.address.slice(0, 6)}...{c.address.slice(-4)}
                          </code>
                          <span className={styles.collaboratorPct}>
                            {c.percentage}%
                          </span>
                          <span
                            className={`${styles.collaboratorRoyaltyBtn} ${styles.collaboratorRoyaltyStatic} ${c.hasRoyalty ? styles.collaboratorRoyaltyBtnActive : ""}`}
                          >
                            {c.hasRoyalty ? "Has Royalty" : "No Royalty"}
                          </span>
                          <button
                            type="button"
                            className={styles.removeCollaborator}
                            onClick={() =>
                              setContributors((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add collaborator form */}
                    <div className={styles.distributionGrid}>
                      <div className={styles.distributionInput}>
                        <input
                          type="text"
                          placeholder="Role"
                          value={newCollaborator.role}
                          onChange={(e) =>
                            setNewCollaborator((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
                        />
                        <select
                          name="address"
                          id="address"
                          className={styles["form-select"]}
                          value={newCollaborator.address}
                          onChange={(e) => {
                            const selected = e.target.selectedOptions[0];
                            setNewCollaborator((prev) => ({
                              ...prev,
                              address: selected.value,
                              name: selected.dataset.name,
                              image_url: selected.dataset.imageUrl ?? "",
                            }));
                          }}
                        >
                          <option value="" disabled>
                            Select User
                          </option>
                          {registeredUsers?.map((user) => (
                            <option
                              key={user.owner}
                              value={user.owner}
                              data-name={user.username}
                              data-image-url={user.image_url ?? ""}
                            >
                              {user.username}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          max={remaining}
                          value={newCollaborator.percentage}
                          onChange={(e) => {
                            const val = Math.min(
                              Number(e.target.value),
                              remaining,
                            );
                            setNewCollaborator((prev) => ({
                              ...prev,
                              percentage: Math.max(0, val),
                            }));
                          }}
                        />
                        <button
                          type="button"
                          className={`${styles.royaltyToggleBtn} ${newCollaborator.hasRoyalty ? styles.royaltyToggleBtnActive : ""}`}
                          onClick={() =>
                            setNewCollaborator((prev) => ({
                              ...prev,
                              hasRoyalty: !prev.hasRoyalty,
                            }))
                          }
                        >
                          {newCollaborator.hasRoyalty
                            ? "Has Royalty"
                            : "No Royalty"}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="btn-ghost"
                        className={styles.submitButton}
                        disabled={remaining <= 0}
                        onClick={() => {
                          const {
                            role,
                            name,
                            image_url,
                            address: addr,
                            percentage,
                            hasRoyalty,
                          } = newCollaborator;
                          if (
                            !role ||
                            !addr ||
                            !percentage ||
                            !name ||
                            !image_url
                          )
                            return;

                          setContributors((prev) => [
                            ...prev,
                            {
                              name,
                              image_url,
                              role,
                              address: addr,
                              percentage: Number(percentage),
                              hasRoyalty,
                            },
                          ]);
                          setNewCollaborator({
                            name: "",
                            image_url: "",
                            role: "",
                            address: "",
                            percentage: "",
                            hasRoyalty: false,
                          });
                        }}
                      >
                        Add Collaborator
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {activeStep === totalSteps && (
                <div className={styles.review}>
                  <div className={styles.reviewImage}>
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="cover art"
                      />
                    ) : existingImageUrl ? (
                      <img src={existingImageUrl} alt="cover art" />
                    ) : null}
                  </div>
                  <div className={styles.reviewDetails}>
                    <p>
                      TITLE <span>{title}</span>
                    </p>
                    <p>
                      DESCRIPTION <span>{description}</span>
                    </p>
                    <p>
                      GENRE <span className={styles.genre}>{genre}</span>
                    </p>
                    <p>
                      PRICE <span>{price} IOTA</span>
                    </p>
                    <p>
                      STANDARD TRACK
                      <span>{lowQualityFile?.name || "—"}</span>
                    </p>
                    <p>
                      PREMIUM TRACK
                      <span>{highQualityFile?.name || "Not provided"}</span>
                    </p>
                    <div>
                      <p>REVENUE SPLITTING</p>
                      <div className={styles.tinySplitsList}>
                        <div className={styles.tinySplit}>
                          <strong>Artist</strong>
                          <code>
                            {address
                              ? `${address.slice(0, 6)}...${address.slice(-4)}`
                              : "—"}
                          </code>
                          <span>{artistPercentage}%</span>
                          <span
                            className={`${styles.tinyRoyaltyBadge} ${artistHasRoyalty ? styles.tinyRoyaltyActive : ""}`}
                          >
                            {artistHasRoyalty ? "Royalty" : "No Royalty"}
                          </span>
                        </div>
                        {contributors.map((c, i) => (
                          <div key={i} className={styles.tinySplit}>
                            <strong>{c.role}</strong>
                            <code>
                              {c.address.slice(0, 6)}...{c.address.slice(-4)}
                            </code>
                            <span>{c.percentage}%</span>
                            <span
                              className={`${styles.tinyRoyaltyBadge} ${c.hasRoyalty ? styles.tinyRoyaltyActive : ""}`}
                            >
                              {c.hasRoyalty ? "Royalty" : "No Royalty"}
                            </span>
                          </div>
                        ))}
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
                {activeStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    variant="btn-primary"
                    className={styles.submitButton}
                    disabled={!canProceed()}
                  >
                    Continue
                  </Button>
                ) : isEditMode ? (
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="btn-primary"
                    className={styles.submitButton}
                    onClick={handleEditSubmit}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isSubmitting || remaining !== 0}
                    variant="btn-primary"
                    className={styles.submitButton}
                    onClick={handleSubmit}
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
            <Button type="button" variant="btn-secondary">
              Get Testnet Token
            </Button>
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

      <Modal isOpen={uploadState.isOpen} onClose={() => {}} size="small">
        {uploadState.error ? (
          <div className={modalStyles.successContainer}>
            <div
              className={modalStyles.successIcon}
              style={{ color: "#f87171" }}
            >
              <XCircle size={56} />
            </div>
            <h2 className={modalStyles.successTitle}>Upload Failed</h2>
            <p
              className={modalStyles.successSubtitle}
              style={{ color: "#f87171", textTransform: "none" }}
            >
              {uploadState.error}
            </p>
            <Button
              variant="btn-ghost"
              onClick={() =>
                setUploadState({
                  isOpen: false,
                  step: "",
                  isDone: false,
                  error: "",
                })
              }
            >
              Dismiss
            </Button>
          </div>
        ) : !uploadState.isDone ? (
          <TransactionLoader title={uploadState.step} subtitle="Please wait" />
        ) : (
          <div className={modalStyles.successContainer}>
            <div className={modalStyles.successIcon}>
              <CheckCircle size={56} />
            </div>
            <h2 className={modalStyles.successTitle}>{uploadState.step}</h2>
            <Button
              onClick={() => {
                setUploadState({
                  isOpen: false,
                  step: "",
                  isDone: false,
                  error: "",
                });
                navigate(isEditMode ? `/play/${id}` : "/");
              }}
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Upload;
