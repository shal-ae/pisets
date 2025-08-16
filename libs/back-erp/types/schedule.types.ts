export interface Schedule {
  daysOfWeek: number[],  // 1..7 days of week to start
  expiresInMinutes: number, //  need to start after finish again in XX minutes
  timeToStartFromStr: string,  // '00:00'
  timeToStartToStr: string     // '23:59'
}

export const DEFAULT_SCHEDULE: Readonly<Schedule> = {
  daysOfWeek: [],
  expiresInMinutes: 0,
  timeToStartFromStr: '',
  timeToStartToStr: '',
}
