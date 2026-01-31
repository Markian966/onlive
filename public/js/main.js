const seatsInput = document.getElementById('seatsInput');
const selectedSeatsList = document.getElementById('selectedSeatsList');
const totalPriceElement = document.getElementById('totalPrice');
let selectedSeats = [];

document.querySelectorAll('.seat.available').forEach(seat => {
    seat.addEventListener('click', function() {
        const sector = this.dataset.sector;
        const row = this.dataset.row;
        const seatNum = this.dataset.seat;
        const seatKey = `${sector}-${row}-${seatNum}`;

        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            selectedSeats = selectedSeats.filter(s => s.key !== seatKey);
        } else {
            this.classList.add('selected');
            selectedSeats.push({
                key: seatKey,
                sector: sector,
                row: parseInt(row),
                seat: parseInt(seatNum)
            });
        }

        updateSelectedSeatsDisplay();
        updateTotalPrice();
        updateHiddenInput();
    });
});

function updateSelectedSeatsDisplay() {
    if (selectedSeats.length === 0) {
        selectedSeatsList.innerHTML = '<span class="no-seats-message">No seats selected</span>';
    } else {
        selectedSeatsList.innerHTML = selectedSeats
            .map(s => `<span class="seat-tag">${s.sector}-${s.row}-${s.seat}</span>`)
            .join('');
    }
}

function updateTotalPrice() {
    const total = selectedSeats.length * (window.eventPrice || 0);
    if (totalPriceElement) {
        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function updateHiddenInput() {
    if (seatsInput) {
        seatsInput.value = JSON.stringify(selectedSeats);
    }
}

if (window.reservedSeatsArray) {
    window.reservedSeatsArray.forEach(seatKey => {
        const [sector, row, seat] = seatKey.split('-');
        const seatButton = document.querySelector(
            `.seat[data-sector="${sector}"][data-row="${row}"][data-seat="${seat}"]`
        );
        if (seatButton) {
            seatButton.classList.remove('available');
            seatButton.classList.add('reserved');
            seatButton.disabled = true;
        }
    });
}

const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        if (selectedSeats.length === 0) {
            e.preventDefault();
            alert('Please select at least one seat');
            return false;
        }
    });
}