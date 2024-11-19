import { callAPI } from './api.js';

export function criarDivs(lista) {
    const container = document.getElementById('showAmostras');
    container.innerHTML = '';
    let responseModals = new Map();

    for (const chave of lista.keys()) {
        const div = document.createElement('div');

        div.innerHTML = `
            <h3>Ref. ${chave}</h3>
            <div class="row g-2" style="margin-bottom: 40px;">
                <div style="display: inline">    
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions_${chave}" id="inlineRadio1_${chave}" value="option1">
                        <label class="form-check-label" for="inlineRadio1_${chave}">Gramíneas</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions_${chave}" id="inlineRadio2_${chave}" value="option2">
                        <label class="form-check-label" for="inlineRadio2_${chave}">Macieiras</label>
                    </div>
                </div>
                <div class="col-md" style="display: inline-flex; align-items: center;">
                    <div class="form-floating" style="width: 50%; display:flex">
                        <input type="number" class="form-control" id="floatingInputGrid_${chave}" placeholder="Área plantada em Hectares" value="">
                        <label for="floatingInputGrid_${chave}">Área plantada em Hectares</label>
                    </div>
                    <div style="margin-left: 10px">
                        <div id="loading_${chave}" style="display: none;"> </div>
                        <button type="button" class="btn btn-success">Calcular</button>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detalhesModal" disabled>
                            Visualizar Resultados
                            <i class="fa fa-file-excel"></i>
                        </button>
                    </div>
                </div>
            </div>
            <p></p>
        `;

        const modalButton = div.querySelector('.btn-primary');
        const successButton = div.querySelector('.btn-success');
        successButton.addEventListener('click', async function () {
            
            let path = "macieiras/pre-plantio/";
            const selectedRadio = div.querySelector(`input[name="inlineRadioOptions_${chave}"]:checked`);
            const tipoPlanta = selectedRadio ? selectedRadio.value : null;
            
            if (!tipoPlanta) {
                alert("Por favor, selecione um tipo de planta.");
                return;
            } else if (selectedRadio.value === "option1") {
                path = "gramineas-leguminosas-frias/pre-plantio/";
            }
            
            // Referência ao campo de input dentro do div
            const areaPlantadaInput = div.querySelector(`#floatingInputGrid_${chave}`);
    
            // Obtenha o valor inserido no campo de input
            const areaPlantada = areaPlantadaInput.value;
    
            if (!areaPlantada) {
                alert("Por favor, preencha a área plantada em hectares.");
                return;
            }

            successButton.disabled = true;

            const loading = document.getElementById(`loading_${chave}`); 
            loading.innerHTML = `
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
            loading.style.display = "contents";


            // Atualizando o objeto no Map
            const item = lista.get(chave);
            item.areaPlantada = areaPlantada;

            const response = await callAPI("POST", path, item);
            responseModals.set(chave, response);

            const restoredButton = document.createElement('button');
            restoredButton.classList.add('btn', 'btn-success');
            restoredButton.type = 'button';
            restoredButton.textContent = 'Calcular';

            console.log("Response:", response);
            loading.style.display = "none";
            alert("Cálculo Realizado");
            successButton.disabled = false;
            modalButton.disabled = false;
        });

        // Adiciona o evento ao ícone de planilha (botão Excel)
        const excelButton = div.querySelector('.btn-primary');
        excelButton.addEventListener('click', function () {
            // Pega o valor do Map para o item correspondente à chave
            const responseData = responseModals.get(chave);
            // Preenche o conteúdo do modal
            const modalContent = document.getElementById('modal-content');
            modalContent.innerHTML = `
            <h3>${responseData.message}</h3>
            <br>
            <h4>Dados Calculados:</h4>
            <ul>
                <li><strong>K₂O Quant Hectare:</strong> ${responseData.dados.k_quant_hec.toFixed(2)}</li>
                <li><strong>K₂O Quant Total:</strong> ${responseData.dados.k_quant_total.toFixed(2)}</li>
                <li><strong>P₂O₅ Quant Hectare:</strong> ${responseData.dados.p_quant_hec.toFixed(2)}</li>
                <li><strong>P₂O₅ Quant Total:</strong> ${responseData.dados.p_quant_total.toFixed(2)}</li>
            </ul>
            <h4>Calagem:</h4>
            <ul>
                <li><strong>Calcário Calcítico:</strong> ${responseData.dados.calagem["Calcario Calcítico"].join(', ')}</li>
                <li><strong>Calcário Dolomítico:</strong> ${responseData.dados.calagem["Calcario Dolomitico"].join(', ')}</li>
            </ul>
        `;
        });


        container.appendChild(div);
    }


}
