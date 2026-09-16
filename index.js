const input = require("readline-sync");
const fs = require("fs");

const namaToko = "ShinXWarteg";
let tanggalHariIni = new Date().toLocaleDateString('id-ID', { weekday: "long", day: 'numeric', month: "long", year: "numeric" });

function sapaan(namaToko, tanggal) {
    console.log(`       Selamat Datang di ${namaToko}\n`);
    console.log(tanggal);
}


// let daftarBarang = [
//     {id: 1, nama: "Teh Manis", stok: 50, harga: 2000},
// ]

// console.log(daftarBarang.id, daftarBarang.nama, daftarBarang.stok, daftarBarang.harga)

// function tambahBarang(data, nama, stok, harga) {
//     const lastId = data.length > 0 ? data[data.length - 1].id : 0;
//     const newId = lastId + 1;
//     data.push({id: newId, nama, stok, harga})
//     return data;
// }
// tambahBarang(daftarBarang, "Nasi", 30, 5000);
// tambahBarang(daftarBarang, "Ayam Bakar", 40, 3000);
// tambahBarang(daftarBarang, "Bebek Goreng", 40, 3000);
// tambahBarang(daftarBarang, "Kopi", 100, 4500);
// tambahBarang(daftarBarang, "Es teh manis", 100, 3000);

// function barangMasuk(data, id, jumlah) {
//     const barang = data.find((f) => f.id === id);
//     if (barang) {
//         barang.stok += jumlah;
//     } else {
//         console.log(`Barang tidak ada`);
//     }
// }

// function barangKeluar(data, id, jumlah) {
//     const barang = data.find((f) => f.id === id)

//     if (barang.stok > jumlah) {
//         barang.stok -= jumlah;
//     } else {
//         console.log(`Barang tidak cukup`);
//     }
// }

// function hapusBarang(data, id) {
//     data = data.filter((t) => t.id !== id);
//     console.log(data);
//     return data;
// }

// function tampilkanBarang(data) {
//     data.forEach(d => {
//         console.log(`${d.id}. ${d.nama} : ${d.stok} -- ${d.harga}`);
//     });
// }

// barangMasuk(daftarBarang, 2, 5);
// barangKeluar(daftarBarang, 1, 3);
// daftarBarang = hapusBarang(daftarBarang, 3);
// console.log(daftarBarang);
// tampilkanBarang(daftarBarang);

class StokManager {
    constructor() {
        this.daftarBarang = [];
    }

    simpan() {
        fs.writeFileSync("dataBarang.json", JSON.stringify(this.daftarBarang, null, 2));
    }

    muat() {
        if (fs.existsSync("dataBarang.json")) {
            const data = fs.readFileSync("dataBarang.json", "utf-8");
            this.daftarBarang = JSON.parse(data);
        }
    }

    nambah(nama, stok, harga) {
        const idTerakhir = this.daftarBarang.length > 0 ? this.daftarBarang[this.daftarBarang.length - 1].id : 0;
        const idBaru = idTerakhir + 1;
        this.daftarBarang.push({ id: idBaru, nama: nama, stok: stok, harga: harga });
    }

    nampil() {
        this.daftarBarang.forEach((d) => {
            console.log(`${d.id}. ${d.nama} : ${d.stok} -- ${d.harga}`);
        });
    }

    masukAja(id, jumlah) {
        const barang = this.daftarBarang.find((f) => f.id === id);
        if (barang) barang.stok += jumlah;
        if (!barang) console.log("Brang tidak ditemukan!");
    }

    pergiSana(id, jumlah) {
        const barang = this.daftarBarang.find(p => p.id === id);
        if (barang) {
            barang.stok -= jumlah;
        } else {
            console.log(`Stok barang tidak ada!`);
        }
    }

    rip(id) {
        this.daftarBarang = this.daftarBarang.filter(h => h.id !== id);
    }

    cekStokMenipis(batas = 10) {
        const danger = this.daftarBarang.filter(b => b.stok <= batas);
        danger.forEach(d => {
            console.log(`${d.id}. ${d.nama} : ${d.stok} -- ${d.harga}`);
        })
    }
}

const manager = new StokManager();
manager.muat();

console.log(`----------------------------------------------`);
sapaan(namaToko, tanggalHariIni);
console.log(`----------------------------------------------`);

while (true) {
    console.log(`\n-------------------MENU-----------------------`);
    console.log(`1. Tambah Barang\n2. Lihat Stok\n3. Barang Masuk\n4. Barang Keluar\n5. Hapus Barang\n6. Cet Stok Menipis\n7. Keluar`);
    const pilihan = Number(input.question("PILIH ATAU MATI? "));

    switch (pilihan) {
        case 1:
            console.log(`\n---------------TAMBAH BARANG-------------------`);
            const namaBarang = input.question("Masukkan Nama Barang: ");
            const stokBarang = input.question("Masukkan Jumlah Barang: ");
            const hargaBarang = input.question("Masukkan Harga: ");

            try {
                const stok = Number(stokBarang);
                const harga = Number(hargaBarang)
                if (isNaN(stok, harga)) {
                    throw new Error("Stok Atau Harga Bukan Angka");
                }

                manager.nambah(namaBarang, stok, harga);
                manager.simpan();
            } catch {
                console.log("Stok atau Harga Bukan Angka!");
            }
            
            break;

        case 2:
            console.log(`\n---------------DAFTAR BARANG--------------------`);
            manager.nampil();
            break;

        case 3:
            console.log(`\n---------------TAMBAH STOK--------------------`);
            const idTujuan = input.question("Masukkan ID Barang: ");
            const jumlahStok = input.question("Jumlah Tambahan Stok Barang: ");

            try {
                const id = Number(idTujuan);
                const jumlah = Number(jumlahStok);
                if (isNaN(id, jumlah)) {
                    throw new Error("ID atau Stok Bukan Angka");
                }

                manager.masukAja(id, jumlah);
                manager.simpan();
            } catch {
                console.log("ID atau Stok Bukan Angka!");
            }
            break;
        case 4:
            console.log(`\n---------------KURANG STOK--------------------`);
            const idKurang = input.question("Masukkan ID Barang: ");
            const jumlahKurang = input.question("Jumlah Stok Barang Berkurang: ");

            try {
                const id = Number(idKurang);
                const jumlah = Number(jumlahKurang);
                if (isNaN(id, jumlah)) {
                    throw new Error("ID dan Stok Bukan Angka!");
                }

                manager.pergiSana(id, jumlah);
            } catch {
                console.log("ID atau Stok Bukan Angka!");
            }
            break;
        case 5:
            console.log(`\n---------------HAPUS BARANG--------------------`);
            const idHapus = input.question("Masukkan ID Barang: ");

            try {
                const id = Number(idHapus);
                if (isNaN(id)) {
                    throw new Error("Mau Isi yang bener atau Kamu yang Ku Hapus dari Dunia?");
                }
                manager.rip(id);
                manager.simpan();
            } catch {
                console.log("ID bukan Angka");
            }
            break;
        case 6:
            console.log(`\n---------------STOK TIPIS--------------------`);
            manager.cekStokMenipis();
            break;
        case 7:
            console.log("BYE! SAYONARA!");
            console.log("Pergi dan Jangan Kembali Lagi!")
            process.exit(0);
            break;
        default:
            console.log("Command tidak diketahui!");
            break;
    }
}