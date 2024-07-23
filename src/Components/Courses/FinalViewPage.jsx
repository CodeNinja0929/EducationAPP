import React, { useState, useEffect } from 'react';
import styles from '../../style/FinalViewPage.module.css';
import Header from '../Header'

const FinalViewPage = ({ prompt, chapters, setContent, content, userId }) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async (chapterName, subchapterName) => {
    try {
      const response = await fetch('http://localhost:5000/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          chapter_name: chapterName,
          subchapter_name: subchapterName,
          prompt
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setContent(prev => ({
        ...prev,
        [`${chapterName}-${subchapterName}`]: data
      }));
      console.log(`Fetched Content for ${chapterName}-${subchapterName}:`, data); // Debug output
    } catch (error) {
      console.error('There was an error fetching the content:', error);
    }
  };

  useEffect(() => {
    if (chapters) {
      const fetchAllContent = async () => {
        const contentPromises = [];
        for (const [chapterName, subchapters] of Object.entries(chapters)) {
          for (const subchapter of subchapters) {
            contentPromises.push(fetchContent(chapterName, subchapter));
          }
        }
        await Promise.all(contentPromises);
        setIsLoading(false);
      };

      fetchAllContent();
    }
  }, [prompt, chapters, setContent, userId]);

  const handleStartCourse = async () => {
    // Save the course data to the database
    try {
      const response = await fetch('http://localhost:5000/save-course-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          input_data: prompt,
          course_outline: chapters,
          course_content: content
        })
      });
      if (!response.ok) {
        throw new Error('Failed to save course data');
      }
      console.log("Course data saved successfully");
    } catch (error) {
      console.error('Error saving course data:', error);
    }

    window.location.href = "/schoolai/courseContent";
  };

  const extractNumber = (str) => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortChaptersNumerically = (a, b) => {
    return extractNumber(a) - extractNumber(b);
  };

  return (
    <>
    <Header />
    <div className={`${styles.sectionPadding} ${styles.bgCover} ${styles.bgNoRepeat} ${styles.bgCenter} ${styles.minHScreen} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`}>
      <div className={`${styles.container} ${styles.bgWhite} ${styles.shadowBox5} ${styles.rounded} ${styles.p8}`}>
        <div className={styles.finalViewHeader}>
          <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.textCenter}`}>Final View for "{prompt}"</h1>
        </div>
        <button onClick={handleStartCourse} className={`${styles.btn} ${styles.btnPrimary} ${styles.mt4} ${styles.wFull}`} disabled={isLoading}>
          Start Course
        </button>
        {chapters ? (
          <div className={styles.chaptersContainer}>
            {Object.entries(chapters)
              .sort(([a], [b]) => sortChaptersNumerically(a, b))
              .map(([chapterName, subchapters], chapterIndex) => (
                <div key={chapterIndex} className={styles.chapterCard}>
                  <h2 className={styles.chapterTitle}>{chapterName}</h2>
                  {subchapters
                    .sort((a, b) => sortChaptersNumerically(a, b))
                    .map((subchapter, subchapterIndex) => (
                      <div key={subchapterIndex} className={styles.subchapterCard}>
                        <h3 className={styles.subchapterTitle}>{`Course ${subchapterIndex + 1}: ${subchapter}`}</h3>
                        <div className={styles.subchapterContent} dangerouslySetInnerHTML={{ __html: content[`${chapterName}-${subchapter}`] || '<p>Loading...</p>' }} />
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ) : (
          <p>No chapters available</p>
        )}
      </div>
    </div>
    </>
  );
};

export default FinalViewPage;
