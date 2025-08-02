# MariKaya

MariKaya adalah platform pinjaman online (Pinjol) terintegrasi yang terdiri dari:

1. Backend RESTful API menggunakan FastAPI + SQLAlchemy + JWT
2. Aplikasi Android (Flutter) sebagai front-end mobile
3. Database PostgreSQL (dapat diganti SQLite untuk pengembangan lokal)

## Struktur Proyek

```
├── backend/               # Kode sumber API FastAPI
│   └── app/
│       ├── main.py        # Entry point aplikasi
│       ├── database.py    # Konfigurasi DB SQLAlchemy
│       ├── models.py      # Model ORM
│       ├── schemas.py     # Skema Pydantic
│       └── routers/       # Blueprints/routers
├── mobile-app/            # Kode sumber Flutter
│   └── marikaya/
│       ├── lib/
│       │   └── main.dart  # Entry point Flutter
│       └── pubspec.yaml   # Dependency Flutter
└── README.md              # Dokumentasi ini
```

## Persyaratan

- Python 3.10+
- Flutter 3.x
- PostgreSQL 14+ (opsional, dapat memakai SQLite)
- Docker (opsional)

## Menjalankan Backend (Pengembangan)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API akan tersedia di `http://127.0.0.1:8000` dengan dokumentasi Swagger di `/docs`.

## Menjalankan Aplikasi Flutter

```bash
cd mobile-app/marikaya
flutter pub get
flutter run
```

## Izin Android (Permissions)

Aplikasi akan meminta izin berikut (dapat disesuaikan sesuai kebijakan Play Store):

- READ_CONTACTS, READ_PHONE_STATE, READ_SMS – verifikasi risiko kredit
- ACCESS_FINE_LOCATION – validasi lokasi pengguna
- CAMERA & WRITE_EXTERNAL_STORAGE – unggah dokumen identitas

Pastikan transparansi dan kepatuhan regulasi OJK serta kebijakan privasi pengguna.

---

Dokumentasi lebih lanjut akan ditambahkan seiring perkembangan fitur.