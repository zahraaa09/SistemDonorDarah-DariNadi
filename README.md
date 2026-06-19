# Halo ngab ;)
anggaplah tutor

## 1. Persiapan Awal

Pastikan di komputer kalian sudah terinstall:

* [Python 3.10+](https://www.python.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [Node.js & NPM](https://nodejs.org/)
* [Git](https://git-scm.com/)

---

## 2. Langkah-Langkah Menjalankan Proyek

### A. Mendapatkan Kode (Clone / Pull)

Jika baru pertama kali mengerjakan:

```bash
git clone https://github.com/nabilasalsabilaaaa/SistemDonorDarah-DariNadi.git
```

```bash
cd SistemDonorDarah-DariNadi
```

Jika sudah punya foldernya dan ingin mengambil update terbaru:

```bash
git pull origin main
```

### B. Setup Database

1. Buka **pgAdmin 4**.
2. Klik kanan pada **Databases** -> **Create** -> **Database**.
3. Beri nama: `weblanjut_donor_darah`.
4. Klik kanan pada database baru tersebut -> **Restore**.
5. Pilih file `database_donor_darah.sql` dari folder proyek dan klik **Restore**.

### C. Menjalankan Backend (FastAPI)

1. Buka terminal, masuk ke folder backend:
```bash
cd donor-darah-back
```

2. Buat dan aktifkan *Virtual Environment*:
```bash
python -m venv venv
```

```bash
venv\Scripts\activate
```

3. Install library:
```bash
pip install -r requirements.txt
```

4. Buat file **`.env`** di dalam folder `donor-darah-back` dan isi dengan:
```bash
DATABASE_URL=postgresql://postgres:PASSWORD_DB_KALIAN@localhost:5432/weblanjut_donor_darah
```
*(Ganti `PASSWORD_DB_KALIAN` dengan password PostgreSQL masing-masing).*

5. Jalankan server:
```bash
uvicorn app.main:app --reload
```
*(Backend aktif di [http://127.0.0.1:5000](http://127.0.0.1:5000))*


### D. Menjalankan Frontend (React)

1. Buka terminal baru, masuk ke folder frontend:
```bash
cd ../donor-darah-front
```

2. Install dependensi:
```bash
npm install
```

3. Jalankan aplikasi:
```bash
npm start
```
*(Frontend akan terbuka di browser)*
