import backgroundImage from "../../resources/background.png";
import "../App.css";

export default function NewScenario() {
  return (
    <div
      className="app__background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {/* 여기에 new Scenario의 실제 내용을 그대로 옮겨서 넣으세요 */}
      <div style={{ color: "white", padding: 40, fontSize: 24 }}>
        <h1>새 시나리오</h1>
        <p>여기에 new Scenario의 실제 내용을 그대로 넣으세요.</p>
        {/* 요원 이미지, 맵 view 이미지 등은 실제 파일이 들어오면 경로만 맞춰서 사용 */}
        <div style={{ marginTop: 32 }}>
          <img src="/resources/images/view/Ascent_view.webp" alt="맵 뷰 예시" style={{ width: 400, borderRadius: 16 }} />
        </div>
        <div style={{ marginTop: 32 }}>
          <img src="/resources/images/agent/Brimstone.png" alt="요원 예시" style={{ width: 120, borderRadius: 16, background: '#222' }} />
        </div>
      </div>
    </div>
  );
}
