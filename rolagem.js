let fichas = JSON.parse(localStorage.getItem('fichas')) || {};

// ===== LISTA =====
function atualizarLista() {
  lista.innerHTML = '<option value="">-- fichas --</option>';

  Object.keys(fichas).forEach(nome => {
    const opt = document.createElement('option');
    opt.value = nome;
    opt.textContent = nome;
    lista.appendChild(opt);
  });
}

// ===== COLETAR DADOS =====
function dados() {
  return {
    nome: nome.value,
    idade: idade.value,
    profissao: profissao.value,
    altura: altura.value,
    historia: historia.value,
    apocalipse: apocalipse.value,
    habilidades: habilidades.value,
    equip: equip.value,
    proficiencia: proficiencia.value,
    attrs: {
      FOR: FOR.value,
      AGI: AGI.value,
      CON: CON.value,
      INT: INT.value,
      PER: PER.value,
      CAR: CAR.value,
      SOB: SOB.value,
      TEC: TEC.value
    },
    img: img.src,
    log: log.innerHTML
  };
}

// ===== SALVAR =====
function salvarFicha() {
  const requiredEls = Array.from(document.querySelectorAll('input[required], textarea[required]'));
  const missing = requiredEls.filter(el => {
    if (el.type === 'checkbox' || el.type === 'radio') return !el.checked;
    return !(el.value && el.value.toString().trim().length > 0);
  });

  if (missing.length) {
    const names = missing.map(el => {
      const lab = document.querySelector(`label[for="${el.id}"]`);
      if (lab) return lab.textContent.trim();
      if (el.placeholder) return el.placeholder;
      return el.id;
    });
    alert('Preencha os seguintes campos obrigatórios:\n' + names.join(', '));
    return;
  }

  fichas[nome.value] = dados();
  localStorage.setItem('fichas', JSON.stringify(fichas));
  atualizarLista();
  alert('Ficha salva');
}

// ===== CARREGAR =====
function carregarFicha() {
  const f = fichas[lista.value];
  if (!f) return;

  nome.value = f.nome || '';
  idade.value = f.idade || '';
  profissao.value = f.profissao || '';
  altura.value = f.altura || '';
  historia.value = f.historia || '';
  apocalipse.value = f.apocalipse || '';
  habilidades.value = f.habilidades || '';
  equip.value = f.equip || '';
  proficiencia.value = f.proficiencia || '';

  Object.keys(f.attrs || {}).forEach(a => {
    const campo = document.getElementById(a);
    if (campo) campo.value = f.attrs[a];
  });

  img.src = f.img || '';
  const temImagem = !!f.img;
  placeholder.style.display = temImagem ? 'none' : 'block';
  imgBtn.style.display = temImagem ? 'none' : 'block';

  log.innerHTML = f.log || '';
}

// ===== APAGAR =====
function apagarFicha() {
  const nomeFicha = lista.value;

  if (!nomeFicha) {
    alert('Selecione uma ficha para apagar');
    return;
  }

  if (!confirm(`Tem certeza que deseja apagar a ficha "${nomeFicha}"?`)) return;

  delete fichas[nomeFicha];
  localStorage.setItem('fichas', JSON.stringify(fichas));

  atualizarLista();
  novaFicha();

  alert('Ficha apagada com sucesso');
}

// ===== NOVA =====
function novaFicha() {
  document.querySelectorAll('input, textarea').forEach(e => e.value = '');
  img.src = '';
  placeholder.style.display = 'block';
  imgBtn.style.display = 'block';
  log.innerHTML = '';
  lista.value = '';
}

// ===== IMAGEM =====
function abrirImagem() {
  fileImg.click();
}

function carregarImagem(e) {
  if (!e.target.files[0]) return;

  const r = new FileReader();
  r.onload = () => {
    img.src = r.result;
    placeholder.style.display = 'none';
    imgBtn.style.display = 'none';
  };
  r.readAsDataURL(e.target.files[0]);
}

// ===== ROLAGEM (MENOR É MELHOR) =====
function rolar() {
  const entrada = prompt('Ex: d20, d20 FOR, 2d6 AGI');
  if (!entrada) return;

  const partes = entrada.trim().split(' ');
  const dado = partes[0];
  let atributo = partes[1];

  let total = 0;

  dado.replace(/\s+/g, '').split('+').forEach(p => {
    if (p.includes('d')) {
      let [n, l] = p.split('d');
      n = parseInt(n) || 1;
      l = parseInt(l);

      for (let i = 0; i < n; i++) {
        total += Math.floor(Math.random() * l) + 1;
      }
    } else {
      total += parseInt(p) || 0;
    }
  });

  let atributoValor = 0;
  if (atributo) {
    atributo = atributo.toUpperCase();
    const campo = document.getElementById(atributo);
    if (campo) {
      atributoValor = parseInt(campo.value) || 0;
      total -= atributoValor;
    }
  }

  let texto = `${entrada} → resultado: ${total}`;
  if (atributoValor) texto += ` (−${atributoValor} ${atributo})`;

  const div = document.createElement('div');
  div.textContent = texto;
  log.prepend(div);

  alert('Resultado final: ' + total);
}

// ===== INIT =====
atualizarLista();
