import { criarDivs } from './dinamic.js';
import { callAPI } from './api.js';

document.addEventListener("DOMContentLoaded", function () { // Consolidando o evento de carregamento

    // Redirecionamento para "/home.html" se necessário
    const path = window.location.pathname;
    if (path === "/") {
        window.location.href = "/home.html";
    }

    // Seleção do dropdown e manipulação de exibição de PDF e formulário
    document.getElementById("inputGroupSelect04").addEventListener("change", function () {
        const selectedValue = this.value;
        const pdfDiv = document.getElementById("pdfDiv");
        const formDiv = document.getElementById("formDiv");

        // Limpar qualquer botão existente nas duas divs
        clearExistingButton(pdfDiv);
        clearExistingButton(formDiv);

        if (selectedValue === "2") {
            // Exibe o PDF e oculta o formulário
            formDiv.style.display = "none";
            pdfDiv.style.display = "flex";

            // Adiciona o botão "Gerar Novo Cálculo" no PDF
        } else if (selectedValue === "1") {
            // Exibe o formulário e oculta o PDF
            pdfDiv.style.display = "none";
            formDiv.style.display = "grid";
            gerarFormulario(); // Gera o formulário vazio

        }
    });

    // Função para limpar o botão caso ele já exista
    function clearExistingButton(container) {
        const existingButton = container.querySelector("#gerarNovoCalculoButton");
        if (existingButton) {
            existingButton.remove();
        }
    }


    // Função para gerar formulário
    function gerarFormulario() {
        const formDiv = document.getElementById("formDiv");
        formDiv.innerHTML = ''; // Limpa o formulário antes de gerar
        formDiv.innerHTML = `
            <div> 
                <span>Por favor, selecione o tipo de plantio</span>
            </div>
            <div style="display: inline">    
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
                    <label class="form-check-label" for="inlineRadio1">Gramíneas</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
                    <label class="form-check-label" for="inlineRadio2">Macieiras</label>
                </div>
            </div>
            `;

        // Ordem correta dos campos conforme o JSON
        const fields = [
            { label: "Fósforo", id: "fosforo" },
            { label: "Potássio", id: "potassio" },
            { label: "Cálcio", id: "calcio" },
            { label: "Magnésio", id: "magnesio" },
            { label: "Índice SMP", id: "indice_smp" },
            { label: "CTC", id: "ctc" },
            { label: "Argila", id: "argila" },
            { label: "Área Plantada", id: "area_plantada" }
        ];

        fields.forEach(field => {
            const inputGroup = document.createElement('div');
            inputGroup.classList.add('form-group');

            const label = document.createElement('label');
            label.innerText = field.label;
            inputGroup.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('form-control');
            input.id = field.id; // Usar o ID diretamente aqui

            // Validação para permitir apenas números
            input.addEventListener('input', (event) => {
                // Permitir apenas números com ou sem ponto decimal para os primeiros campos
                if (field.id !== "area_plantada") {
                    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
                } else {
                    // Permitir apenas números inteiros para "Área Plantada"
                    event.target.value = event.target.value.replace(/[^0-9]/g, '');
                }
            });

            inputGroup.appendChild(input);
            formDiv.appendChild(inputGroup);
        });

        formDiv.innerHTML += `
        <div id="loading" class="center" style="display: none;"> </div>
        `;

        // Botão para converter os dados em JSON
        const jsonButton = document.createElement('button');
        jsonButton.type = 'button';
        jsonButton.classList.add('btn', 'btn-success', 'rounded', 'mt-3');
        jsonButton.innerText = 'Calcular Dados';
        jsonButton.addEventListener('click', transformarEmJSON);

        jsonButton.style.marginTop = '20px';
        formDiv.appendChild(jsonButton);
    }


    // Função para converter em JSON
    function transformarEmJSON() {
        const fosforo = document.getElementById('fosforo').value;
        const potassio = document.getElementById('potassio').value;
        const calcio = document.getElementById('calcio').value;
        const magnesio = document.getElementById('magnesio').value;
        const indice_smp = document.getElementById('indice_smp').value;
        const ctc = document.getElementById('ctc').value;
        const argila = document.getElementById('argila').value;
        const area_plantada = document.getElementById('area_plantada').value;

        const dados = {
            fosforo: fosforo,
            potassio: potassio,
            calcio: calcio,
            magnesio: magnesio,
            indice_smp: indice_smp,
            ctc: ctc,
            argila: argila,
            areaPlantada: area_plantada
        };
        const formDiv = document.getElementById("formDiv");

        let path = "macieiras/pre-plantio/";
        const selectedRadio = formDiv.querySelector(`input[name="inlineRadioOptions"]:checked`);
        const tipoPlanta = selectedRadio ? selectedRadio.value : null;
        
        if (!tipoPlanta) {
            alert("Por favor, selecione um tipo de planta.");
            return;
        } else if (selectedRadio.value === "option1") {
            path = "gramineas-leguminosas-frias/pre-plantio/";
        }

        const loading = document.getElementById('loading');
        loading.innerHTML = `
        <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    `;
        loading.style.display = "block";

        enviarParaServidor(dados, path); // Envia para o servidor
    }

    async function enviarParaServidor(dados, path) {
        const response = await callAPI("POST", path, dados);

        exibirResultados(response)

    }


    function exibirResultados(json) {
        const selectOptions = document.getElementById('selectOptions');
        selectOptions.style.display = 'none'; 
        
        const formDiv = document.getElementById('formDiv');
        formDiv.style.display = 'none'; 

        const formResultDiv = document.getElementById('formResultDiv');
        const formShowResults = document.getElementById('formShowResults');

        formResultDiv.style.display = 'block'; // Exibe a div
        formShowResults.innerHTML = `
            <h4>Resultados:</h4>
            <p><strong>Fósforo por hectare:</strong> ${json.dados.p_quant_hec}</p>
            <p><strong>Fósforo total:</strong> ${json.dados.p_quant_total}</p>
            <p><strong>Potássio por hectare:</strong> ${json.dados.k_quant_hec}</p>
            <p><strong>Potássio total:</strong> ${json.dados.k_quant_total}</p>
            <h4>Calagem:</h4>
            <ul>
                <li><strong>Calcário Calcítico:</strong> ${json.dados.calagem["Calcario Calcítico"].join(', ')}</li>
                <li><strong>Calcário Dolomítico:</strong> ${json.dados.calagem["Calcario Dolomitico"].join(', ')}</li>
            </ul>
            <button class="btn btn-outline-primary" onclick="location.reload()">Calcular Novamente</button>
        `;

    }


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
                let prBoolean = false;
                let intSMP = 0;
                let intCTC = 0;
                let intK = 0;
                let intCa = 0;
                let intMg = 0;
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
                                    adicionarPropriedade("calcio", text.items[95].str.replace(/,/g, '.'));
                                    adicionarPropriedade("magnesio", text.items[97].str.replace(/,/g, '.'));
                                    adicionarPropriedade("ctc", text.items[101].str.replace(/,/g, '.'));
                                    adicionarPropriedade("potassio", text.items[105].str.replace(/,/g, '.'));
                                    amostrasIds.set(labNumber, dados);
                                    dados = {};
                                    i = 105;

                                    // Valores de ref ao verificar próximas linhas.
                                    intSMP = 91;
                                    intCa = 95;
                                    intMg = 97;
                                    intCTC = 101;
                                    intK = 105;
                                    continue;
                                }

                                if (item.str === "(Ca+Mg)/K") {
                                    melichBoolean = false;
                                    continue;
                                }

                                if (item.str === "PR") {
                                    melichBoolean = false;
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
                                            intCa += 28;
                                            intMg += 28;

                                            adicionarPropriedade("indice_smp", text.items[intSMP].str.replace(/,/g, '.'));
                                            adicionarPropriedade("ctc", text.items[intCTC].str.replace(/,/g, '.'));
                                            adicionarPropriedade("potassio", text.items[intK].str.replace(/,/g, '.'));
                                            adicionarPropriedade("calcio", text.items[intCa].str.replace(/,/g, '.'));
                                            adicionarPropriedade("magnesio", text.items[intMg].str.replace(/,/g, '.'));
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
                    var selectOptions = document.getElementById("selectOptions");
                    var resultDiv = document.getElementById("resultDiv");
                    pdfDiv.style.display = "none";
                    selectOptions.style.display = "none";
                    resultDiv.style.display = "block";

                    criarDivs(amostrasIds);
                });
            });
        };
        reader.readAsArrayBuffer(file);
    };
});