export default {
    header: "Prywatne przesyłanie plików. Bezpośrednio.",
    subHeader: "Szyfrowany transfer P2P z przeglądarki do przeglądarki. Bezpośrednio między urządzeniami. Bez śladów na serwerach.",
    send: "Wyślij pliki",

    header2: "Dlaczego jesteś bezpieczny?",
    privateCol: {
        header1: "Brak serwerów",
        subHeader1: "Transfer odbywa się bezpośrednio między przeglądarkami za pomocą WebRTC. Pliki nigdy nie trafiają na żaden dysk twardy poza Twoimi urządzeniami.",

        header2: "Szyfrowanie End-to-End",
        subHeader2: "Połączenie jest szyfrowane kluczami generowanymi lokalnie. Tylko odbiorca może odczytać przesyłane dane.",

        header3: "Całkowity Brak Logów",
        subHeader3: "Nie logujemy adresów IP, metadanych ani nazw plików. Usługa działa bez konieczności zakładania konta."
    },

    header3: "Jak działa Peer-to-Peer?",
    subHeader3: "Przesyłanie peer-to-peer to bardzo bezpieczny proces, ponieważ nawet my nie mamy dostępu do waszych plików. Jeśli przesyłasz pliki wymagane jest tylko wysłanie linku bądź kodu QR do osoby która odbierze pliki, natomiast osoba która odbiera pliki wchodzi na strone lub skanuje kod QR nasz program jedynie co zrobi to was połączy, nie pośredniczymy w przesyłaniu plików. Tylko Ty i odbiorca. Predkość wysyłania i pobierania jest tylko zależna od waszego łącza internetowego.",

    header4: "Jak to działa?",
    howItWorksCol: {
        header1: "Wybieranie kategorii",
        subHeader1: "Po kliknieciu przycisku wysyłaj musi zostać wybrana kategoria sieci (LAN - lokalna sieć, WAN - internet).",

        header2: "Tworzenie pokoju",
        subHeader2: "Po wybraniu kategorii zostanie stworzony pokój, link oraz kod QR.",

        header3: "Łączenie",
        subHeader3: "Po wejściu w link lub zeskanowaniu kodu QR zostaniecie połączeni a komputery wymienią się adresami IP.",

        header4: "Wysyłanie plików",
        subHeader4: "Po połączeniu komputer który stworzył pokój będzie mieć możliwość wysyłania",

        header5: "Akceptowanie",
        subHeader5: "Po wysłaniu plików wystarczy zaakceptować pobieranie na drugim urządzeniu.",
        
        header6: "Gotowe!",
        subHeader6: "Gotowe! Pliki zaczną pobierać się na drugim urządzeniu. Cykl wybierania pliku można powtarzać!",

        header7: "Rozłączanie",
        subHeader7: 'Po pobraniu plików wystarczy kliknąć przycisk "Wyjdź" lub zamknąć okno w przeglądarce, natychmiast zostaniecie rozłączeni.'
    },

    header5: "Kod jest w pełni otwarto źródłowy.",
    subHeader5: "Masz wątpliwości że aplikacja jest bezpieczna? Śmiało zobacz nasz kod! Programy open-source budują zaufanie do użytkowników oraz dają możliwość znajdywania błędów. Kliknij przycisk poniżej żeby otworzyć kod na GitHubie.",
    openSource: "Otwórz GitHub",

    header6: "Prywatność. Najważniejsze.",
    subHeader6: "Nasza strona nie wykorzystuje żadnych plików cookies, skryptów do śledzenia i jest chroniona. Nie mamy dostępu do twoich danych oraz IP.",

    header7: "Czystość i minimalistyka.",
    subHeader7: "Nasz kod nie posiada żadnych zbędnych programów i efektów, dzięki temu strona działa w mgnieniu oka.",

    header8: "Porównanie programu.",
    comparisonCol: {
        header1: "Cecha",
        header2: "Peer-to-Peer (P2P)",
        header3: "Normalny program lub serwer (cloud)",

        tableHeader1: "Bezpieczeństwo",
        tableHeader2: "Limity",
        tableHeader3: "Prędkość",
        tableHeader4: "Trwałość",
        tableHeader5: "Kontrola",

        p2p1: "Bardzo wysokie. Nikt nie ma dostępu do twoich zdjeć. Brak pośredników.",
        cloud1: "Dostateczne. Dane leżą na serwerach firmy i nie są bezpieczne.",
        p2p2: "Brak limitów. Dane przechodzą od nadawcy do odbiorcy.",
        cloud2: "Wiekszość posiada. Najczęściej 100MB na plik i 10GB na chmure.",
        p2p3: "Nielimitowana. Wszystko zależy od waszego łącza internetowego i limitów przeglądarek. Problemy mogą sie pojawić na telefonach gdzie limity pobierania są wieksze.",
        cloud3: "Limity i blokady prędkości.",
        p2p4: "Trwały, ale wymaga lekkiej konfiguracji i właczonego komputera odbiorcy.",
        cloud4: "Raczej trwały, zależy od serwerów firmy.",
        p2p5: "Pełna, tylko ty zarządzasz, przesyłasz i konfigurujesz.",
        cloud5: "Ograniczona, firmy zarządzają a ty przesyłasz."
    },

    header9: "Najczęściej zadawane pytania.",
    questions: {
        question1: "Czy muszę płacić żeby korzystać z programu?",
        reply1: "Nie, program jest w pełni darmowy, wolny od reklam i otwarto-źródłowy. Nie ma żadnych limitów.",

        question2: "Czy moge przesyłać wiele plików na raz?",
        reply2: "Tak, ale pliki muszą wysyłać się po kolei. Jeśli masz dużo plików (np. zdjęcia, filmy) najlepszym sposobem jest spakowanie ich wszystkich do jednego pliku .zip i przesłanie.",
        
        question3: "Czy moje pliki są bezpieczne?",
        reply3: "Tak, twoje pliki są bezpieczne, a nawet bezpieczniejsze niż w zwykłej chmurze dzięki przesyłaniu peer-to-peer.",

        question4: "Czy w przesyłaniu peer-to-peer ktoś pośredniczy?",
        reply4: "Nie, przesyłanie odbywa sie pomiędzy wami w 100%. My pośredniczymy tylko w połączeniu was.",

        question5: "Czy technologia peer-to-peer wymaga umiejętności?",
        reply5: 'Nie, wystarczy kliknąć "Wyślij pliki" a my poprowadzimy cię krok po kroku.',

        question6: "Czy peer-to-peer może się zepsuć lub zablokować?",
        reply6: "Tak, ale jest na to mała szansa. Zwykle przesyłanie peer-to-peer w LAN (sieci lokalnej) może nie działać z powodu blokad routera, a w WAN (internet) z powodu blokad operatora. Restrykcyjne przeglądarki mogą nie pozwolić na połączenie."
    },
    footer: {
        avenirox: "P2P stworzony przez Avenirox."
    }
}