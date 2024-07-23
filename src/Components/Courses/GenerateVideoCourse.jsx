import React, { useState, useRef, useEffect } from 'react';
import styles from '../../style/GenerateVideoCourse.module.css';
import Header from '../Header'

const GenerateVideoCourse = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const imageFileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  useEffect(() => {
    document.title = "Generate Video Course"; // Set the title
  }, []);

  const handleGenerate = async () => {
    setIsLoadingImage(true);
    setGeneratedImage(null);
    try {
      const response = await fetch('http://localhost:5000/generate-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedImage(url);

        // Automatically select generated image for avatar
        const imageFile = new File([blob], 'generated-teacher-image.png', { type: 'image/png' });
        setImageFile(imageFile);
        const dt = new DataTransfer();
        dt.items.add(imageFile);
        imageFileInputRef.current.files = dt.files;
      } else {
        console.error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleGenerateVoice = async () => {
    setIsLoadingVoice(true);
    const formData = new FormData(document.getElementById('voice-form'));
    try {
      const response = await fetch('http://localhost:5000/generate-voice', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVoiceUrl(url);
        // Auto play the audio
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
        setIsPlaying(true);

        audio.addEventListener('timeupdate', () => {
          setProgress((audio.currentTime / audio.duration) * 100);
        });

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(0);
        });

        // Automatically select generated voice for avatar
        const audioFile = new File([blob], 'generated-teacher-voice.mp3', { type: 'audio/mpeg' });
        setAudioFile(audioFile);
        const dt = new DataTransfer();
        dt.items.add(audioFile);
        audioFileInputRef.current.files = dt.files;
      } else {
        console.error('Failed to generate voice');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingVoice(false);
    }
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    if (id === 'imageFile') {
      setImageFile(files[0]);
    } else if (id === 'audioFile') {
      setAudioFile(files[0]);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!imageFile || !audioFile) {
      setError('Both files are required');
      setLoading(false);
      return;
    }

    const imageFileName = imageFile.name;
    const audioFileName = audioFile.name;
    const imageFileData = await toBase64(imageFile);
    const audioFileData = await toBase64(audioFile);

    const payload = {
      imageFileName,
      imageFileData,
      audioFileName,
      audioFileData,
    };

    const response = await fetch('http://localhost:5000/generate-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Response:", result);  // Debug log for response

    setLoading(false);

    if (response.status === 200 && result.status === 'completed' && result.output && result.output.output_video) {
      setVideoSrc(result.output.output_video);
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <>
    <Header />
    <div className={`${styles.sectionPadding} ${styles.bgCover} ${styles.bgNoRepeat} ${styles.bgCenter} ${styles.minHScreen} ${styles.flex} ${styles.itemsCenter} ${styles.justifyCenter}`} style={{marginTop: "100px"}}>
      <div className={`${styles.container} ${styles.bgWhite} ${styles.shadowBox5} ${styles.rounded} ${styles.p8}`}>
        <h1 className={`${styles.text3xl} ${styles.fontBold} ${styles.mb6} ${styles.textCenter}`}>Generate Video Course</h1>

        {/* Generate AI Human Teacher Section */}
        <div className={styles.generateSection}>
          <textarea
            placeholder="Enter prompt for AI Human Teacher..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={`${styles.wFull} ${styles.p4} ${styles.border} ${styles.roundedMd} ${styles.focusOutlineNone} ${styles.focusRing2} ${styles.focusRingPrimary} ${styles.mb4}`}
          />
          <button onClick={handleGenerate} disabled={isLoadingImage} className={`${styles.btn} ${styles.btnPrimary}`}>
            {isLoadingImage ? <div className={styles.spinner}></div> : 'Generate Image'}
          </button>
          {generatedImage && (
            <div className={styles.imageContainer}>
              <img src={generatedImage} alt="Generated AI Human Teacher" className={styles.generatedImage} />
            </div>
          )}
          <form id="voice-form" encType="multipart/form-data" className={styles.voiceForm}>
            <div className={styles.voiceSelection}>
              <label htmlFor="voice_id">Select Voice:</label>
              <select name="voice_id" id="voice_id" className={styles.select}>
                {/* Voice options here */}
              </select>
              <textarea
                placeholder="Enter text for voice generation..."
                name="text"
                rows="4"
                cols="50"
                className={`${styles.wFull} ${styles.p4} ${styles.border} ${styles.roundedMd} ${styles.focusOutlineNone} ${styles.focusRing2} ${styles.focusRingPrimary} ${styles.mb4}`}
              />
              <button type="button" onClick={handleGenerateVoice} disabled={isLoadingVoice} className={`${styles.btn} ${styles.btnPrimary}`}>
                {isLoadingVoice ? <div className={styles.spinner}></div> : 'Generate Voice'}
              </button>
              {voiceUrl && (
                <>
                  {isPlaying && <div className={styles.progressBar}><div className={styles.progress} style={{ width: `${progress}%` }}></div></div>}
                </>
              )}
            </div>
          </form>
        </div>

        {/* Generate Avatar Section */}
        <div className={styles.generateSection}>
          <form onSubmit={handleSubmit} className={styles.avatarForm}>
            <label htmlFor="imageFile" className={styles.label}>Image File:</label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              ref={imageFileInputRef}
              className={styles.fileInput}
              required
            /><br /><br />
            {imageFile && (
              <div className={styles.selectedFile}>
                <p>Selected Image File: {imageFile.name}</p>
                <img src={URL.createObjectURL(imageFile)} alt="Selected AI Human Teacher" className={styles.selectedImage} />
              </div>
            )}

            <label htmlFor="audioFile" className={styles.label}>Audio File:</label>
            <input
              type="file"
              id="audioFile"
              accept="audio/*"
              onChange={handleFileChange}
              ref={audioFileInputRef}
              className={styles.fileInput}
              required
            /><br /><br />

            <button type="submit" disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`}>
              {loading ? <div className={styles.spinner}></div> : 'Generate'}
            </button>
          </form>
          {loading && <div className={styles.loadingSpinner}></div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {videoSrc && (
            <div className={styles.resultContainer}>
              <video id="resultVideo" controls className={styles.resultVideo} src={videoSrc}></video>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default GenerateVideoCourse;
