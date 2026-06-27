import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const sampleEntries = [
  { id: crypto.randomUUID(), name: "정대리", activity: "회의 중 창밖 구름 감상", minutes: 67 },
  { id: crypto.randomUUID(), name: "박주임", activity: "새 키보드 후기 탐험", minutes: 48 },
  { id: crypto.randomUUID(), name: "이인턴", activity: "점심 메뉴 월드컵", minutes: 39 },
];

const createSampleEntries = () => sampleEntries.map((entry) => ({ ...entry, id: crypto.randomUUID() }));

const formatMinutes = (minutes) => {
  if (minutes < 60) {
    return `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `${hours}시간` : `${hours}시간 ${remainingMinutes}분`;
};

const getTopActivity = (entries) => {
  if (entries.length === 0) {
    return "-";
  }

  const activityTotals = entries.reduce((totals, entry) => {
    totals[entry.activity] = (totals[entry.activity] ?? 0) + entry.minutes;
    return totals;
  }, {});

  return Object.entries(activityTotals).sort((a, b) => b[1] - a[1])[0][0];
};

function App() {
  const [entries, setEntries] = useState(() => createSampleEntries());
  const [formValues, setFormValues] = useState({ name: "", activity: "", minutes: "" });

  const rankedEntries = useMemo(
    () => [...entries].sort((a, b) => b.minutes - a.minutes),
    [entries],
  );

  const summary = useMemo(() => {
    const totalMinutes = entries.reduce((sum, entry) => sum + entry.minutes, 0);

    return {
      totalTime: formatMinutes(totalMinutes),
      entryCount: entries.length,
      topActivity: getTopActivity(entries),
    };
  }, [entries]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formValues.name.trim();
    const activity = formValues.activity.trim();
    const minutes = Number(formValues.minutes);

    if (!name || !activity || !Number.isFinite(minutes) || minutes < 1) {
      return;
    }

    setEntries((currentEntries) => [
      { id: crypto.randomUUID(), name, activity, minutes },
      ...currentEntries,
    ]);
    setFormValues({ name: "", activity: "", minutes: "" });
  };

  const resetToSamples = () => {
    setEntries(createSampleEntries());
  };

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="topbar" aria-label="서비스 소개">
          <a className="brand" href="#top" aria-label="딴 짓 리더보드 홈">
            <span className="brand-mark">딴</span>
            <span>Off-Task Board</span>
          </a>
          <a className="ghost-link" href="#entry-form">기록 남기기</a>
        </nav>

        <section id="top" className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">팀장님 몰래 보는 생산성 반대편</p>
            <h1>오늘의 딴 짓 챔피언을 우아하게 기록하세요.</h1>
            <p className="hero-description">
              이름, 딴 짓 종류, 시간을 입력하면 즉시 리더보드가 완성됩니다.
              가볍게 웃고, 팀장님은 조용히 한숨 쉬는 세련된 화이트 & 스카이블루 서비스입니다.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#entry-form">딴 짓 등록하기</a>
              <a className="secondary-button" href="#leaderboard">리더보드 보기</a>
            </div>
          </div>

          <aside className="hero-card" aria-label="오늘의 딴 짓 요약">
            <div className="floating-badge">Live</div>
            <p className="card-kicker">오늘의 분위기</p>
            <h2>{summary.totalTime}</h2>
            <p>누적 딴 짓 시간</p>
            <div className="mini-stats">
              <span><strong>{summary.entryCount}</strong>명 참가</span>
              <span><strong>{summary.topActivity}</strong> 인기 딴 짓</span>
            </div>
          </aside>
        </section>
      </header>

      <main>
        <section className="panel input-panel" aria-labelledby="form-title">
          <div>
            <p className="section-label">Add record</p>
            <h2 id="form-title">딴 짓 기록 입력</h2>
            <p className="section-description">
              시간이 긴 순서대로 자동 정렬됩니다. 같은 사람이 여러 번 등록해도 각각의 기록으로 표시됩니다.
            </p>
          </div>

          <form id="entry-form" className="entry-form" onSubmit={handleSubmit}>
            <label>
              이름
              <input
                id="name"
                name="name"
                type="text"
                placeholder="예: 김코딩"
                maxLength="16"
                required
                value={formValues.name}
                onChange={handleChange}
              />
            </label>
            <label>
              딴 짓 종류
              <input
                id="activity"
                name="activity"
                type="text"
                placeholder="예: 고양이 영상 보기"
                maxLength="28"
                required
                value={formValues.activity}
                onChange={handleChange}
              />
            </label>
            <label>
              시간(분)
              <input
                id="minutes"
                name="minutes"
                type="number"
                placeholder="예: 42"
                min="1"
                max="1440"
                required
                value={formValues.minutes}
                onChange={handleChange}
              />
            </label>
            <button type="submit">리더보드에 올리기</button>
          </form>
        </section>

        <section className="leaderboard-section" aria-labelledby="leaderboard-title">
          <div className="section-heading">
            <div>
              <p className="section-label">Ranking</p>
              <h2 id="leaderboard-title">딴 짓 리더보드</h2>
            </div>
            <button id="reset-button" className="text-button" type="button" onClick={resetToSamples}>
              샘플로 초기화
            </button>
          </div>

          <div id="leaderboard" className="leaderboard" aria-live="polite">
            {rankedEntries.length === 0 ? (
              <div className="empty-state">아직 등록된 딴 짓이 없습니다. 첫 기록으로 리더보드를 깨워보세요.</div>
            ) : (
              rankedEntries.map((entry, index) => (
                <article className="rank-card" key={entry.id}>
                  <div className="rank-number">#{index + 1}</div>
                  <div className="rank-body">
                    <h3>{entry.name}</h3>
                    <p>{entry.activity}</p>
                  </div>
                  <div className="time-pill">{formatMinutes(entry.minutes)}</div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.querySelector("#root")).render(<App />);
