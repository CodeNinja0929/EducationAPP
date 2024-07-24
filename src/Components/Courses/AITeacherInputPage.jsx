import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styles from '../../style/AITeacherInputPage.module.css';
import Header from '../Header';

const AITeacherInputPage = ({ setPrompt, userId }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    console.log("AITeacherInputPage rendered");
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setPrompt(input);

    // Save user input to Firestore
    try {
      console.log("Saving user input to Firestore");
      await addDoc(collection(db, "user_inputs"), {
        user_id: userId,
        prompt: input,
        input_data: input,
        timestamp: new Date()
      });

      console.log("User input saved successfully");
      window.location.href = "/schoolai/courseoutline";
    } catch (error) {
      console.error('Error saving user input:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={`${styles.sectionPadding} ${styles.bgCover} ${styles.bgNoRepeat} ${styles.bgCenter} ${styles.minHScreen} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`}>
        <div className={`${styles.container} ${styles.bgWhite} ${styles.shadowBox5} ${styles.rounded} ${styles.p8}`}>
          <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.mb6} ${styles.textCenter}`}>What do you want to learn?</h1>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to learn..."
            rows="5"
            className={`${styles.wFull} ${styles.p4} ${styles.border} ${styles.roundedMd} ${styles.focusOutlineNone} ${styles.focusRing2} ${styles.focusRingPrimary}`}
          />
          <button onClick={handleSubmit} disabled={loading} className={`${styles.btn} ${styles.btnPrimary} ${styles.mt4} ${styles.wFull}`}>
            {loading ? <div className={styles.spinner}></div> : 'Start AI Teacher Course'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AITeacherInputPage;
