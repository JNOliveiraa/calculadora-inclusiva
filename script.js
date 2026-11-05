let expressaoAtual = "";
let memoriaOperacao = "";

// Função nativa para fazer o computador falar
function falar(texto) {
    // cancela falas anteriores para não encavalar o audio
    window.speechSynthesis.cancel();

    const mensagem = new SpeechSynthesisUtterance(texto)
    mensagem.lang = 'pt-BR';
    mensagem.rate = 1.2;
    window.speechSynthesis.speak(mensagem);
}

function atualizarVisor() {
    const visor = document.getElementById("visor");
    visor.innerText = expressaoAtual || "0";
}

function pressionarNumero(numero) {
    expressaoAtual += numero;
    atualizarVisor();
    falar(numero);
}

function definirOperacao(operador) {
    let nomeOperador = operador;
    if (operador === '-') nomeOperador = "menos";
    if (operador === '+') nomeOperador = "mais";
    if (operador === '/') nomeOperador = "dividido por";
    if (operador === '*') nomeOperador = "vezes";

    expressaoAtual +=  ` ${operador} `;
    atualizarVisor();
    falar(nomeOperador);
    
}

function limpar() {
    expressaoAtual = "";
    atualizarVisor();
    falar("Limpo. Visor zerado.");
}

function falarAjuda() {
    falar("instruções: Use as teclas númericas para digitar. Use as teclas mais, menos, asterisco para multiplicar e barra para dividir. pressione enter para o resultado e Esc para limpar.");
}

function calcularResultados() {
    try {
        if (!expressaoAtual) return;

        // Avalia a string matematica com segurança basica
        // em produção, substitua eval por um parser matematico para evitar falhas de segurança
        let resultado = eval(expressaoAtual);

        if (resultado === Infinity || isNaN(resultado)) {
            falar("Erro. Divisão por zero.");
            expressaoAtual = "";
            atualizarVisor();
            return;
        }

        falar("Igual a " + resultado);
        expressaoAtual = resultado.tostring();
        atualizarVisor();
    } catch (erro) {
        falar("erro na conta.");
        expressaoAtual = "";
        atualizarVisor();
    }
}

// Ouvir o teclado fisíco do usuário (Mapeamento de Acessibilidade)
document.addEventListener('keydown', (event) => {
    const tecla = event.key;

    if (/[0-9]/.test(tecla)) {
        pressionarNumero(tecla);
    } else if (tecla === '+' || tecla === '-' || tecla === '*' || tecla === '/') {
        definirOperacao(tecla);
    } else if (tecla === 'Enter') {
        event.preventDefault();
        calcularResultado();
    } else if (tecla === 'escape' || tecla === 'c' || tecla === 'C') {
        limpar();
    } else if (tecla === 'h' || tecla === 'H') {
        falarAjuda();
    }
});

// Mensagem de boas-vindas ao carregar o sistema
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        falar("Calculadora Acessível Iniciada. Pressione a tecla H para ouvir a ajuda.");
    }, 100);
});