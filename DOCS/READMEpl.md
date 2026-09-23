# P2P | Profesjonalny, transfer plików

## 💡 Kilka słów o projekcie
Projekt pozwala wysyłać rózne pliki dzięki technologią peer-to-peer z maksymalna predkością przeglądarki. 
Projekt jest **otwarto źródłowy** każdy może go używać do **pobierania i nauki.**

## 🛠️ Tech Stack
- HTML5 & CSS3
- TypeScript
- React (z TypeScript)
- Node.js
- Tailwind CSS

## 🚀 Rozpoczynanie (Jak uruchomić projekt lokalnie?)

### Prerequisites
- Upewnij się, że masz **Node.js** zainstalowany na urządzeniu. Jeśli go nie masz pobiesz go: [Oficjalna strona Node.js](https://nodejs.org/).
- Upewnij się, że masz pobrany **Git**. Sklonuj to repozytorium na swoje urządzenie:
  ```bash
  git clone https://github.com
  ```

### Instalacja

1. **Zainstaluj pakiety npm dla frontendu i backendu:**
   * Idź do folderu frontendu i zainstaluj potrzebne pakiety:
     ```bash
     cd frontend/P2P
     npm install
     ```
   * W drugim terminalu idź do backendu i równierz pobierz pakiety:
     ```bash
     cd backend
     npm install
     ```

2. **Konfigurowanie zmiennych i URL:**
   * **Konfiguracja backendu:** Idź do folderu backend (`cd backend`). Znajź plik `env.example` otwórz go i w 2 linii wklej URL reacta:
     ```env
     PORT=8080
     FRONTENDURL=http://localhost:5173
     ```
     *(Uwaga: 5173 to standardowy port dla react/vite. Nie musisz zmieniać portu backendu, 8080 jest rekomendowany).*
   * **Zmień nazwę:** Zmień nazwe pliku `env.example` na `.env`.
   * **Konfiguracja fronendu:** Żeby połączenie websocket działało, otwórz plik `SendSecondStep.tsx` zlokalizowany w:
     `.../P2P/frontend/P2P/src/components/send_page/SendSecondStep.tsx`
     Idź do **linii 108** i zmień WebSocket URL na twój lokalny Node.js serwer URL:
     ```typescript
     const socket = new WebSocket('ws://localhost:8080')
     ```

3. **Uruchomienie:**
   Otwórz 2 osobne terminale i to każdego z nich wklej jedną linie kodu.
   * **W terminalu frontend (react):**
     ```bash
     npm run dev
     ```
   * **W terminalu backend (node.js):**
     ```bash
     node server.js
     ```
     *(Note: Jeśli zmienisz konfiguracje `.env` kiedyś, pamietaj o restarcie serwera Node poprzez zatrzymanie go i uruchomienie `node server.js` jeszcze raz. React aktualizuje się automatycznie).*

4. Mam nadzieję że sie udalo i życze miłej zabawy! 🎉

## 📄 Licencja
Projekt posiada licencje **GNU GPLv3 License** - zobacz licencje [LICENSE](LICENSE/GNUGPLv3License.txt) dla dodatkowych informacji.
Copyright © 2026 AveniroxTM. Projekt jest dostępny jako open-source na warunkach licencji.


---
*Miłej zabawy i świetnego dnia!*  
**Zespół Avenirox.**
