import React, { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./ArtistOnboarding.module.css";
import Button from "../Button/Button";
import { Check, Upload, User, Music as MusicIcon, Wallet } from "lucide-react";

const genres = [
  "Afrobeat",
  "Hip-hop",
  "Electronic",
  "Jazz",
  "Rock",
  "Pop",
  "R&B",
  "Classical",
  "Reggae",
  "Country",
];

const ArtistOnboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    artistName: "",
    bio: "",
    genres: [],
  });

  const totalSteps = 2;

  // Validation for each step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.artistName.trim().length > 0;
      case 2:
        return formData.genres.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  return (
    <div className={styles.content}>
      {/* Progress Indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.steps}>
          {[1, 2].map((step) => (
            <div key={step} className={styles.stepItem}>
              <div
                className={`${styles.stepCircle} ${
                  step < currentStep
                    ? styles.completed
                    : step === currentStep
                      ? styles.active
                      : ""
                }`}
              >
                {step < currentStep ? <Check size={16} /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`${styles.stepLine} ${
                    step < currentStep ? styles.completed : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <User size={40} />
            </div>
            <h2 className={styles.stepTitle}>Tell us about yourself</h2>
            <p className={styles.stepSubtitle}>
              Let your fans know who you are
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Artist Name *</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your artist name"
                value={formData.artistName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    artistName: e.target.value,
                  }))
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                placeholder="Tell your story... (optional)"
                rows={4}
                maxLength={500}
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
              />
              <span className={styles.charCount}>
                {formData.bio.length}/500
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Genres */}
        {currentStep === 2 && (
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <MusicIcon size={40} />
            </div>
            <h2 className={styles.stepTitle}>What genres do you create?</h2>
            <p className={styles.stepSubtitle}>Select all that apply</p>

            <div className={styles.genreGrid}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`${styles.genreButton} ${
                    formData.genres.includes(genre) ? styles.selected : ""
                  }`}
                  onClick={() => toggleGenre(genre)}
                >
                  {formData.genres.includes(genre) && (
                    <Check className={styles.checkIcon} size={20} />
                  )}
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
        )}
        <Button onClick={handleNext} disabled={!canProceed()}>
          {currentStep === totalSteps ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ArtistOnboarding;
