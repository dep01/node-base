import { ConfigurationApp } from "../../configuration";

require("dotenv").config();

export class DateUtils {
  private months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  private days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  addLeadingZeroForDate(num: number = 0): string {
    if (num < 10) return `0$${num}`;
    return num.toString();
  }
  genToday(withTime: boolean = true): string {
    const dateGmt = new Date().toLocaleString("en-US", {
      timeZone: ConfigurationApp.app.time_zone,
    });
    const date = new Date(dateGmt);
    let callback =
      date.getFullYear() +
      "-" +
      this.addLeadingZeroForDate(date.getMonth() + 1) +
      "-" +
      this.addLeadingZeroForDate(date.getDate());
    if (withTime) {
      callback +=
        " " +
        this.addLeadingZeroForDate(date.getHours()) +
        ":" +
        this.addLeadingZeroForDate(date.getMinutes()) +
        ":" +
        this.addLeadingZeroForDate(date.getSeconds());
    }
    return callback;
  }
  toSqlDate(date:Date,withTime:boolean=true):string{
    let callback =
      date.getFullYear() +
      "-" +
      this.addLeadingZeroForDate(date.getMonth() + 1) +
      "-" +
      this.addLeadingZeroForDate(date.getDate());
    if (withTime) {
      callback +=
        " " +
        this.addLeadingZeroForDate(date.getHours()) +
        ":" +
        this.addLeadingZeroForDate(date.getMinutes()) +
        ":" +
        this.addLeadingZeroForDate(date.getSeconds());
    }
    return callback;

  }

  getMonthName(month: number): string {
    return this.months[month];
  }
  getDayName(day: number): string {
    return this.days[day];
  }
  beautyDate(d: Date,checkToday:boolean =true, withTime:boolean = true): string {
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const day = d.getDay();
    let callback = `${this.getDayName(day)}, ${this.addLeadingZeroForDate(date)} ${this.getMonthName(month)} ${year} `;
    const today =this.genToday(false);
    const checkDate = this.toSqlDate(d,false);
    if(checkToday && today == checkDate)callback = "Hari ini ";
    if (withTime) {
      callback += `(${this.addLeadingZeroForDate(d.getHours())}:${this.addLeadingZeroForDate(d.getMinutes())})${this.addLeadingZeroForDate(d.getSeconds())}`;
    }
    return callback;
  }
}
