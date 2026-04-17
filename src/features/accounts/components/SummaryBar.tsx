type SummaryBarProps = {
  activeLabel: string;
  recommendedLabel: string;
  recommendedDisabled: boolean;
  onSwitchRecommended: () => void;
  onRefreshAll: () => void;
  onTerminateCodex: () => void;
  onAddAccount: () => void;
};

export function SummaryBar(props: SummaryBarProps) {
  return (
    <section className="summary-bar">
      <div className="summary-cell">
        <p className="eyebrow">현재 계정</p>
        <strong>{props.activeLabel}</strong>
      </div>
      <div className="summary-cell">
        <p className="eyebrow">추천 계정</p>
        <strong>{props.recommendedLabel}</strong>
      </div>
      <div className="summary-actions">
        <div className="summary-action-row">
          <button
            className="ghost-button"
            onClick={props.onSwitchRecommended}
            disabled={props.recommendedDisabled}
          >
            추천으로 전환
          </button>
          <button className="secondary-button" onClick={props.onRefreshAll}>
            전체 갱신
          </button>
          <button className="ghost-button" onClick={props.onTerminateCodex}>
            코덱스 종료
          </button>
          <button className="primary-button" onClick={props.onAddAccount}>
            계정 추가
          </button>
        </div>
      </div>
    </section>
  );
}
