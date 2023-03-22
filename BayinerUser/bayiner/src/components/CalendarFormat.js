export default function ({ inputDate }) {
  // Tarihi noktalardan ayırarak, gün, ay ve yıl değerlerini ayrı değişkenlere atayın
  const [day, month, year] = inputDate.split(".");

  // "yyyy-mm-dd" formatında bir tarih oluşturmak için yıl, ay ve gün değerlerini bir araya getirin
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;

  return formattedDate;
}
