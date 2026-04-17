import { useState } from 'react';

type AddAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onCapture: (label: string) => Promise<void>;
};

export function AddAccountModal(props: AddAccountModalProps) {
  const [label, setLabel] = useState('');
  const [pending, setPending] = useState(false);

  if (!props.open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <section className="modal-panel">
        <div className="modal-header">
          <div>
            <p className="eyebrow">계정 등록</p>
            <h2>새 계정 추가</h2>
          </div>
          <button className="ghost-button" onClick={props.onClose}>
            닫기
          </button>
        </div>
        <label className="field">
          <span>계정 이름</span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="예: 메인, 백업, 팀 계정"
          />
        </label>
        <div className="modal-copy">
          <p>현재 Codex에 로그인된 계정을 바로 저장합니다.</p>
          <p>다른 계정도 Codex에서 직접 로그인한 상태라면 같은 방식으로 추가할 수 있습니다.</p>
        </div>
        <div className="modal-actions">
          <button
            className="primary-button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              try {
                await props.onCapture(label);
                setLabel('');
              } finally {
                setPending(false);
              }
            }}
          >
            현재 Codex 인증 저장
          </button>
        </div>
      </section>
    </div>
  );
}
