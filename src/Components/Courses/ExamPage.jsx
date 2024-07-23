import React, { useState, useEffect } from 'react';
import styles from '../../style/ExamPage.module.css';
import spinner from '../../assets/images/all-img/b-s-1.png';
import Header from '../Header'

const ExamPage = ({ chapterName, subchapterName, prompt, setContent }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExamQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/generate-exam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chapter_name: chapterName, subchapter_name: subchapterName, prompt })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched Exam Questions:", data); // Debug output
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error('There was an error fetching the exam questions:', error);
        setIsLoading(false);
      }
    };

    fetchExamQuestions();
  }, [chapterName, subchapterName, prompt]);

  const handleAnswerChange = (question, answer) => {
    setUserAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const handleSubmitExam = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/evaluate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questions, answers: userAnswers })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data);
      console.log("Exam Results:", data); // Debug output
      setIsLoading(false);
    } catch (error) {
      console.error('There was an error submitting the exam:', error);
      setIsLoading(false);
    }
  };

  const getGrade = (score) => {
    if (score >= 4.5) return "Excellent Understanding";
    if (score >= 3.5) return "Good Understanding";
    if (score >= 2.5) return "Fair Understanding";
    if (score >= 1.5) return "Poor Understanding";
    return "Bad Understanding";
  };

  const renderQuestion = (q, index) => {
    if (q.type === 'selection') {
      return (
        <div key={index} className={styles.question}>
          <p className={styles.questionText}>Problem {index + 1}: {q.question}</p>
          <div className={styles.options}>
            {q.options.map((option, i) => (
              <label key={i} className={styles.option}>
                {option}
                <input
                  type="radio"
                  name={q.question}
                  value={option}
                  checked={userAnswers[q.question] === option}
                  onChange={() => handleAnswerChange(q.question, option)}
                />
              </label>
            ))}
          </div>
        </div>
      );
    } else if (q.type === 'fill-in-the-blank') {
      const parts = q.question.split('__blank__');
      return (
        <div key={index} className={styles.question}>
          <p className={styles.questionText}>Problem {index + 1}: 
            {parts[0]}
            <input
              type="text"
              className={styles.fillBlank}
              name={q.question}
              value={userAnswers[q.question] || ''}
              onChange={(e) => handleAnswerChange(q.question, e.target.value)}
            />
            {parts[1]}
          </p>
        </div>
      );
    } else if (q.type === 'entry') {
      return (
        <div key={index} className={styles.question}>
          <p className={styles.questionText}>Problem {index + 1}: {q.question}</p>
          <textarea
            name={q.question}
            value={userAnswers[q.question] || ''}
            onChange={(e) => handleAnswerChange(q.question, e.target.value)}
            className={styles.entryTextarea}
          />
        </div>
      );
    }
  };

  return (
    <>
    <Header />
    <div className={`${styles.sectionPadding} ${styles.bgCover} ${styles.bgNoRepeat} ${styles.bgCenter} ${styles.minHScreen} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`}>
      <div className={`${styles.container} ${styles.bgWhite} ${styles.shadowBox5} ${styles.rounded} ${styles.p8}`}>
        <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.textCenter}`}>Exam for {chapterName} - {subchapterName}</h1>
        {isLoading ? (
          <div className={styles.loading}>
            <img src={spinner} alt="Loading..." className={styles.spinner} />
          </div>
        ) : questions.length > 0 ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitExam(); }}>
            {questions.map((q, index) => renderQuestion(q, index))}
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.mt4}`}>Submit Exam</button>
          </form>
        ) : (
          <p>Loading exam questions...</p>
        )}
        {results && (
          <div className={styles.results}>
            <h2 className={`${styles.text2xl} ${styles.fontBold}`}>Results</h2>
            <p>Score: {results.score}</p>
            <p>Grade: {getGrade(results.score)}</p>
            {questions.map((q, index) => (
              <div key={index} className={results.results[q.question] ? styles.correct : styles.incorrect}>
                <p>Problem {index + 1}: {q.question} - {results.results[q.question] ? 'Correct' : 'Incorrect'}</p>
                {showCorrectAnswers && !results.results[q.question] && (
                  <p className={styles.correctAnswer}>Correct answer: {q.correct_answer}</p>
                )}
                {showCorrectAnswers && results.explanations && (
                  <p className={styles.explanation}>Explanation: {results.explanations[q.question]}</p>
                )}
              </div>
            ))}
            <button onClick={() => setShowCorrectAnswers(true)} className={`${styles.btn} ${styles.btnSecondary} ${styles.mt4}`}>Show Correct Answers</button>
          </div>
        )}
        <button onClick={() => window.location.href = "/schoolai/courseContent"} className={`${styles.btn} ${styles.btnSecondary} ${styles.mt4}`}>Back to Course</button>
      </div>
    </div>
    </>
  );
};

export default ExamPage;
