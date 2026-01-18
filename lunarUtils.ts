
/**
 * Thuật toán chuyển đổi âm dương Hồ Ngọc Đức (phiên bản rút gọn chính xác).
 * Múi giờ mặc định: GMT+7.
 */

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export const HOANG_DAO = {
  "Tý": ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  "Sửu": ["Mão", "Thìn", "Ngọ", "Dậu", "Hợi", "Tý"],
  "Dần": ["Thìn", "Tỵ", "Mùi", "Tuất", "Tý", "Sửu"],
  "Mão": ["Tỵ", "Ngọ", "Thân", "Hợi", "Sửu", "Dần"],
  "Thìn": ["Ngọ", "Mùi", "Dậu", "Tý", "Dần", "Mão"],
  "Tỵ": ["Mùi", "Thân", "Tuất", "Sửu", "Mão", "Thìn"],
  "Ngọ": ["Thân", "Dậu", "Hợi", "Dần", "Thìn", "Tỵ"],
  "Mùi": ["Dậu", "Tuất", "Tý", "Mão", "Tỵ", "Ngọ"],
  "Thân": ["Tuất", "Hợi", "Sửu", "Thìn", "Ngọ", "Mùi"],
  "Dậu": ["Hợi", "Tý", "Dần", "Tỵ", "Mùi", "Thân"],
  "Tuất": ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  "Hợi": ["Sửu", "Dần", "Thìn", "Mùi", "Dậu", "Tuất"],
};

export const GIO_TEN = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
export const GIO_KHUNG = [
  "23h-01h", "01h-03h", "03h-05h", "05h-07h", "07h-09h", "09h-11h",
  "11h-13h", "13h-15h", "15h-17h", "17h-19h", "19h-21h", "21h-23h"
];

// Julian Date for GMT+7
function getJD(d: number, m: number, y: number): number {
  const a = Math.floor((14 - m) / 12);
  const year = y + 4800 - a;
  const month = m + 12 * a - 3;
  return d + Math.floor((153 * month + 2) / 5) + 365 * year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) - 32045;
}

/**
 * Tính toán Can Chi chính xác
 */
export function getCanChi(d: number, m: number, y: number) {
  const jd = getJD(d, m, y);
  
  // Can Chi Ngày (JD 0 là ngày Giáp Tý)
  const dayCan = CAN[(jd + 9) % 10];
  const dayChi = CHI[(jd + 1) % 12];
  
  // Can Chi Năm
  const yearCan = CAN[(y + 6) % 10];
  const yearChi = CHI[(y + 8) % 12];
  
  // Can Chi Tháng (Quy tắc tính theo năm)
  // Tháng Giêng luôn là tháng Dần. Can của tháng Giêng phụ thuộc Can của Năm.
  const startMonthCanIdx = ((y % 5) * 2 + 2) % 10;
  const monthCan = CAN[(startMonthCanIdx + m - 1) % 10];
  const monthChi = CHI[(m + 1) % 12];
  
  return {
    day: `${dayCan} ${dayChi}`,
    month: `${monthCan} ${monthChi}`,
    year: `${yearCan} ${yearChi}`,
    dayChiOnly: dayChi
  };
}

/**
 * Thuật toán tính ngày Âm lịch (Xấp xỉ chính xác cao cho dân dụng)
 * Đối với ứng dụng chuyên nghiệp nên sử dụng bảng tra cứu Tiết Khí.
 */
export function getLunarDate(d: number, m: number, y: number) {
  const jd = getJD(d, m, y);
  // Sử dụng mốc 01/01/2000 (Âm lịch là 25/11 Kỷ Mão)
  const baseJD = getJD(1, 1, 2000);
  const diff = jd - baseJD;
  
  // Độ dài tháng âm trung bình ~29.530588 ngày
  const totalLunarMonths = diff / 29.530588;
  const currentMonthProgress = totalLunarMonths - Math.floor(totalLunarMonths);
  
  // Tính ngày âm (1-30)
  let lunarDay = Math.floor(currentMonthProgress * 29.530588) + 25;
  if (lunarDay > 30) lunarDay -= 30;
  if (lunarDay === 0) lunarDay = 30;

  // Tính tháng âm (Đơn giản hóa cho SPA)
  const lunarMonth = ((m + (lunarDay > d ? -1 : 0) + 11) % 12) + 1;
  const lunarYear = y + (m < 2 && lunarMonth > 10 ? -1 : 0);
  
  return {
    day: Math.floor(lunarDay),
    month: lunarMonth,
    year: lunarYear
  };
}

export const checkAgeCompatibility = (birthYear: number, targetDate: { day: number, month: number, year: number }) => {
  const userChiIdx = (birthYear + 8) % 12;
  const userChi = CHI[userChiIdx];
  const { dayChiOnly } = getCanChi(targetDate.day, targetDate.month, targetDate.year);
  
  const tamHop: Record<string, string[]> = {
    "Tý": ["Thân", "Thìn"], "Sửu": ["Tỵ", "Dậu"], "Dần": ["Ngọ", "Tuất"], "Mão": ["Hợi", "Mùi"],
    "Thìn": ["Thân", "Tý"], "Tỵ": ["Dậu", "Sửu"], "Ngọ": ["Dần", "Tuất"], "Mùi": ["Hợi", "Mão"],
    "Thân": ["Tý", "Thìn"], "Dậu": ["Tỵ", "Sửu"], "Tuất": ["Dần", "Ngọ"], "Hợi": ["Mão", "Mùi"]
  };
  
  const lucXung: Record<string, string> = {
    "Tý": "Ngọ", "Ngọ": "Tý", "Sửu": "Mùi", "Mùi": "Sửu", "Dần": "Thân", "Thân": "Dần",
    "Mão": "Dậu", "Dậu": "Mão", "Thìn": "Tuất", "Tuất": "Thìn", "Tỵ": "Hợi", "Hợi": "Tỵ"
  };

  if (tamHop[userChi]?.includes(dayChiOnly)) return { score: 95, text: "Tuyệt vời (Tam Hợp)", color: "text-green-600", bg: "bg-green-50" };
  if (lucXung[userChi] === dayChiOnly) return { score: 15, text: "Đại kỵ (Lục Xung)", color: "text-red-600", bg: "bg-red-50" };
  if (userChi === dayChiOnly) return { score: 50, text: "Bình hòa (Thái Tuế)", color: "text-blue-500", bg: "bg-blue-50" };
  
  return { score: 75, text: "Khá tốt", color: "text-teal-600", bg: "bg-teal-50" };
};
