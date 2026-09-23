export default {
    header1: "Proszę wybrać architekture sieci.",
    LANdesc: " - Lokalna sieć komputerowa. Używaj tylko jeśli odbiorca jest w tej samej sieci (połączony z tym samym routerem).",
    WANdesc: " - Rozległa sieć komputerowa (internet). Używaj tylko jeśli odbiorca jest w innej sieci (połączony z innym routerem).",

    creatingRoomLAN: "Tworzenie pokoju w LAN",
    creatingRoomWAN: "Tworzenie pokoju w WAN",
    creatingRoomDesc: "Zostanie utworzony pokój po utworzeniu pokoju otrzymasz link oraz kod QR do tego pokoju wystarczy go zeskanowac lub wysłać link na drugie urządzenie.",
    connectedRoomDesc: "Pomyślnie połączono z drugim urządzeniem. Można przesłać pliki na to urządzenie.",
    connectedRoomSending: "Wysyłanie pliku. Proszę czekać do końca. Nie zamykaj karty P2P!",

    status: {
        connecting: "Łączenie...",
        roomCreated: "Pokój stworzony",
        peerJoined: "Odbiorca dołączył",
        peerLeft: "Odbiorca wyszedł",
        joined: "Połączono",
        hostLeft: "Host wyszedł",
        sending: "Wysyłanie pliku...",
        noRoom: "Pokój nie istnieje"
    },

    hostStatusesContent: {
        connecting: {
            header: 'Łączenie z serwerem'
        },
        roomCreated: {
            header: "Stworzono pokój",
            subHeader: "Pokój został stworzony, otrzymałeś link i kod QR do stworzonego pokoju. Zeskanuj go na drugim urządzeniu lub udostępnij link.",
        },
        peerLeft: {
            header: "Odbiorca wyszedł",
            subHeader: "Odbiorca wyszedł z pokoju, ale spokojnie! Możesz wysłać mu ponownie link lub zeskanować QR!"
        },
        peerJoined: {
            header: "Odbiorca dołączył do pokoju",
            subHeader: "Odbiorca jest połączony. Możesz mu wysłać plik"
        },
        sending: {
            header: "Wysyłanie pliku",
            subHeader: "Wysyłanie pliku do odbiorcy... Możesz bezpiecznie przełączać okna. Aby anulować zamknij to okno.",
            warning: "Zatrzymano się na 0%? Jeśli korzystacie z różnych sieci, połączenie LAN nie zadziała, spróbujcie przełączyć się na WAN. Sprawdźcie też, czy przesyłacie pliki z urządzenia mobilnego lub na nie. Urządzenia mobilne działają bardzo wolno."
        },
        limit: {
            header: "Osiągnąłeś limit zapytań.",
            subHeader: "Proszę poczekać 15 minut, bedziesz znów mogł wysłać zapytanie do websocket."
        },
        flood: {
            header: "Wysłałeś za dużo wiadomości",
            subHeader: "Połączenie websocket zostało zamkniete. System wykrył atak flood."
        }
    },

    peerStatusesContent: {
        hostLeft: {
            header: 'Host rozłączył się',
            subHeader: 'Host wyszedł z pokoju. Pokój jest zamykany.',
        },
        noRoom: {
            header: "Nie znaleziono pokoju",
            subHeader: "Przepraszamy! Nie znaleziono żadnego pokoju z tym linkiem URL!",
        },
        roomFull: {
            header: "Pokój pełny",
            subHeader: "Pokój ma już połączonego odbiorce!"
        },
        joinedRoom: {
            header: "Dołączono",
            subHeader: "Pomyślnie połączono z pokojem. Oczekiwanie na akcje hosta."
        },
        receiving: {
            header: 'Odbieranie pliku',
            subHeader: 'Host wysłał plik. Pobieranie.',
            warning: "Uwaga: Pobieranie może być wolne na urządzeniach mobilnych gdzie przeglądarki mają bardzo ścisłą ochrone, niestety nic nie możemy z tym zrobić.",
        }
    },


    finished: "Zakończono!",
    back: "Wróć",

    selectFile: "Wybierz plik",
    noFile: "Nie wybrano pliku",

    remaining: "Pozostały czas: ",
    speed: "Prędkość WI-FI: ",

    hostSendHeader: "Odebrano plik",
    hostSend1: "Host wysłał plik: ",
    hostSend2: "O rozmiarze: ",
    hostSend3: 'Możesz go pobrać, jeśli nie chcesz go pobierać kliknij "Odrzuć".',
    sumControlOK: "Suma kontrolna: Indentyczna.",
    sumControlBAD: "Suma kontrolna: Niezgodna!",
    sumControlWAIT: "Suma kontrolna: Obliczanie...",

    cancel: "Odrzuć",
    downland: "Pobierz"
}