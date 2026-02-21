import { useEffect, useRef, useState } from "react";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getEyeDistractionScore(landmarks) {
  // MediaPipe FaceMesh landmark IDs for iris + eye corners/lids.
  const rightIris = landmarks[468];
  const leftIris = landmarks[473];

  const rightInner = landmarks[133];
  const rightOuter = landmarks[33];
  const leftInner = landmarks[362];
  const leftOuter = landmarks[263];

  const rightTop = landmarks[159];
  const rightBottom = landmarks[145];
  const leftTop = landmarks[386];
  const leftBottom = landmarks[374];

  if (
    !rightIris ||
    !leftIris ||
    !rightInner ||
    !rightOuter ||
    !leftInner ||
    !leftOuter ||
    !rightTop ||
    !rightBottom ||
    !leftTop ||
    !leftBottom
  ) {
    return 0;
  }

  const getAxisOffset = (center, target, halfSpan) => {
    if (halfSpan <= 0.00001) return 0;
    return Math.abs((target - center) / halfSpan);
  };

  const rightCenterX = (rightInner.x + rightOuter.x) / 2;
  const leftCenterX = (leftInner.x + leftOuter.x) / 2;
  const rightHalfX = Math.abs(rightOuter.x - rightInner.x) / 2;
  const leftHalfX = Math.abs(leftOuter.x - leftInner.x) / 2;

  const rightCenterY = (rightTop.y + rightBottom.y) / 2;
  const leftCenterY = (leftTop.y + leftBottom.y) / 2;
  const rightHalfY = Math.abs(rightBottom.y - rightTop.y) / 2;
  const leftHalfY = Math.abs(leftBottom.y - leftTop.y) / 2;

  const horizontalOffset =
    (getAxisOffset(rightCenterX, rightIris.x, rightHalfX) +
      getAxisOffset(leftCenterX, leftIris.x, leftHalfX)) /
    2;

  const verticalOffset =
    (getAxisOffset(rightCenterY, rightIris.y, rightHalfY) +
      getAxisOffset(leftCenterY, leftIris.y, leftHalfY)) /
    2;

  // Weighted composite score; >~0.6 usually indicates looking away from screen center.
  return horizontalOffset * 0.7 + verticalOffset * 0.3;
}

export default function useEyeProctoring({ enabled }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const awayStartedAtRef = useRef(null);
  const warningIssuedForCurrentAwayRef = useRef(false);
  const totalAwayMsRef = useRef(0);
  const maxAwayMsRef = useRef(0);
  const lockedAtRef = useRef(null);
  const isLockedRef = useRef(false);
  const stopAllRef = useRef(() => {});

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [awaySeconds, setAwaySeconds] = useState(0);
  const [totalAwaySeconds, setTotalAwaySeconds] = useState(0);
  const [maxAwaySeconds, setMaxAwaySeconds] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const [violations, setViolations] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!enabled) return undefined;

    let isCancelled = false;

    const stopAll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      awayStartedAtRef.current = null;
      warningIssuedForCurrentAwayRef.current = false;
      totalAwayMsRef.current = 0;
      maxAwayMsRef.current = 0;
      lockedAtRef.current = null;
      setIsMonitoring(false);
      setIsCameraReady(false);
      setIsLocked(false);
      isLockedRef.current = false;
      setAwaySeconds(0);
      setTotalAwaySeconds(0);
      setMaxAwaySeconds(0);
      setWarnings(0);
      setWarningMessage("");
      setStatus("idle");
    };
    stopAllRef.current = stopAll;

    const triggerViolationLock = (now) => {
      if (lockedAtRef.current) return;
      lockedAtRef.current = now;
      setViolations((prev) => prev + 1);
      setIsLocked(true);
      isLockedRef.current = true;
    };

    const finalizeAwayPeriod = (now) => {
      if (!awayStartedAtRef.current) return;
      const awayMs = Math.max(0, now - awayStartedAtRef.current);
      totalAwayMsRef.current += awayMs;
      maxAwayMsRef.current = Math.max(maxAwayMsRef.current, awayMs);
      setTotalAwaySeconds(totalAwayMsRef.current / 1000);
      setMaxAwaySeconds(maxAwayMsRef.current / 1000);
      awayStartedAtRef.current = null;
      warningIssuedForCurrentAwayRef.current = false;
    };

    const begin = async () => {
      try {
        setPermissionError("");
        setStatus("initializing");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        setIsCameraReady(true);

        const vision = await import("@mediapipe/tasks-vision");
        const filesetResolver = await vision.FilesetResolver.forVisionTasks(WASM_URL);
        const faceLandmarker = await vision.FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: MODEL_URL,
            },
            runningMode: "VIDEO",
            numFaces: 1,
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
          }
        );

        if (isCancelled) {
          faceLandmarker.close();
          return;
        }

        faceLandmarkerRef.current = faceLandmarker;
        setIsMonitoring(true);
        setStatus("focused");

        const loop = () => {
          if (isCancelled || !faceLandmarkerRef.current || !videoRef.current) return;

          const now = performance.now();
          const result = faceLandmarkerRef.current.detectForVideo(videoRef.current, now);
          const face = result.faceLandmarks?.[0];

          if (!face) {
            if (!awayStartedAtRef.current) {
              awayStartedAtRef.current = now;
            }
            const secondsAway = (now - awayStartedAtRef.current) / 1000;
            setAwaySeconds(secondsAway);
            setStatus("no-face");
            setWarningMessage("Face not visible. Keep your face centered on screen.");

            if (secondsAway >= 1 && !warningIssuedForCurrentAwayRef.current) {
              warningIssuedForCurrentAwayRef.current = true;
              setWarnings((prev) => prev + 1);
            }

            if (secondsAway >= 1.8) {
              triggerViolationLock(now);
            }
          } else {
            const distractionScore = getEyeDistractionScore(face);
            const looksAway = distractionScore > 0.62;

            if (looksAway) {
              if (!awayStartedAtRef.current) {
                awayStartedAtRef.current = now;
              }
              const secondsAway = (now - awayStartedAtRef.current) / 1000;
              setAwaySeconds(secondsAway);
              setStatus("looking-away");
              setWarningMessage("Please do not look sideways. Keep eyes on screen.");

              if (secondsAway >= 1 && !warningIssuedForCurrentAwayRef.current) {
                warningIssuedForCurrentAwayRef.current = true;
                setWarnings((prev) => prev + 1);
              }

              if (secondsAway >= 2.2) {
                triggerViolationLock(now);
              }
            } else {
              finalizeAwayPeriod(now);
              setAwaySeconds(0);
              setWarningMessage("");
              setStatus("focused");

              if (isLockedRef.current && lockedAtRef.current && now - lockedAtRef.current > 1400) {
                setIsLocked(false);
                isLockedRef.current = false;
                lockedAtRef.current = null;
              }
            }
          }

          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
      } catch {
        setPermissionError(
          "Camera permission is required for interview proctoring. Please allow camera access."
        );
        setStatus("error");
      }
    };

    begin();

    return () => {
      isCancelled = true;
      stopAll();
    };
  }, [enabled]);

  return {
    videoRef,
    isCameraReady,
    permissionError,
    isMonitoring,
    awaySeconds: clamp(awaySeconds, 0, 60),
    totalAwaySeconds: clamp(totalAwaySeconds, 0, 60 * 60),
    maxAwaySeconds: clamp(Math.max(maxAwaySeconds, awaySeconds), 0, 60),
    warnings,
    warningMessage,
    violations,
    isLocked,
    status,
    stopProctoring: () => stopAllRef.current(),
  };
}
