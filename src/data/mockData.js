// src/data/mockData.js

// export const orders = [
//   { id: 1, mijoz: "Toshkent Diler", mahsulot: "Chevrolet Spark", miqdor: 10, holat: "Ishlab chiqarishda", sana: "2025-11-05" },
//   { id: 2, mijoz: "Samarqand Auto", mahsulot: "Chevrolet Onix", miqdor: 5, holat: "Omborda", sana: "2025-11-04" },
// ];

export const warehouse = [
  // Oldingi 4 ta...
  { id: "SPK-001", model: "Chevrolet Spark", rang: "Oq", kategoriya: "Hatchback", status: "Tayyor", location: "A-12", vin: "KL1TF5DE9BB123456", sana: "2025-11-04" },
  { id: "ONX-045", model: "Chevrolet Onix", rang: "Qora", kategoriya: "Sedan", status: "Ta'mirda", location: "B-05", vin: "KL1TF6DE9BB789012", sana: "2025-10-15" },
  { id: "MAL-112", model: "Chevrolet Malibu", rang: "Kulrang", kategoriya: "Sedan", status: "Tayyor", location: "C-03", vin: "KL1TG5DE9BB345678", sana: "2025-09-20" },
  { id: "SPK-078", model: "Chevrolet Spark", rang: "Qizil", kategoriya: "Hatchback", status: "Chiqarildi", location: "D-07", vin: "KL1TF5DE9BB901234", sana: "2025-08-10" },
  // Qo'shimcha test ma'lumotlari
  { id: "ONX-123", model: "Chevrolet Onix", rang: "Oq", kategoriya: "Sedan", status: "Tayyor", location: "A-15", vin: "KL1TF6DE9BB456789", sana: "2025-11-01" },
  { id: "MAL-456", model: "Chevrolet Malibu", rang: "Qora", kategoriya: "Sedan", status: "Tayyor", location: "B-10", vin: "KL1TG5DE9BB567890", sana: "2025-10-25" },
  { id: "SPK-234", model: "Chevrolet Spark", rang: "Kulrang", kategoriya: "Hatchback", status: "Chiqarildi", location: "C-08", vin: "KL1TF5DE9BB678901", sana: "2025-09-05" },
];

export const stats = {
  totalOrders: 124,
  inProduction: 38,
  inWarehouse: 56,
  delivered: 30,
};

// src/data/mockData.js
// src/data/mockData.js (yangilangan orders qismi)
export const orders = [
  { 
    id: 1, 
    mijoz: "Toshkent Diler", 
    model: "Chevrolet Spark", 
    rang: "Oq", 
    miqdor: 10, 
    muddat: "2025-11-20", 
    holat: "Yangi", 
    sana: "2025-11-05" 
  },
  { 
    id: 2, 
    mijoz: "Samarqand Auto", 
    model: "Chevrolet Onix", 
    rang: "Qora", 
    miqdor: 5, 
    muddat: "2025-11-15", 
    holat: "Jarayonda", 
    sana: "2025-11-04" 
  },
  { 
    id: 3, 
    mijoz: "Buxoro Motors", 
    model: "Chevrolet Malibu", 
    rang: "Kulrang", 
    miqdor: 3, 
    muddat: "2025-11-10", 
    holat: "Yetkazildi", 
    sana: "2025-11-03" 
  },
  { 
    id: 4, 
    mijoz: "Farg'ona Auto", 
    model: "Chevrolet Spark", 
    rang: "Qizil", 
    miqdor: 8, 
    muddat: "2025-11-25", 
    holat: "Bekor qilindi", 
    sana: "2025-11-05" 
  },
];

// src/data/mockData.js (qo'shimcha)
export const monthlyData = [
  { oy: 'Yanvar', buyurtma: 45, ishlabchiqarish: 38, ombor: 40, yetkazib: 35 },
  { oy: 'Fevral', buyurtma: 52, ishlabchiqarish: 48, ombor: 50, yetkazib: 45 },
  { oy: 'Mart', buyurtma: 61, ishlabchiqarish: 55, ombor: 58, yetkazib: 52 },
  { oy: 'Aprel', buyurtma: 58, ishlabchiqarish: 52, ombor: 55, yetkazib: 50 },
  { oy: 'May', buyurtma: 72, ishlabchiqarish: 65, ombor: 68, yetkazib: 62 },
  { oy: 'Iyun', buyurtma: 68, ishlabchiqarish: 60, ombor: 62, yetkazib: 58 },
];

export const modelSales = [
  { model: 'Chevrolet Spark', sotuv: 142, foiz: 45 },
  { model: 'Chevrolet Onix', sotuv: 118, foiz: 37 },
  { model: 'Chevrolet Malibu', sotuv: 89, foiz: 18 },
];