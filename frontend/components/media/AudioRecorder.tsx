import { useRef, useState } from "react";

const AudioRecorder: React.FC = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const chunks = useRef<Blob[]>([]);

  // شروع ضبط صدا
  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event: BlobEvent) => {
          chunks.current.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks.current, { type: "audio/webm" });

          setAudioBlob(audioBlob);
          chunks.current = []; // پاکسازی آرایه پس از توقف ضبط
        };

        recorder.start();
        setMediaRecorder(recorder);
      } catch (error) {
        console.error("خطا در دسترسی به میکروفون:", error);
        alert("دسترسی به میکروفون ممکن نیست.");
      }
    } else {
      alert("مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.");
    }
  };

  // توقف ضبط صدا
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  // ارسال فایل ضبط‌شده به سرور
  const uploadAudio = async () => {
    if (audioBlob) {
      const formData = new FormData();

      formData.append("audio", audioBlob, "recording.webm");

      try {
        const response = await fetch("/api/upload-audio", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("فایل با موفقیت ارسال شد!");
        } else {
          alert("ارسال فایل ناموفق بود.");
        }
      } catch (error) {
        console.error("خطا در ارسال فایل:", error);
        alert("خطایی در ارسال فایل رخ داده است.");
      }
    } else {
      alert("فایلی برای ارسال وجود ندارد.");
    }
  };

  return (
    <div>
      <button disabled={!!mediaRecorder} onClick={startRecording}>
        شروع ضبط
      </button>
      <button disabled={!mediaRecorder} onClick={stopRecording}>
        توقف ضبط
      </button>
      <button disabled={!audioBlob} onClick={uploadAudio}>
        ارسال به سرور
      </button>
    </div>
  );
};

export default AudioRecorder;
