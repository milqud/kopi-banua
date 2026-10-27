const KUNCI_PESANAN = "pesananKopiBanua";
const KUNCI_PRODUK = "produkKopiBanua";

const produkAwal = [
  { id: 1, nama: "Kopi Susu Gula Aren", harga: 18000, kategori: "Kopi",
    gambar: "image/kopi-susu.jpg",
    deskripsi: "Espresso robusta, susu segar, dan gula aren Kandangan." },

  { id: 2, nama: "Americano Panas", harga: 15000, kategori: "Kopi",
    gambar: "image/americano.jpg",
    deskripsi: "Espresso ganda dengan air panas. Pahit bersih tanpa gula." },

  { id: 3, nama: "Kopi Tubruk Banua", harga: 12000, kategori: "Kopi",
    gambar: "image/kopi-tubruk-banua.jpg",
    deskripsi: "Robusta Pengaron diseduh tubruk, disajikan dengan gula terpisah." },

  { id: 4, nama: "Cappuccino", harga: 20000, kategori: "Kopi",
    gambar: "image/kappuccino.jpg",
    deskripsi: "Espresso dengan busa susu tebal dan taburan bubuk kakao." },

  { id: 5, nama: "Es Kopi Pandan", harga: 20000, kategori: "Kopi",
    gambar: "image/kopi-pandan.jpg",
    deskripsi: "Kopi susu dingin dengan sirup pandan wangi buatan sendiri." },

  { id: 6, nama: "Teh Tarik", harga: 14000, kategori: "Non-Kopi",
    gambar: "image/teh-tarik.jpg",
    deskripsi: "Teh susu khas yang ditarik hingga berbusa lembut." },

  { id: 7, nama: "Cokelat Panas", harga: 17000, kategori: "Non-Kopi",
    gambar: "image/cokelat.jpg",
    deskripsi: "Cokelat pekat dengan susu segar, manis yang pas." },

  { id: 8, nama: "Es Jeruk Peras", harga: 12000, kategori: "Non-Kopi",
    gambar: "image/es-jeruk.jpg",
    deskripsi: "Jeruk peras segar tanpa pemanis buatan." },

  { id: 9, nama: "Teh Serai Madu", harga: 15000, kategori: "Non-Kopi",
    gambar: "image/teh-serai.jpg",
    deskripsi: "Teh hangat dengan serai dan madu hutan Kalimantan." },

  { id: 10, nama: "Roti Bakar Srikaya", harga: 16000, kategori: "Cemilan",
    gambar: "image/roti-bakar-srikaya.jpg",
    deskripsi: "Roti bakar isi srikaya buatan sendiri." },

  { id: 11, nama: "Pisang Goreng Keju", harga: 15000, kategori: "Cemilan",
    gambar: "image/pisang-goreng.jpg",
    deskripsi: "Pisang kepok goreng renyah dengan parutan keju." },

  { id: 12, nama: "Wadai Bingka Kentang", harga: 18000, kategori: "Cemilan",
    gambar: "image/bingka.jpg",
    deskripsi: "Kue tradisional Banjar yang lembut dan harum." }
];

const produkTersimpan = JSON.parse(localStorage.getItem(KUNCI_PRODUK));
const produk = (produkTersimpan || produkAwal).map(item => {
  const asli = produkAwal.find(p => p.id === item.id);
  if (asli) {
    return { ...item, gambar: asli.gambar };
  }
  return item;
});

function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

function hitungSubtotal(harga, jumlah) {
  return harga * jumlah;
}

function cariProduk(id) {
  return produk.find(p => p.id === id);
}

function ambilPesanan() {
  return JSON.parse(localStorage.getItem(KUNCI_PESANAN)) || [];
}

function simpanSemuaPesanan(daftar) {
  localStorage.setItem(KUNCI_PESANAN, JSON.stringify(daftar));
}

function amankanTeks(teks) {
  return String(teks)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
