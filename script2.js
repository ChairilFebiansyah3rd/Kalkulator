const display = document.querySelector('#display');
const buttonsContainer = document.querySelector('.buttons');
const operators = ['+', '-', '*', '/'];

display.innerText = '0';
let errorState = false;

function updateDisplay(value) {
    if (errorState) {
        if (!operators.includes(value) && value !== '=' && value !== '%' && value !== ',' && value !== '*') {
            display.innerText = value;
            errorState = false;
            return;
        } else {
            return;
        }
    }
    
    let lastChar = display.innerText.slice(-1);
    if (value === 'x') return; // Cegah 'x' muncul di layar
    if (value === '*') value = '*'; // Gunakan '*' untuk perkalian
    if (display.innerText === '0' && operators.includes(value)) return;
    if (operators.includes(value) && operators.includes(lastChar)) return;
    
    if (value === ',') {
        value = '.'; // Gunakan titik untuk JavaScript
        let lastNumber = display.innerText.split(/[-+*/]/).pop();
        if (lastNumber === '' || lastNumber.includes('.') || errorState) return; // Cegah lebih dari satu koma atau koma setelah operator
    }
    
    if (value === '%') {
        if (operators.includes(lastChar) || lastChar === '%' || errorState) return;
        display.innerText += '%';
        return;
    }
    
    display.innerText = display.innerText === '0' && value !== '.' ? value : display.innerText + value;
}

function calculate() {
    try {
        let expression = display.innerText.replace(/,/g, ".") // Ubah koma ke titik
                                      .replace(/(\d+(?:\.\d+)?)%/g, "($1 / 100)"); // Ubah persen
        let lastChar = expression.slice(-1);
        
        if (expression === '0' || operators.includes(lastChar)) return;
        if (/\/0(?![.\d])/.test(expression)) { // Cek jika membagi dengan 0
            display.innerText = "Tidak dapat dibagi 0";
            errorState = true;
            return;
        }
        
        let result = parseFloat(new Function(`return ${expression}`)());
        display.innerText = Number(result.toFixed(10)).toString().replace(".", ",");
    } catch (error) {
        display.innerText = "Error";
        errorState = true;
    }
}

function clearDisplay() {
    display.innerText = '0';
    errorState = false;
}

function backspace() {
    if (errorState) {
        clearDisplay();
        return;
    }
    display.innerText = display.innerText.slice(0, -1) || '0';
}

buttonsContainer.addEventListener('click', function (event) {
    if (!event.target.matches("button")) return;
    let value = event.target.innerText;
    let id = event.target.id;

    if (errorState && (id === "x")) return; // Cegah 'x' saat error

    if (id === "*") {
        value = '*'; // Pastikan '*' digunakan untuk perkalian
    }

    switch (id) {
        case "clear":
            clearDisplay();
            break;
        case "backspace":
            backspace();
            break;
        case "equal":
            if (!errorState) calculate();
            break;
        default:
            updateDisplay(value);
            break;
    }
});
