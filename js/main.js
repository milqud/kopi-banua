"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const wadahMenu = document.getElementById("daftar-menu");
  const tombolFilter = document.querySelectorAll(".tombol-filter");
  const pilihUrut = document.getElementById("pilih-urut");

  const formPesan = document.getElementById("form-pesan");
  const inputNama = document.getElementById("nama-pemesan");
  const inputWa = document.getElementById("wa-pemesan");
  const pilihProduk = document.getElementById("pilih-produk");
  const jumlahPesan = document.getElementById("jumlah-pesan");
  const catatanPesan = document.getElementById("catatan-pesan");
  const labelTotal = document.getElementById("label-total");

  const isiTabelPesanan = document.getElementById("isi-tabel-pesanan");
  const tombolHapusPesanan = document.getElementById("tombol-hapus-pesanan");

  let kategoriAktif = "Semua";
  let urutanAktif = "baru";

  function buatPlaceholderSvg(nama, kategori) {
    const latar = kategori === "Cemilan" ? "#efe3c8" : kategori === "Non-Kopi" ? "#e4ecd8" : "#d8e6d9";
    const warnaIkon = kategori === "Cemilan" ? "#d99b4e" : kategori === "Non-Kopi" ? "#6d8c49" : "#3b5e43";
    const ikon = kategori === "Cemilan"
      ? `<ellipse cx="200" cy="128" rx="64" ry="14" fill="#ffffff" opacity="0.85"/><rect x="166" y="96" width="68" height="28" rx="8" fill="${warnaIkon}"/><rect x="172" y="88" width="56" height="12" rx="5" fill="#e6b566"/>`
      : `<path d="M185 68 Q182 56 188 48 M200 66 Q197 54 203 46 M215 68 Q212 56 218 48" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M162 78 H228 V112 C228 128 214 138 195 138 C176 138 162 128 162 112 Z" fill="${warnaIkon}"/><path d="M228 86 H238 C245 86 245 108 238 108 H228" stroke="${warnaIkon}" stroke-width="6" fill="none"/><ellipse cx="195" cy="140" rx="52" ry="8" fill="#ffffff" opacity="0.75"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="400" height="220"><rect width="400" height="220" fill="${latar}"/>${ikon}<rect y="176" width="400" height="44" fill="#1e2d22"/><text x="200" y="203" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">${amankanTeks(nama)}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function renderKartuMenu(daftar) {
    if (!wadahMenu) return;

    if (daftar.length === 0) {
      wadahMenu.innerHTML = `<p class="menu-kosong">Tidak ada menu pada kategori ini.</p>`;
      return;
    }

    wadahMenu.innerHTML = daftar
      .map(
        (p) => `
        <article class="kartu-menu">
          <img src="${p.gambar}" alt="${amankanTeks(p.nama)}" data-nama="${amankanTeks(p.nama)}" data-kategori="${amankanTeks(p.kategori)}" loading="lazy" />
          <div class="kartu-menu-isi">
            <span class="kategori-lencana">${amankanTeks(p.kategori)}</span>
            <h3>${amankanTeks(p.nama)}</h3>
            <p class="deskripsi">${amankanTeks(p.deskripsi)}</p>
            <p class="harga">${formatRupiah(p.harga)}</p>
            <button type="button" class="tombol tombol-utama tombol-pesan" data-id="${p.id}">
              Pesan Ini
            </button>
          </div>
        </article>
      `
      )
      .join("");

    wadahMenu.querySelectorAll(".kartu-menu img").forEach((img) => {
      img.addEventListener("error", function () {
        if (!this.dataset.pakaiSvg) {
          this.dataset.pakaiSvg = "1";
          this.src = buatPlaceholderSvg(this.dataset.nama || "Menu Kopi Banua", this.dataset.kategori || "Kopi");
        }
      });
    });

    wadahMenu.querySelectorAll(".tombol-pesan").forEach((tombol) => {
      tombol.addEventListener("click", () => {
        const idProduk = Number(tombol.dataset.id);
        if (pilihProduk) {
          pilihProduk.value = idProduk;
          perbaruiTotal();
        }

        const bagianPesan = document.getElementById("pesan");
        if (bagianPesan) {
          bagianPesan.scrollIntoView({ behavior: "smooth" });
        }

        if (inputNama) {
          setTimeout(() => inputNama.focus(), 500);
        }
      });
    });
  }

  function perbaruiTampilanMenu() {
    let hasil = [...produk];

    if (kategoriAktif !== "Semua") {
      hasil = hasil.filter((p) => p.kategori === kategoriAktif);
    }

    if (urutanAktif === "murah") {
      hasil.sort((a, b) => a.harga - b.harga);
    } else if (urutanAktif === "mahal") {
      hasil.sort((a, b) => b.harga - a.harga);
    } else if (urutanAktif === "nama") {
      hasil.sort((a, b) => a.nama.localeCompare(b.nama));
    } else {
      hasil.sort((a, b) => a.id - b.id);
    }

    renderKartuMenu(hasil);
  }

  tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", () => {
      tombolFilter.forEach((t) => t.classList.remove("aktif"));
      tombol.classList.add("aktif");
      kategoriAktif = tombol.dataset.kategori;
      perbaruiTampilanMenu();
    });
  });

  if (pilihUrut) {
    pilihUrut.addEventListener("change", () => {
      urutanAktif = pilihUrut.value;
      perbaruiTampilanMenu();
    });
  }

  function isiDropdownProduk() {
    if (!pilihProduk) return;

    pilihProduk.innerHTML = `
      <option value="">-- Pilih Menu --</option>
      ${produk
        .map(
          (p) => `<option value="${p.id}">${p.nama} (${formatRupiah(p.harga)})</option>`
        )
        .join("")}
    `;
  }

  function perbaruiTotal() {
    if (!pilihProduk || !jumlahPesan || !labelTotal) return;

    const id = Number(pilihProduk.value);
    const p = cariProduk(id);
    const jumlah = Math.max(1, Number(jumlahPesan.value) || 1);

    if (p) {
      const subtotal = hitungSubtotal(p.harga, jumlah);
      labelTotal.textContent = formatRupiah(subtotal);
    } else {
      labelTotal.textContent = "Rp 0";
    }
  }

  if (pilihProduk) pilihProduk.addEventListener("change", perbaruiTotal);
  if (jumlahPesan) jumlahPesan.addEventListener("input", perbaruiTotal);

  function renderTabelPesanan() {
    if (!isiTabelPesanan) return;

    const daftar = ambilPesanan();

    if (daftar.length === 0) {
      isiTabelPesanan.innerHTML = `
        <tr>
          <td colspan="6" class="pesan-kosong">Belum ada pesanan yang tersimpan di perangkat ini.</td>
        </tr>
      `;
      return;
    }

    isiTabelPesanan.innerHTML = daftar
      .slice()
      .reverse()
      .map(
        (item) => `
        <tr>
          <td>${amankanTeks(item.waktu)}</td>
          <td><strong>${amankanTeks(item.namaProduk)}</strong></td>
          <td>${amankanTeks(item.opsi)}</td>
          <td>${item.jumlah}</td>
          <td>${formatRupiah(item.subtotal)}</td>
          <td><span class="badge-status">${amankanTeks(item.status)}</span></td>
        </tr>
      `
      )
      .join("");
  }

  if (formPesan) {
    formPesan.addEventListener("submit", (e) => {
      e.preventDefault();

      const nama = inputNama ? inputNama.value.trim() : "";
      const wa = inputWa ? inputWa.value.trim() : "";
      const produkId = pilihProduk ? Number(pilihProduk.value) : 0;
      const produkItem = cariProduk(produkId);
      const jumlah = jumlahPesan ? Math.max(1, Number(jumlahPesan.value) || 1) : 1;
      const opsiEl = formPesan.querySelector('input[name="opsi"]:checked');
      const opsi = opsiEl ? opsiEl.value : "Dine-in";
      const catatan = catatanPesan ? catatanPesan.value.trim() : "";

      if (nama.length < 3) {
        alert("Nama pemesan wajib diisi minimal 3 karakter.");
        if (inputNama) inputNama.focus();
        return;
      }

      if (!wa.startsWith("08") || wa.length < 10) {
        alert("Nomor WhatsApp minimal 10 digit dan wajib diawali angka 08.");
        if (inputWa) inputWa.focus();
        return;
      }

      if (!produkItem) {
        alert("Silakan pilih salah satu menu kopi atau cemilan favorit Anda.");
        if (pilihProduk) pilihProduk.focus();
        return;
      }

      const subtotal = hitungSubtotal(produkItem.harga, jumlah);

      const sekarang = new Date();
      const formatWaktu = `${sekarang.getDate()}/${sekarang.getMonth() + 1} ${String(
        sekarang.getHours()
      ).padStart(2, "0")}:${String(sekarang.getMinutes()).padStart(2, "0")}`;

      const pesananBaru = {
        id: Date.now(),
        waktu: formatWaktu,
        nama: nama,
        wa: wa,
        produkId: produkItem.id,
        namaProduk: produkItem.nama,
        harga: produkItem.harga,
        jumlah: jumlah,
        subtotal: subtotal,
        opsi: opsi,
        catatan: catatan,
        status: "Terkirim",
      };

      const daftarPesanan = ambilPesanan();
      daftarPesanan.push(pesananBaru);
      simpanSemuaPesanan(daftarPesanan);

      renderTabelPesanan();

      const pesanWa =
        `Halo Kopi Banua!%0A` +
        `Saya ingin konfirmasi pesanan:%0A%0A` +
        `*Nama*: ${encodeURIComponent(nama)}%0A` +
        `*Menu*: ${encodeURIComponent(produkItem.nama)} (${jumlah} porsi)%0A` +
        `*Penyajian*: ${encodeURIComponent(opsi)}%0A` +
        (catatan ? `*Catatan*: ${encodeURIComponent(catatan)}%0A` : "") +
        `*Total*: ${encodeURIComponent(formatRupiah(subtotal))}%0A%0A` +
        `Mohon diproses, terima kasih!`;

      alert(
        `Pesanan Berhasil Disimpan!\n\n` +
        `Nama: ${nama}\n` +
        `Menu: ${produkItem.nama} (${jumlah} porsi)\n` +
        `Total: ${formatRupiah(subtotal)}\n\n` +
        `Pesanan telah dicatat di tabel "Pesanan Saya" dan akan diteruskan ke WhatsApp kedai.`
      );

      window.open(`https://wa.me/628115000000?text=${pesanWa}`, "_blank");

      formPesan.reset();
      perbaruiTotal();
    });
  }

  if (tombolHapusPesanan) {
    tombolHapusPesanan.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pesanan di perangkat ini?")) {
        localStorage.removeItem(KUNCI_PESANAN);
        renderTabelPesanan();
      }
    });
  }

  isiDropdownProduk();
  perbaruiTampilanMenu();
  renderTabelPesanan();
  perbaruiTotal();
});
