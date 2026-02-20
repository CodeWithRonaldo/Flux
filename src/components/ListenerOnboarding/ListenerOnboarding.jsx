import React, { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./ListenerOnboarding.module.css";
import Button from "../Button/Button";
import { Check } from "lucide-react";

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
  "Country"
];

const ListenerOnboarding = ({ isOpen, onComplete }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleContinue = () => {
    onComplete({ preferences: { genres: selectedGenres } });
  };

  const handleSkip = () => {
    onComplete({ preferences: { genres: [] } });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>What do you like to listen to?</h1>
          <p className={styles.subtitle}>
            Select your favorite genres to personalize your experience
          </p>
        </div>

        <div className={styles.genreGrid}>
          {genres.map((genre) => (
            <button
              key={genre}
              className={`${styles.genreButton} ${
                selectedGenres.includes(genre) ? styles.selected : ""
              }`}
              onClick={() => toggleGenre(genre)}
            >
              {selectedGenres.includes(genre) && (
                <Check className={styles.checkIcon} size={20} />
              )}
              {genre}
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <Button 
            onClick={handleContinue} 
            disabled={selectedGenres.length === 0}
          >
            Continue ({selectedGenres.length} selected)
          </Button>
          <button 
            className={styles.skipButton}
            onClick={handleSkip}
          >
            Skip for now
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ListenerOnboarding;
