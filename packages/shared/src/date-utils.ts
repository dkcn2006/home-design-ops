export interface DateContext {
  /** 当前基准日期，ISO 格式 YYYY-MM-DD */
  today: string;
  /** 判断给定日期是否已逾期（严格小于 today） */
  isOverdue(dueDate: string | undefined): boolean;
  /** 判断最后联系日期是否已超过 stale 阈值 */
  isStale(lastContactDate: string | undefined, staleDays: number): boolean;
  /** 判断跟进日期是否就是今天 */
  isTodayFollowUp(followUpDate: string | undefined): boolean;
  /** 判断给定日期是否严格小于 today */
  isBeforeToday(date: string | undefined): boolean;
}

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getToday(): string {
  return toISODate(new Date());
}

export function createDateContext(todayInput?: string): DateContext {
  const today = todayInput && /^\d{4}-\d{2}-\d{2}$/.test(todayInput)
    ? todayInput
    : getToday();

  return {
    today,
    isOverdue(dueDate) {
      return !!dueDate && dueDate < today;
    },
    isStale(lastContactDate, staleDays) {
      if (!lastContactDate || staleDays <= 0) return false;
      const staleThreshold = addDays(today, -staleDays);
      return lastContactDate < staleThreshold;
    },
    isTodayFollowUp(followUpDate) {
      return followUpDate === today;
    },
    isBeforeToday(date) {
      return !!date && date < today;
    }
  };
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
