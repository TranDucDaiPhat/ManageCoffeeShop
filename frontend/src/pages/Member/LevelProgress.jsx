import React from "react";
import styles from "./LevelProgress.module.css";

const LEVELS = [
  { name: "MEMBER", point: 0 },
  { name: "VIP", point: 20 },
  { name: "DIAMOND", point: 30 },
];

const LevelProgress = ({ currentPoint = 0 }) => {
  const getCurrentLevelIndex = () => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (currentPoint >= LEVELS[i].point) return i;
    }
    return 0;
  };

  const currentLevelIndex = getCurrentLevelIndex();
  const nextLevel =
    currentLevelIndex < LEVELS.length - 1
      ? LEVELS[currentLevelIndex + 1]
      : null;

  const currentLevel = LEVELS[currentLevelIndex];
  const nextPoint = nextLevel ? nextLevel.point : currentLevel.point;
  const prevPoint = currentLevel.point;

  const minPoint = LEVELS[0].point;
  const maxPoint = LEVELS[LEVELS.length - 1].point;

  const progressPercent = Math.min(
    100,
    ((currentPoint - minPoint) / (maxPoint - minPoint)) * 100
  );

  const remaining =
    nextLevel && nextPoint > currentPoint ? nextPoint - currentPoint : 0;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Hạng thành viên: {currentLevel.name}</div>
      <div className={styles.progressContainer}>
        {LEVELS.map((level, index) => {
          const leftPercent =
            ((level.point - minPoint) / (maxPoint - minPoint)) * 100;

          return (
            <div
              key={level.name}
              className={`${styles.level} ${
                index <= currentLevelIndex ? styles.active : ""
              }`}
              style={{ left: `${leftPercent}%` }}
            >
              <div className={styles.dot} />
              <span className={styles.label}>{level.name}</span>
            </div>
          );
        })}
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {nextLevel && (
        <div className={styles.description}>
          Cần thêm <span className={styles.green}>{remaining} điểm</span> để lên
          hạng <span className={styles.green}>{nextLevel.name}</span>
        </div>
      )}
    </div>
  );
};

export default LevelProgress;
