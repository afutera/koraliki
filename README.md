# Aplikacja do układania wzorów z koralików

## Przykładowe dane na start
W folderze backend/src znajduje się skrypt seed.ts. Jego uruchomienie spowoduje utworzenie w bazie danych:
- 2 palet, każda ma 5+ kolorów
- 1 administratora (dane logowania: email i hasło podane w .env)

## pliki .env
### Backend
Wymagane zawsze:
DB_URL=mongodb://localhost:27017/koraliki <- pełny adres serwera bazy danych mongodb z nazwą bazy
JWT_SECRET <- dana do generowania kluczy JWT

Wymagane do inicjacji bazy:
SEED_ADMIN_EMAIL=admin@admin.com <- email, na którego utworzyć konto głównego admina, używany tylko na etapie inicjowania bazy danych
SEED_ADMIN_PASS=Admin123! <- hasło, jak wyzej, wymagane 8 znaków w tym 1 wielka litera, 1 mała, 1 znak specjalny, 1 cyfra

Opcjonalne:
FRONT_URL=http://localhost:5173 <- Adres frontendu do celów CORS (domyślnie dopuczcza żądania z dowolnego adresu)
PORT=3000 <- na którym porcie ma nasłuchiwać backend (domyślnie 3000)
HOST=localhost <- na którym adresie nasłuchiwać (domyślnie wszystkie)
SALT_ROUNDS=10 <- współczynnik do algorytmu haszowania haseł (domyślnie 10)
CLEANUP_INTERVAL=60 <- czas (w minutach), co który są usuwane nieużywane pliki użytkowników (domyślnie 60 minut, pierwsze podejście zawsze przy starcie serwera)

### Frontend 
API_URL= http://localhost:3000 <- adres backendu