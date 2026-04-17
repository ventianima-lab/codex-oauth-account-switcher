import { PLAN_LABELS } from '../../../shared/desktopApi';
import type { AccountRecord } from '../../../core/types';
import {
  formatRemaining,
  formatResetTimestamp,
  formatTimestamp,
  getAccountBadge,
  getAccountScore
} from '../actions';
import type { DesktopState } from '../../../shared/desktopApi';

type AccountCardProps = {
  account: AccountRecord;
  state: DesktopState;
  recommendedId: string | null;
  onRefresh: () => void;
  onDelete: () => void;
  onSwitch: () => void;
};

export function AccountCard(props: AccountCardProps) {
  const { account } = props;
  const badge = getAccountBadge(account, props.state, props.recommendedId);
  const switchDisabled = account.status === 'expired' || account.canSwitch === false;

  return (
    <article className="account-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{PLAN_LABELS[account.planType]}</p>
          <h3>{account.label}</h3>
        </div>
        <span className="badge">{badge}</span>
      </div>
      <dl className="metric-grid">
        <div>
          <dt>5시간 남은 양</dt>
          <dd>{formatRemaining(account.usage?.primaryRemainingPercent)}</dd>
        </div>
        <div>
          <dt>5시간 초기화</dt>
          <dd className="metric-value-compact">
            {formatResetTimestamp(account.usage?.primaryResetAt)}
          </dd>
        </div>
        <div>
          <dt>1주 남은 양</dt>
          <dd>{formatRemaining(account.usage?.secondaryRemainingPercent)}</dd>
        </div>
        <div>
          <dt>1주 초기화</dt>
          <dd className="metric-value-compact">
            {formatResetTimestamp(account.usage?.secondaryResetAt)}
          </dd>
        </div>
        <div>
          <dt>추천 점수</dt>
          <dd>{getAccountScore(account)}</dd>
        </div>
        <div>
          <dt>마지막 확인</dt>
          <dd className="metric-value-compact">
            {formatTimestamp(account.usage?.fetchedAt ?? account.updatedAt)}
          </dd>
        </div>
      </dl>
      {account.switchBlockedReason ? (
        <p className="card-note">{account.switchBlockedReason}</p>
      ) : null}
      <div className="card-actions">
        <button className="secondary-button" onClick={props.onRefresh}>
          갱신
        </button>
        <button className="ghost-button" onClick={props.onDelete}>
          삭제
        </button>
        <button
          className="primary-button"
          onClick={props.onSwitch}
          disabled={switchDisabled}
          title={account.switchBlockedReason ?? undefined}
        >
          이 계정으로 전환
        </button>
      </div>
    </article>
  );
}
