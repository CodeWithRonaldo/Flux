import React, { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./ArtistOnboarding.module.css";
import Button from "../Button/Button";
import { Check, Upload, User, Music as MusicIcon, Wallet } from "lucide-react";

const genres = [
  "Afrobeat", "Hip-hop", "Electronic", "Jazz", "Rock", 
  "Pop", "R&B", "Classical", "Reggae", "Country"
];

const ArtistOnboarding = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    artistName: "",
    bio: "",
    profilePicture: null,
    genres: [],
    walletConnected: false,
  });

  const totalSteps = 4;

  // Validation for each step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.artistName.trim().length > 0;
      case 2:
        return formData.profilePicture !== null;
      case 3:
        return formData.genres.length > 0;
      case 4:
        return formData.walletConnected;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete onboarding
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGenre = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleConnectWallet = () => {
    // Placeholder - you'll replace this with your IOTA wallet connection
    console.log("Connect wallet clicked - integrate IOTA here");
    setFormData(prev => ({ ...prev, walletConnected: true }));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <div className={styles.content}>
        {/* Progress Indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.steps}>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={styles.stepItem}>
                <div 
                  className={`${styles.stepCircle} ${
                    step < currentStep ? styles.completed :
                    step === currentStep ? styles.active : ''
                  }`}
                >
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
                {step < totalSteps && (
                  <div className={`${styles.stepLine} ${
                    step < currentStep ? styles.completed : ''
                  }`} />
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
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    artistName: e.target.value 
                  }))}
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
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    bio: e.target.value 
                  }))}
                />
                <span className={styles.charCount}>
                  {formData.bio.length}/500
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Profile Picture */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <Upload size={40} />
              </div>
              <h2 className={styles.stepTitle}>Upload your profile picture</h2>
              <p className={styles.stepSubtitle}>
                Make your profile stand out
              </p>

              <div className={styles.uploadContainer}>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
                <label htmlFor="profilePic" className={styles.uploadBox}>
                  {formData.profilePicture ? (
                    <div className={styles.uploadSuccess}>
                      <Check size={48} />
                      <p>{formData.profilePicture.name}</p>
                    </div>
                  ) : (
                    <div className={styles.uploadPrompt}>
                      <Upload size={48} />
                      <p>Click to upload image</p>
                      <span>Max size: 5MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Genres */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <MusicIcon size={40} />
              </div>
              <h2 className={styles.stepTitle}>What genres do you create?</h2>
              <p className={styles.stepSubtitle}>
                Select all that apply
              </p>

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

          {/* Step 4: Wallet Connection */}
          {currentStep === 4 && (
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <Wallet size={40} />
              </div>
              <h2 className={styles.stepTitle}>Connect your wallet</h2>
              <p className={styles.stepSubtitle}>
                Required to receive payments for your music
              </p>

              <div className={styles.walletContainer}>
                {formData.walletConnected ? (
                  <div className={styles.walletConnected}>
                    <Check size={48} className={styles.successIcon} />
                    <p>Wallet Connected!</p>
                    <span className={styles.walletAddress}>
                      0x1234...5678
                    </span>
                  </div>
                ) : (
                  <div className={styles.walletPrompt}>
                    <p>Connect your IOTA wallet to start earning</p>
                    <Button onClick={handleConnectWallet}>
                      Connect Wallet
                    </Button>
                    <span className={styles.helperText}>
                      Don't have a wallet? <a href="#">Get one here</a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === totalSteps ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ArtistOnboarding;
