const dateOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'Europe/Helsinki',
};

const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  ...dateOptions,
  hour: 'numeric',
  minute: '2-digit',
});

export const eventTypeLabels: Record<string, string> = {
  workshop: 'Workshop',
  event: 'Event',
  festival: 'Festival',
};

interface EventDates {
  startDateTime?: string | null;
  endDateTime?: string | null;
}

export function formatEventDate(
  { startDateTime, endDateTime }: EventDates,
  { withTime = false } = {}
) {
  if (!startDateTime) return 'Date TBD';

  const formatter = withTime ? dateTimeFormatter : dateFormatter;
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;

  return end && end > start ? formatter.formatRange(start, end) : formatter.format(start);
}

export function isPastEvent({ startDateTime, endDateTime }: EventDates) {
  const lastDate = endDateTime ?? startDateTime;
  return lastDate ? new Date(lastDate).getTime() < Date.now() : false;
}

export function formatEventPrice(price?: number | null) {
  if (price === null || price === undefined) return null;
  return price === 0 ? 'Free' : `€${price}`;
}

interface SortableEvent extends EventDates {
  order?: number | null;
}

// Manual order wins; otherwise soonest upcoming, then date TBD, then most recent past.
export function sortEvents<T extends SortableEvent>(events: T[]) {
  const group = (event: T) => {
    if (typeof event.order === 'number') return 0;
    if (isPastEvent(event)) return 3;
    return event.startDateTime ? 1 : 2;
  };
  const time = (event: T) => (event.startDateTime ? new Date(event.startDateTime).getTime() : 0);

  return [...events].sort((a, b) => {
    const groupA = group(a);
    if (groupA !== group(b)) return groupA - group(b);
    if (groupA === 0) return (a.order as number) - (b.order as number);
    return groupA === 3 ? time(b) - time(a) : time(a) - time(b);
  });
}
