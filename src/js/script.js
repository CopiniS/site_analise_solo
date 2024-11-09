

window.addEventListener('load', function () {
    const path = window.location.pathname;

    if (path === "/") {
        window.location.href = "/home.html";
    }
});

document.getElementById("inputGroupSelect04").addEventListener("change", function () {
    var selectedValue = this.value;
    var pdfDiv = document.getElementById("pdfDiv");

    if (selectedValue == "2") {
        formDiv.style.display = "none";
        pdfDiv.style.display = "flex";
    } else if (selectedValue == "1") {
        pdfDiv.style.display = "none";
        formDiv.style.display = "grid";
    }
});

const fileInput = document.getElementById('file-input');
const pdfTextDiv = document.getElementById('pdf-text');



document.addEventListener("DOMContentLoaded", function () {

    window.processar = function () {
        let dados = {};
        let amostrasIds = new Map();

        function isOnlyNumbers(value) {
            value = value.trim();
            return /^\d+$/.test(value);
        }

        function adicionarPropriedade(chave, valor) {
            dados[chave] = valor;
        }

        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        const fileReader = new FileReader();
        const reader = new FileReader();

        reader.onload = function () {
            const typedarray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {

                let textContent = '';
                const numPages = pdf.numPages;
                const pagePromises = [];
                // verificação de colunas das amostras
                let melichBoolean = false;
                let caMg = false;
                let prBoolean = false;
                let intSMP = 0;
                let intCTC = 0;
                let intK = 0;
                let intP = 0;
                let intArgila = 0;

                for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                    pagePromises.push(pdf.getPage(pageNum).then(page => {
                        return page.getTextContent().then(text => {
                            let currentLineY = null;
                            let lineText = '';


                            for (let i = 80; i < text.items.length; i++) {
                                const item = text.items[i];

                                // pula verificações desnecessárias com strings vazias ou sem amostra.
                                if (item.str === " ") {
                                    continue;
                                } else if (item.str !== "Mehlich" && amostrasIds.size === 0) {
                                    continue;
                                }

                                if (item.str === "Mehlich") {
                                    melichBoolean = true;
                                    const labNumber = text.items[i += 3].str;

                                    // considerando valores da primeira linha imutáveis.
                                    adicionarPropriedade("indice_smp", text.items[91].str.replace(/,/g, '.'));
                                    adicionarPropriedade("ctc", text.items[101].str.replace(/,/g, '.'));
                                    adicionarPropriedade("potassio", text.items[105].str.replace(/,/g, '.'));
                                    amostrasIds.set(labNumber, dados);
                                    dados = {};
                                    i = 105;

                                    // Valores de ref ao verificar próximas linhas.
                                    intSMP = 91;
                                    intCTC = 101;
                                    intK = 105;
                                    continue;
                                }


                                if (item.str === "(Ca+Mg)/K") {
                                    console.log("(Ca+Mg)/K #########")
                                    melichBoolean = false;
                                    caMg = true;
                                    i += 2;
                                    continue;
                                }

                                if (item.str === "PR") {
                                    console.log("PR")
                                    melichBoolean = false;
                                    caMg = false;
                                    prBoolean = true;
                                    const labNumber = text.items[i += 2].str;
                                    if (amostrasIds.has(labNumber)) {
                                        const valorAtual = amostrasIds.get(labNumber);

                                        // Adicionando novos dados ao objeto existente
                                        intArgila = i += 6;
                                        intP = i += 2;
                                        valorAtual.argila = text.items[intArgila].str.replace(/,/g, '.');
                                        valorAtual.fosforo = text.items[intP].str.replace(/,/g, '.');
                                        amostrasIds.set(labNumber, valorAtual);
                                    }

                                    continue;
                                }

                                if (currentLineY === null || Math.abs(item.transform[5] - currentLineY) < 5) {
                                    lineText += item.str + ' ';
                                } else {
                                    textContent += lineText.trim() + '\n';
                                    lineText = item.str + ' ';

                                    if (melichBoolean) {
                                        let value = text.items[i += 1].str;

                                        if (isOnlyNumbers(value)) {
                                            // o gap entre cada linha é de 28. 
                                            intSMP += 28;
                                            intCTC += 28;
                                            intK += 28;

                                            adicionarPropriedade("indice_smp", text.items[intSMP].str.replace(/,/g, '.'));
                                            adicionarPropriedade("ctc", text.items[intCTC].str.replace(/,/g, '.'));
                                            adicionarPropriedade("potassio", text.items[intK].str.replace(/,/g, '.'));
                                            amostrasIds.set(value, dados);

                                            dados = {};
                                            i = intK + 1;
                                            continue;
                                        }
                                    } else if (prBoolean) {
                                        let integer = i += 1;
                                        if (text.items[integer] && text.items[integer].str) {
                                            let labNumber = text.items[integer].str;

                                            if (isOnlyNumbers(labNumber)) {
                                                intP += 28;
                                                intArgila += 28;

                                                if (amostrasIds.has(labNumber)) {
                                                    const valorAtual = amostrasIds.get(labNumber);

                                                    intArgila = i += 6;
                                                    intP = i += 2;
                                                    valorAtual.argila = text.items[intArgila].str.replace(/,/g, '.');
                                                    valorAtual.fosforo = text.items[intP].str.replace(/,/g, '.');
                                                    amostrasIds.set(labNumber, valorAtual);
                                                }

                                                i = intP + 1;
                                                continue;
                                            }
                                        }
                                    }
                                }
                                currentLineY = item.transform[5];
                            }
                            if (lineText) {
                                textContent += lineText.trim() + '\n';
                            }
                        });
                    }));
                }

                Promise.all(pagePromises).then(() => {
                    console.log(amostrasIds);
                    document.getElementById('amostras').innerText = amostrasIds.size;

                    var pdfDiv = document.getElementById("pdfDiv");
                    var resultDiv = document.getElementById("resultDiv");
                    pdfDiv.style.display = "none";
                    resultDiv.style.display = "block";

                });
            });
        };
        reader.readAsArrayBuffer(file);
    };

});