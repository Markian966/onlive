# OnLive - System rezerwacji biletów na wydarzenia

Autorzy:
- Markiian Kravets - *54074*
- Denys Shcherbyk - *52995*

## Opis projektu

OnLive to aplikacja webowa do rezerwacji biletów na wydarzenia kulturalne i sportowe. System umożliwia przeglądanie wydarzeń, rezerwację miejsc z interaktywnym wyborem oraz zarządzanie kontem użytkownika.

Technologie:
- Backend: Node.js, Express.js, Sequelize ORM
- Frontend: EJS, CSS3, JavaScript
- Baza danych: PostgreSQL 15

## Funkcjonalności

### 1. Zarządzanie użytkownikami
- Rejestracja nowych użytkowników
- Logowanie/wylogowanie (JWT)
- Edycja profilu (imię, nazwisko, email)
- Zmiana hasła

### 2. Przeglądanie wydarzeń
- Lista wszystkich wydarzeń
- Szczegóły wydarzenia z informacją o sektorach
- Podgląd dostępności miejsc

### 3. System rezerwacji
- Tworzenie rezerwacji z interaktywnym wyborem miejsc
- Przeglądanie listy rezerwacji użytkownika
- Wyświetlanie szczegółów rezerwacji
- Anulowanie rezerwacji

### 4. Zarządzanie profilem użytkownika
- Aktualizacja danych osobowych
- Bezpieczna zmiana hasła
- Historia rezerwacji

### 5. Zarządzanie miejscami
- Automatyczna kontrola dostępności miejsc
- Blokada podwójnych rezerwacji
- Wizualizacja sektorów i miejsc

### Instrukcja

1. Sklonuj repozytorium
    ```
    git clone https://github.com/Markian966/onlive.git
   
    cd onlive
   
    docker compose up
    ```
   
   
   Aplikacja dostępna pod adresem: http://localhost:3333

### Kontenery:

1. `postgres` - baza danych PostgreSQL
2. `migrate` - migracje i inicjalizacja danych
3. `app` - aplikacja webowa (port 3333)
