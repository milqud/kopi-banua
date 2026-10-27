/**
 * ============================================================================
 * TUGAS 1 PEMROGRAMAN WEB 1 - S1 SISTEM INFORMASI FTI UNISKA MAB
 * PROYEK : KOPI BANUA
 * BERKAS : js/script.js
 * SYARAT : Slide Pertemuan 7 Halaman 11 (Validasi Form & Console Bersih)
 * ============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Pilihan 2 Sesuai Slide 11 - Validasi tambahan pada form pemesanan
  const form = document.querySelector("#form-pesan") || document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (e) {
      const wa = document.querySelector("#wa").value.trim();
      const nama = document.querySelector("#nama").value.trim();
      const menu = document.querySelector("#menu");

      // Validasi tambahan: Nama tidak boleh kosong
      if (nama.length < 3) {
        e.preventDefault();
        alert("Silakan masukkan nama lengkap Anda (minimal 3 huruf).");
        document.querySelector("#nama").focus();
        return;
      }

      // Syarat Wajib Slide 11: Nomor WhatsApp minimal 10 digit
      if (wa.length < 10) {
        e.preventDefault();
        alert("Nomor WhatsApp minimal 10 digit.");
        document.querySelector("#wa").focus();
        return;
      }

      // Validasi menu
      if (!menu.value) {
        e.preventDefault();
        alert("Silakan pilih salah satu menu yang ingin dipesan.");
        menu.focus();
        return;
      }

      // Konfirmasi berhasil
      e.preventDefault();
      const pilihanMenu = menu.options[menu.selectedIndex].text;
      alert(`Terima kasih ${nama}! Pesanan untuk "${pilihanMenu}" telah dicatat. Kami akan segera menghubungi WhatsApp Anda.`);
      form.reset();
    });
  }

  // Smooth scroll saat mengklik tautan menu navigasi
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    });
  });

  console.log("Kopi Banua: script.js berjalan tanpa error.");
});
