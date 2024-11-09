import { callAPI } from './api.js';

export function criarDivs(lista) {
    const container = document.getElementById('showAmostras');
    container.innerHTML = ''; 

    for (const chave of lista.keys()) {
        const div = document.createElement('div'); 

        div.innerHTML = `
            <h3>Ref. ${chave}</h3>
            <div class="row g-2" style="margin-bottom: 40px;">
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
                <div class="col-md" style="display: inline-flex; align-items: center;">
                    <div class="form-floating" style="width: 50%; display:flex">
                        <input type="email" class="form-control" id="floatingInputGrid" placeholder="Área plantada em Hectares" value="">
                        <label for="floatingInputGrid">Área plantada em Hectares</label>
                    </div>
                    <div style="margin-left: 10px">
                        <button type="button" class="btn btn-success">Calcular</button>
                        <button type="button" class="btn btn-primary" disabled>
                            <i class="fa fa-file-excel"></i>
                        </button>
                    </div>
                </div>
            </div>
            <p></p>
        `;

        const successButton = div.querySelector('.btn-success');
        successButton.addEventListener('click', function () {
            alert(`Detalhes da ${chave}`);
        });

        container.appendChild(div);
    }
}
